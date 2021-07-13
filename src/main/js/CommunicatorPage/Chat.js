import {Avatar, CircularProgress, IconButton, InputBase, Paper, Toolbar, Typography} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import axios from "axios";

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messageValue: ""
        }

        this.onInputChanged = this.onInputChanged.bind(this);
        this.sendWrittenMessage = this.sendWrittenMessage.bind(this);
    }

    onInputChanged(event){
        const input = event.target;
        console.log(input.value)
        this.setState({
            messageValue: input.value
        });
    }

    async sendWrittenMessage(){
        if(this.state.messageValue.length === 0)
            return;

        await axios.post("/api/conversation/with/" + encodeURI(this.props.recipient.contactName), {
            content: this.state.messageValue
        });

        this.props.onMessageSent();

        this.setState({
            messageValue: ""
        });
    }

    render() {
        return (
            <div style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div>
                    <Toolbar style={{
                        backgroundColor: "#f5f5f5"
                    }}>
                        <Avatar style={{background: this.props.recipient.contactName.toRGB()}}>
                            {this.props.recipient.contactName.substring(0, 1)}
                        </Avatar>
                        <div style={{
                            padding: "10px"
                        }}>
                            <Typography variant="h6">
                                {this.props.recipient.contactName}
                            </Typography>
                        </div>
                    </Toolbar>
                </div>

                <div style={{
                    height: "100%",
                    overflowY: "scroll"
                }}>
                    {this.props.messages === null ?
                        <div style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div>
                                <CircularProgress color="primary"/>
                            </div>
                        </div>
                        :
                        <div>
                            {this.props.messages.map(message=>
                                <div style={{
                                    marginTop: "5px",
                                    marginLeft: "30px",
                                    marginRight: "30px",
                                    display: "flex",
                                    justifyContent: message.senderName === this.props.recipient.contactName ? "flex-start" : "flex-end"
                                }}>
                                    <Paper>
                                        <div style={{
                                            padding: "5px",
                                            position: "relative",
                                        }}>
                                            <Typography variant="body1">
                                                {message.content}
                                            </Typography>

                                            <div style={{
                                                position: "relative",
                                                textAlign: "right"
                                            }}>
                                                <Typography variant="caption" style={{color: "rgba(0,0,0,0.4)"}}>
                                                    {new Date(Date.parse(message.instant)).toLocaleTimeString(undefined, {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        second: 'numeric'})}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            )}
                        </div>
                    }
                </div>

                <Toolbar style={{
                    backgroundColor: "#f5f5f5"
                }}>
                    <InputBase
                        placeholder="..."
                        name="message"
                        onChange={this.onInputChanged}
                        value={this.state.messageValue}
                        style={{
                            padding: "20px",
                            // vertical padding + font size from searchIcon
                            width: '100%',
                            height: "40%",
                            backgroundColor: "rgba(255,255,255,0.82)"
                        }}
                        onKeyUp={async (e) => {
                            if (e.key === "Enter")
                                await this.sendWrittenMessage();
                        }}
                    />
                    <IconButton onClick={this.sendWrittenMessage}>
                        <SendIcon />
                    </IconButton>
                </Toolbar>
            </div>
        );
    }
}

export default Chat;

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