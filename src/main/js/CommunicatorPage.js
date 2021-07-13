import {
    Avatar,
    Grid, Hidden,
    IconButton,
    Menu, MenuItem,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import React from "react";
import axios from "axios";
import AddContactButton from "./CommunicatorPage/AddContactButton";
import ContactsList from "./CommunicatorPage/ContactsList";
import Chat from "./CommunicatorPage/Chat";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

class CommunicatorPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            me: null,
            contacts: [],
            selectedContact: null,
            messages: null,
            avatarMenuAnchorEl: null
        };

        this.poolingData = this.poolingData.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.onContactSelected = this.onContactSelected.bind(this);
        this.getConversationData = this.getConversationData.bind(this);
        this.onMeAvatarClicked = this.onMeAvatarClicked.bind(this);
        this.closeMeAvatarMenu = this.closeMeAvatarMenu.bind(this);
        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    poolingData(){
        if(this.state.selectedContact === null)
            return;

        this.getConversationData()
    }

    async componentDidMount() {
        await this.getMeInformation();
        await this.getContacts();

        setInterval(this.poolingData, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.poolingData);
    }

    async getContacts() {
        const contactsResponse = await axios.get("/api/contacts");
        this.setState({
            contacts: contactsResponse.data
        })
    }

    onContactSelected(contact) {
        this.setState({
            selectedContact: contact,
            messages: null
        }, ()=>{
            setTimeout(this.getConversationData, 700);
        });
    }

    async getConversationData(){
        if(this.state.selectedContact.contactName === null)
            return;

        const res = await axios.get("/api/conversation/with/" + encodeURI(this.state.selectedContact.contactName))
        this.setState({
            messages: res.data
        })
    }

    async getMeInformation(){
        const res = await axios.get("/api/me");
        this.setState({
            me: res.data
        });
    }

    onMeAvatarClicked(e){
        this.setState({
            avatarMenuAnchorEl: e.target
        });
    }

    closeMeAvatarMenu(){
        this.setState({
            avatarMenuAnchorEl: null
        });
    }

    async onLogoutClicked(){
        await axios.get("/logout")
        this.props.history.push("/login")
    }

    render() {
        return (
            <Grid container>
                <Hidden smDown>
                    <Grid item md={9}>
                        <Paper style={{
                            marginTop: "10px",
                            height: "95vh"
                        }}
                        elevation={6}
                        >
                            {this.state.selectedContact !== null &&
                                <Chat
                                    recipient={this.state.selectedContact}
                                    messages={this.state.messages}
                                    onMessageSent={this.getConversationData}
                                />
                            }
                        </Paper>
                    </Grid>
                </Hidden>

                <Grid item xs={12} md={3}>
                    <Paper style={{
                        marginTop: "10px",
                        height: "95vh"
                    }}
                    elevation={6}
                    >
                        <div style={{
                            height: "100%",
                            position: "relative"
                        }}>
                            <Toolbar style={{
                                backgroundColor: "#f5f5f5"
                            }}>
                                <div style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "flex-end",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <Typography variant="h6">
                                            {this.state.me !== null ? this.state.me.contactName : ""}
                                        </Typography>
                                    </div>
                                    {this.state.me === null ? <Avatar>?</Avatar>
                                        :
                                        <IconButton onClick={this.onMeAvatarClicked}>
                                            <Avatar style={{background: this.state.me.contactName.toRGB()}}>
                                                {this.state.me.contactName.substring(0, 1)}
                                            </Avatar>
                                        </IconButton>
                                    }

                                    <Menu
                                        anchorEl={this.state.avatarMenuAnchorEl}
                                        keepMounted
                                        open={Boolean(this.state.avatarMenuAnchorEl)}
                                        onClose={this.closeMeAvatarMenu}
                                    >
                                        <MenuItem onClick={this.onLogoutClicked}>Wyloguj</MenuItem>
                                    </Menu>
                                </div>
                            </Toolbar>

                            <div>
                                <Typography variant="h6">
                                    Twoi znajomi:
                                </Typography>

                                <ContactsList
                                    contacts={this.state.contacts}
                                    onContactsDataChanged={this.getContacts}
                                    onContactSelected={this.onContactSelected}
                                />
                            </div>

                            <div style={{
                                position: "absolute",
                                bottom: "20px",
                                right: "20px"
                            }}>
                                <AddContactButton onNewContactAdded={this.getContacts} />
                            </div>
                        </div>

                        <Hidden mdUp>
                            {this.state.selectedContact !== null &&
                                <div>
                                    <div style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        right: "10px",
                                        bottom: "10px",
                                        background: "white"
                                    }}>
                                        <Chat
                                            recipient={this.state.selectedContact}
                                            messages={this.state.messages}
                                            onMessageSent={this.getConversationData}
                                        />
                                    </div>

                                    <IconButton style={{
                                        position: "absolute",
                                        right: "15px",
                                        top: "15px"
                                    }}
                                        onClick={()=>{this.setState({selectedContact: null})}}
                                    >
                                        <KeyboardReturnIcon/>
                                    </IconButton>
                                </div>
                            }
                        </Hidden>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default CommunicatorPage;

String.prototype.toRGB = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        hash = this.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}