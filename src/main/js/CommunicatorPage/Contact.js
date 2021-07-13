import {Avatar, Paper, Typography} from "@material-ui/core";
import React from "react";
import axios from "axios";

class Contact extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lastMessageValue: "",
            lastMessageDateStr: ""
        }

        this.getLastMessage = this.getLastMessage.bind(this);
        this.poolingData = this.poolingData.bind(this);
    }

    poolingData(){
        this.getLastMessage()
    }

    componentDidMount() {
        this.getLastMessage();

        setInterval(this.poolingData, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.poolingData);
    }

    async getLastMessage(){
        const res = await axios.get("/api/conversation/with/" + encodeURI(this.props.userName))
        let msg = res.data[res.data.length-1].content;
        if(msg.length > 25)
            msg = msg.substring(0, 25) + "...";

        const msgDate = new Date(Date.parse(res.data[res.data.length-1].instant));

        this.setState({
            lastMessageValue: msg,
            lastMessageDateStr: msgDate.toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'})
        })
    }

    render() {
        return (
            <Paper elevation={this.props.selected ? 24 : 1}>
                <div style={{
                    padding: "10px",
                    display: "flex"
                }}
                >
                    <div style={{
                        width: '100%',
                        padding: "15px",
                        flex: "1"
                    }}
                    >
                        <Avatar style={{background: this.props.userName.toRGB()}}>
                            {this.props.userName.substring(0, 1)}
                        </Avatar>
                    </div>

                    <div style={{
                        width: '100%',
                        flex: "5"
                    }}
                    >
                        <div style={{
                            display: "flex"
                        }}>
                            <div style={{
                                width: "100%",
                                flex: "7"
                            }}>
                                {this.props.alternativeName === null || this.props.alternativeName === "" ?
                                    <Typography variant="h6">
                                        {this.props.userName}
                                    </Typography>
                                    :
                                    <Typography variant="h6" style={{fontStyle: "italic"}}>
                                        {this.props.alternativeName}
                                    </Typography>
                                }
                            </div>

                            <div style={{
                                width: "100%",
                                flex: "3",
                                textAlign: "right"
                            }}>
                                <Typography variant="caption">
                                    {this.state.lastMessageDateStr}
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <Typography variant="subtitle1">
                                {this.state.lastMessageValue}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default Contact;

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