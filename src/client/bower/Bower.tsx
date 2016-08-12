import * as React from "react";
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

export interface BowerProps { }

export class Bower extends React.Component<BowerProps, {}> {
    render() {
        return <h1>Hi</h1>;
    }
}

