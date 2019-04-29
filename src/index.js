import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import * as serviceWorker from "./serviceWorker";
import firebase from "./firebase";
import history from "./history";

import "semantic-ui-css/semantic.min.css";

import { Router, Switch, Route } from "react-router-dom";

const Root = () => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("login ok");
        history.push("/");
      }
    });
  }, []);

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
