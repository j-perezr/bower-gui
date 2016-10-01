"use strict";
const bower = require("bower");
const BowerManager_1 = require("./BowerManager");
const _BaseSrv_1 = require("../common/_BaseSrv");
const fs = require("fs");
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
class BowerSrv extends _BaseSrv_1.BaseSrv {
    constructor(socket) {
        super("BowerSrv", socket, "bower");
        this.socket = socket;
        this.manager = new BowerManager_1.BowerManager(bower, fs);
    }
    /**
     * @description Register events to manage
     * @param socket
     * @private
     */
    _registerEvents(socket) {
        socket.on(BowerSrv.EVENTS.GET_PACKAGES, this._wrapEventCallback(this._onGetPackages));
    }
    /**
     * @description Get the packages
     * @param socket
     * @param data
     * @private
     */
    _onGetPackages(socket) {
        debugger;
        this.manager.listPackages({ socket: socket }).then(this._onManagerGetPackagesSuccess.bind(this));
    }
    _onManagerGetPackagesSuccess(result) {
        debugger;
        result.shared.emit(BowerSrv.EVENTS.GET_PACKAGES, result.result);
    }
}
BowerSrv.BASE_EVENT = "bower";
BowerSrv.EVENTS = {
    GET_PACKAGES: "bower.packages.get",
    INSTALL_PACKAGES: "bower.packages.install",
    INSTALL_PACKAGE: "bower.packages.package.install",
    GET_PACKAGE: "bower.packages.package.get",
    UNINSTALL_PACKAGE: "bower.packages.package.uninstall",
    GET_CONFIG: "bower.config.get",
    SET_CONFIG: "bower.config.set"
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BowerSrv;
