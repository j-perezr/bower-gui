///<reference path="typings/index.d.ts"/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, Link, hashHistory } from 'react-router';
import { Main } from "./Main";
import { Bower } from "./bower/Bower";
require("./index.html");
ReactDOM.render(
    <Router history={hashHistory}>
        <Main/>
        <IndexRoute component={Main} />
        <Route path="/" component={Main}>
            <Route path="bower" component={Bower} />
        </Route>
    </Router>,
    document.getElementById("main")
);
