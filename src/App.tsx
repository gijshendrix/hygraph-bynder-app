import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Wrapper as AppWrapper } from "@graphcms/app-sdk-react";

import AppElement from "./routes/AppElement";
import Config from "./routes/Config";
import Dialog from "./routes/Dialog";
import "./App.css";

if (typeof window !== "undefined" && typeof window.newrelic !== "undefined") {
 window.newrelic.setCustomAttribute("gcmsApp", "bynder");
}

function App() {
  return (
    <AppWrapper>
      <Router>
        <Switch>
          <Route path="/element">
            <AppElement />
          </Route>
          <Route path="/config">
            <Config />
          </Route>
          <Route path="/dialog">
            <Dialog />
          </Route>
        </Switch>
      </Router>
    </AppWrapper>
  );
}

export default App;
