/// <reference path="../../../typings/index.d.ts" />
import * as logger from "../common/Logger";
import * as bower from "bower"
import * as Q from "q";
import * as fs from "fs";
import {BowerManager} from "./BowerManager";
import {BaseSrv} from "../common/_BaseSrv";
 
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
export default class BowerSrv extends BaseSrv{
    public static BASE_EVENT = "bower";
    protected name = "BowerSrv";
    public static EVENTS = {
        GET_PACKAGES : "bower.packages.get",
        INSTALL_PACKAGES : "bower.packages.install",
        INSTALL_PACKAGE : "bower.packages.package.install",
        GET_PACKAGE : "bower.packages.package.get",
        UNINSTALL_PACKAGE : "bower.packages.package.uninstall",
        GET_CONFIG : "bower.config.get",
        SET_CONFIG : "bower.config.set"
    };
    constructor (protected socket){
        super(socket,"bower");
    }
    protected _registerEvents (socket:SocketIO.Socket){
        socket.on("a",this._onGetPackages.bind(this));
    }
    protected _onGetPackages(){
        this.logger.info("a");
    }
}