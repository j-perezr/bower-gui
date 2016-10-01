import * as logger from "../common/Logger";
import * as bower from "bower"
import {IResult,IError,BowerManager} from "./BowerManager";
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
        GET_PACKAGE : "bower.packages.package.get",
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
        socket.on(BowerSrv.EVENTS.GET_PACKAGES,this._wrapEventCallback(this._onGetPackages));
    }

    /**
     * @description Get the packages
     * @param socket
     * @param data
     * @private
     */
    protected _onGetPackages(socket){
        debugger;
        this.manager.listPackages({socket:socket}).then(this._onManagerGetPackagesSuccess.bind(this));
    }
    protected _onManagerGetPackagesSuccess(result:IOperationResult){
        debugger;
        result.shared.emit(BowerSrv.EVENTS.GET_PACKAGES,result.result);
    }
}