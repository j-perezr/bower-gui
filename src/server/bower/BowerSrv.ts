import * as logger from "../common/Logger";
import * as bower from "bower";
import * as express from "express";
import * as Socket from "socket.io";
import * as Q from "q";
import * as fs from "fs";
import {BowerManager} from "./BowerManager";
export interface IError {
    code:string;
    message:string;
}
export interface IResult{
    error:boolean|IError;
    result:any;
}
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
export default class BowerSrv {
    public static BASE_EVENT = "bower";
    public static BASE_PACKAGES = "packages";
    public static GET_PACKAGES = BowerSrv.BASE_PACKAGES+".list";
    public static INSTALL_PACKAGES = BowerSrv.BASE_PACKAGES+".install";
    public static GET_SEARCH_PACKAGE = BowerSrv.BASE_PACKAGES+".search";
    public static GET_INFO_PACKAGE = BowerSrv.BASE_PACKAGES+".info";
    public static UNINSTALL_PACKAGE = BowerSrv.BASE_PACKAGES+".uninstall";
    public static BASE_CONFIG = "config";
    public static GET_CONFIG = BowerSrv.BASE_CONFIG+".get";
    public static PUT_CONFIG = BowerSrv.BASE_CONFIG+".set";
    protected static instance;
    protected logger;
    protected router;
    protected bower = bower;
    protected bowerManager;
    protected bowerSocket;
    constructor(protected socketInstance) {
        this.logger = logger.getLogger("server");
        this.logger.info("BowerSrv", "creating BowerSrv instance");
        this.bowerManager = new BowerManager(bower,fs);
        this.bowerSocket = socketInstance;
        this.bowerSocket.on('connection', this._onClientConnect.bind(this));
    }

    /**
     * @description Obtiene la instancia del servicio
     * @param expressInstance
     * @param bower
     * @returns {any}
     */
    public static getInstance(socketInstance) {
        if (!BowerSrv.instance) {
            BowerSrv.instance = new BowerSrv(socketInstance);
        }
        return BowerSrv.instance;
    }
    protected _onClientConnect (socket){
        debugger;
        this._registerEvents(socket);
        this.logger.info("BowerSrv","connected and listenging");
    }
    /**
     * @description Registra todas las rutas disponibles exponiendo el api
     * @private
     */
    protected _registerEvents(socket) {
        var that = this;
        socket.on(BowerSrv.GET_PACKAGES,function(data){
            that._onGetPackages(data,socket);
        });
    }
    protected _onGetPackages(data,socket){
        debugger;
        this.logger.info("BowerSrv","get packages");
    }
}