import AddIcon from "@material-ui/icons/Add";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab, TextField
} from "@material-ui/core";
import React from "react";
import axios from "axios";

class AddContactButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false
        }

        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onContactNameInputChange = this.onContactNameInputChange.bind(this);
        this.onDialogAddButtonClicked = this.onDialogAddButtonClicked.bind(this);
    }

    onButtonClicked() {
        console.log("open")
        this.setState({
            dialogOpen: true,
            dialogContactName: "",
            dialogUserErrorText: ""
        });
    }

    closeDialog(){
        console.log("close")
        this.setState({
            dialogOpen: false
        });
    }

    onContactNameInputChange(newValue){
        this.setState({
            dialogContactName: newValue
        });
    }

    async onDialogAddButtonClicked(){
        const res = await axios.post("api/contacts", {
            contactName: this.state.dialogContactName
        });

        if(res.response !== undefined && res.response.status === 404) {
            this.setState({
                dialogUserErrorText: "Użytkownik nie istnieje!"
            });
        }
        else if(res.response !== undefined && res.response.status === 400){
            this.setState({
                dialogUserErrorText: "Dodanie tej osoby nie ma sensu!"
            });
        }
        else if(res.status === 200){
            this.closeDialog();
            this.props.onNewContactAdded();
        }
    }

    render() {
        return (
            <div>
                <Fab
                    color="primary"
                    onClick={this.onButtonClicked}
                >
                    <AddIcon />
                </Fab>

                <Dialog open={this.state.dialogOpen}>
                    <DialogTitle>
                        Dodawanie kontaktu
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Podaj nazwę użytkownika
                        </DialogContentText>

                        <TextField
                            onChange={(e) => this.onContactNameInputChange(e.target.value)}
                            error={this.state.dialogUserErrorText !== ""}
                            helperText={this.state.dialogUserErrorText}
                        >

                        </TextField>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            color="secondary"
                            onClick={this.closeDialog}
                        >
                            Anuluj
                        </Button>
                        <Button
                            color="primary"
                            onClick={this.onDialogAddButtonClicked}
                        >
                            Dodaj
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default AddContactButton;