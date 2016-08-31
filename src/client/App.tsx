///<reference path="typings/index.d.ts"/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as log from "loglevel";
import { LogPrefix } from "./common/LogPrefix";
import { Router, Route, hashHistory, Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Bower } from "./bower/Bower";
require("./index.html");
require("../../node_modules/normalize.css/normalize.css");
require("../../node_modules/flexboxgrid/dist/flexboxgrid.css");
//config log
log.setDefaultLevel(0);
new LogPrefix(log.getLogger("client"));

export interface AppProps { }
export class App extends React.Component<AppProps, {}> {
    render() {
        return <div className="wrapper">
            <div className="row">
                <div className="col-xs">
                </div>
            </div>
        </div>
    }
}
ReactDOM.render(
    <MuiThemeProvider>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <Route path="/bower" component={Bower}></Route>
            </Route>
        </Router>
    </MuiThemeProvider>,
    document.getElementById("main")
);
