import Contact from "./Contact";
import React from "react";
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    List,
    ListItem, ListItemIcon,
    ListItemText,
    TextField
} from "@material-ui/core";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';

class ContactsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contactHover: null,
            contactOptions: null,
            contactOptionsChangeDisplayNameOpen: false,
            alternativeNameValue: ""
        }

        this.onMouseEnterContact = this.onMouseEnterContact.bind(this);
        this.onMouseLeaveContact = this.onMouseLeaveContact.bind(this);
        this.onContactClicked = this.onContactClicked.bind(this);
        this.onOptionsOfContactClicked = this.onOptionsOfContactClicked.bind(this);
        this.closeContactOptions = this.closeContactOptions.bind(this);
        this.onDeleteContactInContactsOptionsClicked = this.onDeleteContactInContactsOptionsClicked.bind(this);
        this.onChangeDisplayNameOfContactOptionsClicked = this.onChangeDisplayNameOfContactOptionsClicked.bind(this);
        this.changeDisplayNameOfContact = this.changeDisplayNameOfContact.bind(this);
        this.onDisplayNameInputChange = this.onDisplayNameInputChange.bind(this);
        this.closeChangeDisplayNameDialog = this.closeChangeDisplayNameDialog.bind(this);
    }

    onMouseEnterContact(contact){
        this.setState({
            contactHover: contact
        });
    }

    onMouseLeaveContact(contact){
        this.setState({
            contactHover: null
        });
    }

    onContactClicked(contact){
        this.props.onContactSelected(contact);
    }

    onOptionsOfContactClicked(contact){
        console.log(contact)
        this.setState({
            contactOptions: contact
        })
    }

    closeContactOptions(){
        this.setState({
            contactOptions: null
        })
    }

    async onDeleteContactInContactsOptionsClicked(){
        await axios.delete("/api/contacts/" + encodeURI(this.state.contactOptions.contactName));
        this.closeContactOptions();
        this.props.onContactsDataChanged();
    }

    onChangeDisplayNameOfContactOptionsClicked(){
        this.setState(prevState => ({
            alternativeNameValue: prevState.contactOptions.alternativeName,
            contactOptionsChangeDisplayNameOpen: true
        }));
    }

    async changeDisplayNameOfContact(){
        await axios.post("/api/contacts/" + encodeURI(this.state.contactOptions.contactName), {
            alternativeName: this.state.alternativeNameValue
        });
        this.closeChangeDisplayNameDialog();
        this.props.onContactsDataChanged();
    }

    onDisplayNameInputChange(newValue){
        this.setState({
            alternativeNameValue: newValue.valueOf()
        });
    }

    closeChangeDisplayNameDialog() {
        this.closeContactOptions();
        this.setState({
            contactOptionsChangeDisplayNameOpen: false,
        });
    }

    render() {
        return (
            <div>
                {this.props.contacts.map(contact =>
                    <div style={{
                        marginTop: "10px",
                        cursor: "pointer"
                    }}
                         onMouseEnter={() => this.onMouseEnterContact(contact)}
                         onMouseLeave={() => this.onMouseLeaveContact(contact)}
                         onClick={() => this.onContactClicked(contact)}
                    >
                        <div style={{
                            position: "relative"
                        }}>
                            <Contact selected={this.state.contactHover === contact} userName={contact.contactName} alternativeName={contact.alternativeName}/>

                            {this.state.contactHover === contact &&
                            <div style={{
                                position: "absolute",
                                top: "0px",
                                left: "5px"
                            }}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {e.stopPropagation(); this.onOptionsOfContactClicked(contact);}}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                            </div>}
                        </div>
                    </div>
                )}

                <Dialog open={this.state.contactOptions !== null} onClose={this.closeContactOptions}>
                    <List>
                        <ListItem button onClick={this.onChangeDisplayNameOfContactOptionsClicked}>
                            <ListItemIcon>
                                <LabelIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Zmień wyświetlaną nazwę na inną
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={this.onDeleteContactInContactsOptionsClicked}>
                            <ListItemIcon>
                                <DeleteIcon style={{color: "red"}}/>
                            </ListItemIcon>
                            <ListItemText>
                                Usuń znajomego
                            </ListItemText>
                        </ListItem>
                    </List>
                </Dialog>

                <Dialog open={this.state.contactOptionsChangeDisplayNameOpen}>
                    <DialogTitle>
                        Zmiana wyświetlanej nazwy
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Podaj nazwę z jaką chcesz aby dany użytkownik był wyświetlany
                        </DialogContentText>

                        <TextField
                            onChange={(e) => this.onDisplayNameInputChange(e.target.value)}
                            value={this.state.alternativeNameValue}
                            //error={this.state.dialogUserErrorText !== ""}
                            //helperText={this.state.dialogUserErrorText}
                        >

                        </TextField>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            color="secondary"
                            onClick={this.closeChangeDisplayNameDialog}
                        >
                            Anuluj
                        </Button>
                        <Button
                            color="primary"
                            onClick={this.changeDisplayNameOfContact}
                        >
                            Ustaw
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ContactsList;