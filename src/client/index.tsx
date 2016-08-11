///<reference path="typings/index.d.ts"/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Bower } from "./bower/Bower";
require("file!./index.html");

ReactDOM.render(
    <Bower/>,
    document.getElementById("main")
);