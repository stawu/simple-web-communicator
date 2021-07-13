import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import CommunicatorPage from "./CommunicatorPage";
import LoginPage from "./LoginPage";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import RegisterPage from "./RegisterPage";

axios.interceptors.response.use(fulfilledResponse => {
    if(fulfilledResponse.request["responseURL"].endsWith("/login"))
        window.dom_history.push("/login");
    else
        return fulfilledResponse;
}, error => {
    console.log(error.response)

    if(error.response.status === 401 || error.response.status === 403)
        window.dom_history.push("/login");
    else
        return error;
});

function App() {
    window.dom_history = useHistory();

    return (
        <Container>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/" component={CommunicatorPage}/>
                </Switch>
        </Container>
    );
}

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.querySelector('#react'));