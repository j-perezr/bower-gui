import * as React from "react";
import { BowerSrv } from "./BowerSrv";
export interface BowerProps { }

export class Bower extends React.Component<BowerProps, {}> {
    protected bowerSrv:BowerSrv;
    constructor(){
        super();
        this._init();
    }
    protected _init(){
        this.bowerSrv = new BowerSrv();
        var that = this;
        this.bowerSrv.connect().then(function(){
            that.bowerSrv.getPackages();
        })
    }
    render() {
        return <h1>Hi</h1>
    }
}

