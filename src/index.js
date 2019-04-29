import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Spinner from "./components/common/Spinner";
import Register from "./components/Auth/Register";
import * as serviceWorker from "./serviceWorker";
import firebase from "./firebase";
import history from "./history";
import { setUser } from "./action";
import Store, { StoreProvider } from "./Store";

import "semantic-ui-css/semantic.min.css";

import { Router, Switch, Route } from "react-router-dom";

const Root = () => {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("login ok");
        dispatch(setUser(user));
        history.push("/");
      }
    });
  }, []);

  return state.user.loading ? (
    <Spinner />
  ) : (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <StoreProvider>
    <Root />
  </StoreProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
