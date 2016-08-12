///<reference path="typings/index.d.ts"/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, Link, hashHistory } from 'react-router';
import { Bower } from "./bower/Bower";
require("./index.html");
export interface AppProps { }
export class App extends React.Component<AppProps, {}> {
    render() {
        return <div>
                    <h1>Main</h1>
                    {this.props.children}
                </div>
    }
}
ReactDOM.render(
    <Router history={hashHistory}>
        <Bower/>
        <Route path="/" component={App}>
            <Route path="/bower" component={Bower}></Route>
        </Route>
    </Router>,
    document.getElementById("main")
);
