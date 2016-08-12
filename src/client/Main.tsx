/// <reference path="typings/index.d.ts" />
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Bower} from "./bower/Bower";
export class Main extends React.Component<{}, {}> {
    render() {
        return <Bower/>;
    }
}