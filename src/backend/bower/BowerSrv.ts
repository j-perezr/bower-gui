import * as logger from "../common/Logger";
import * as bower from "bower"
import {IOperationResult,IOperationResult,IApiResult,IOperationOptions,IBowerConfig,IError,BowerManager} from "./BowerManager";
import {BaseSrv} from "../common/_BaseSrv";
import * as fs from "fs";
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
export default class BowerSrv extends BaseSrv{
    public static BASE_EVENT = "bower";
    public static EVENTS = {
        GET_PACKAGES : "bower.packages.get",
        INSTALL_PACKAGES : "bower.packages.install",
        INSTALL_PACKAGE : "bower.packages.package.install",
        SEARCH_PACKAGE : "bower.packages.package.search",
        INFO_PACKAGE : "bower.packages.package.info",
        UNINSTALL_PACKAGE : "bower.packages.package.uninstall",
        GET_CONFIG : "bower.config.get",
        SET_CONFIG : "bower.config.set"
    };
    protected manager:BowerManager;
    constructor (protected socket){
        super("BowerSrv",socket,"bower");
        this.manager = new BowerManager(bower,fs);
    }

    /**
     * @description Register events to manage
     * @param socket
     * @private
     */
    protected _registerEvents (socket:SocketIO.Socket){
        socket.on(BowerSrv.EVENTS.GET_PACKAGES,this._wrapEventCallback(this._onRequestGetPackages));
        socket.on(BowerSrv.EVENTS.SEARCH_PACKAGE,this._wrapEventCallback(this._onRequestSearchPackage));
        socket.on(BowerSrv.EVENTS.INFO_PACKAGE,this._wrapEventCallback(this._onRequestInfoPackage));
        socket.on(BowerSrv.EVENTS.INSTALL_PACKAGES,this._wrapEventCallback(this._onRequestInstallPackages));
        socket.on(BowerSrv.EVENTS.INSTALL_PACKAGE,this._wrapEventCallback(this._onRequestInstallPackage));
        socket.on(BowerSrv.EVENTS.UNINSTALL_PACKAGE,this._wrapEventCallback(this._onRequestUninstallPackage));
        socket.on(BowerSrv.EVENTS.GET_CONFIG,this._wrapEventCallback(this._onRequestGetConfig));
        socket.on(BowerSrv.EVENTS.SET_CONFIG,this._wrapEventCallback(this._onRequestSetConfig));
    }

    /**
     * @description Request the packages
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestGetPackages(socket){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.GET_PACKAGES
            },
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.listPackages(config);
    }

    /**
     * @description Send the result
     * @param result
     * @private
     */
    protected _onOperationAlways(result:IOperationResult){
        debugger;
        this.log.trace("BowerSrv",`^cemiting^ result on ^c${result.shared.event}^`);
        result.shared.socket.emit(result.shared.event,result.result);
    }
    /**
     * @description Search a package
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestSearchPackage(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.SEARCH_PACKAGE
            },
            config:data.config,
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.search(data.query,config);
    }

    /**
     * @description Get info for a package
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestInfoPackage(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.INFO_PACKAGE
            },
            config:data.config,
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.info(data.name,config);
    }

    /**
     * @description Install a package
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestInstallPackage(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.INSTALL_PACKAGE
            },
            config:data.config,
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.install(data.name,config);
    }

    /**
     * @description Install all packages
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestInstallPackages(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.INSTALL_PACKAGES
            },
            config:data.config,
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.installAll(config);
    }

    /**
     * @description Uninstall a package
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestUninstallPackage(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.UNINSTALL_PACKAGE
            },
            config:data.config,
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.uninstall(data.name,config);
    }

    /**
     * @description Get the bower.json file
     * @param socket
     * @private
     */
    protected _onRequestGetConfig(socket){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.GET_CONFIG
            },
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.getConfigFile(config);
    }

    /**
     * @description Set the bower.json file
     * @param socket
     * @param data
     * @private
     */
    protected _onRequestSetConfig(socket,data){
        let callback = this._onOperationAlways.bind(this);
        let config:IOperationOptions={
            share:{
                socket:socket,
                event:BowerSrv.EVENTS.SET_CONFIG
            },
            progress:callback,
            error:callback,
            done:callback
        };
        this.manager.setConfigFile(data.config,config);
    }
}