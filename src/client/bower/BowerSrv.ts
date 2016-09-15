/// <reference path="../../../typings/index.d.ts" />
import { BaseSrv } from "../common/services/BaseSrv";
import { IBaseSrvOptions } from "../common/services/BaseSrv";
import {Bower} from "./Bower";
/**
 * @class BowerSrv
 * @description Service to manage Bower data
 * @extends BaseSrv
 */
export class BowerSrv{
    public static URL = BowerSrv.BASE_URL;
    public static NAME = "bower";
    protected name = "BowerSrv";
    public static EVENTS = {
        GET_PACKAGES : "bower.packages.get",
        GET_PACKAGE : "bower.packages.package.get",
        INSTALL_PACKAGES : "bower.packages.install",
        INSTALL_PACKAGE : "bower.packages.package.install",
        UNINSTALL_PACKAGE : "bower.packages.package.uninstall",
        GET_CONFIG : "bower.config.get",
        SET_CONFIG : "bower.config.set"
    };
    constructor(options?){
        super({
            url:BowerSrv.URL,
            name:BowerSrv.NAME,
            socketOptions:options
        });
    }
    protected _registerEvents (){
        if(this.socket){
            var that = this;
            this.socket.on("a",function(){
                console.log("a");
            });
        }
    }
    public getPackages (){
        this.log.info(this.name,`Emit event ${BowerSrv.EVENTS.GET_PACKAGES}...`);
        this.socket.emit("a",{a:1});
    }
    protected _onGetPackagesSuccess (response){

    }
}

