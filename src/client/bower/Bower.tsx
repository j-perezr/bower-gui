import * as React from "react";
import { BowerSrv } from "./BowerSrv";
export interface BowerProps { }

export class Bower extends React.Component<BowerProps, {}> {
    protected bowerSrv:BowerSrv;
    constructor(){
        super();
        this.bowerSrv = new BowerSrv();
        this.bowerSrv.connect();
    }
    render() {
        return <h1>Hi</h1>
    }
}

