import React from "react"
import {Button, Grid, Paper, Snackbar, TextField, Typography} from "@material-ui/core";
import axios from "axios";
import * as PropTypes from "prop-types";
import {Link} from "react-router-dom";

function Alert(props) {
    return null;
}

Alert.propTypes = {
    severity: PropTypes.string,
    onClose: PropTypes.any,
    children: PropTypes.node
};

class RegisterPage extends React.Component {

    registerData = {
        login: "",
        password: ""
    }

    constructor(props) {
        super(props);

        this.state = {
            loginValue: this.registerData.login.valueOf(),
            passwordValue: this.registerData.password.valueOf(),
            loginError: false,
            passwordError: false,
            alertOpen: false,
            password2Error: false
        };

        this.onInputChanged = this.onInputChanged.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
    }

    onInputChanged(event){
        const input = event.target;
        this.registerData[input.name] = input.value;

        if(input.name === "login"){
            this.setState({
                loginValue: this.registerData.login.valueOf(),
                alertOpen: false,
                loginError: !input.value.match("^[a-zA-Z0-9]{4,10}$")
            });
        }
        else if(input.name === "password"){
            this.setState({
                passwordValue: this.registerData.password.valueOf(),
                password2Error: true,
                passwordError: !input.value.match("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")
            });
        }
        else if(input.name === "password2"){
            this.setState({
                password2Error: input.value !== this.registerData.password.valueOf()
            });
        }
    }

    async registerClicked() {
        const loginResponse = await axios.post("/api/register", {
            userName: this.registerData.login,
            password: this.registerData.password
        });

        if(loginResponse.status !== undefined && loginResponse.status === 200){
            this.props.history.push("/login");
        }
        else
            this.setState({alertOpen: true});
    }

    render() {
        return (
            <Paper style={{
                height: "95vh"
            }}>
                <div style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <Grid
                        container
                        direction="column"
                        spacing={3}
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h6">
                                Stwórz nowe konto
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                name="login"
                                label="Login"
                                onChange={this.onInputChanged}
                                error={this.state.loginError}
                                helperText={this.state.loginError ? "Jedno słowo, bez specjalnych znaków, od 4 do 10 znaków" : ""}
                                style={{
                                    width: "180px"
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="password"
                                name="password"
                                label="Hasło"
                                onChange={this.onInputChanged}
                                error={this.state.passwordError}
                                helperText={this.state.passwordError ? "Minimum 8 znaków, jedna litera oraz cyfra" : ""}
                                style={{
                                    width: "180px"
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="password"
                                name="password2"
                                label="Powtórz hasło"
                                onChange={this.onInputChanged}
                                error={this.state.password2Error}
                                helperText={this.state.password2Error ? "Hasła nie są identyczne" : ""}
                                style={{
                                    width: "180px"
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={
                                    (this.state.loginValue.length === 0 || this.state.passwordValue.length === 0)
                                    ||
                                    (this.state.loginError || this.state.passwordError || this.state.password2Error)
                                    ||
                                    (this.state.alertOpen)
                                }
                                color="primary"
                                onClick={this.registerClicked}>
                                Stwórz konto
                            </Button>
                        </Grid>
                        <Grid item>
                            <Link to="/login">Wróć do strony logowania</Link>
                        </Grid>
                    </Grid>
                </div>

                <Snackbar
                    open={this.state.alertOpen}
                    message="Podane konto już istnieje!"
                    autoHideDuration={6000}
                    onClose={ () => this.setState({alertOpen: false}) }
                />
            </Paper>
        );
    }
}

export default RegisterPage;