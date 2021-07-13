import React from "react"
import {Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import axios from "axios";
import {
    Link
} from "react-router-dom";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginValue: "",
            passwordValue: "",

            inputError: false
        }

        this.loginClicked = this.loginClicked.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
    }

    async loginClicked() {
        const loginResponse = await axios.post("/login",
            "username=" + this.state.loginValue + "&password=" + this.state.passwordValue);
        console.log(loginResponse)
        if(loginResponse.data !== undefined){
            const titleBegin = loginResponse.data.indexOf("<title>");
            const titleEnd = loginResponse.data.indexOf("</title>");
            if(loginResponse.data.substring(titleBegin, titleEnd) === "<title>Please sign in")
                this.setState({
                    inputError: true
                });
            else{
                this.props.history.push("/")
            }
        }
    }

    onInputChanged(event){
        const input = event.target;
        if(input.name === "login")
            this.setState({loginValue: input.value.valueOf()});

        else if(input.name === "password")
            this.setState({passwordValue: input.value.valueOf()});
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
                                Podaj dane konta
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                name="login"
                                label="Login"
                                onChange={this.onInputChanged}
                                error={this.state.inputError}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                name="password"
                                type="password"
                                label="Hasło"
                                onChange={this.onInputChanged}
                                error={this.state.inputError}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={
                                    (this.state.loginValue.length === 0 || this.state.passwordValue.length === 0)
                                }
                                color="primary"
                                onClick={this.loginClicked}>
                                Zaloguj się
                            </Button>
                        </Grid>
                        <Grid item>
                            <Link to="/register">Stwórz nowe konto</Link>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default LoginPage;