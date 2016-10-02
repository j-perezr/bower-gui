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
        socket.on(BowerSrv.EVENTS.GET_PACKAGES, this._wrapEventCallback(this._onRequestGetPackages));
        socket.on(BowerSrv.EVENTS.SEARCH_PACKAGE, this._wrapEventCallback(this._onRequestSearchPackage));
        socket.on(BowerSrv.EVENTS.INFO_PACKAGE, this._wrapEventCallback(this._onRequestInfoPackage));
        socket.on(BowerSrv.EVENTS.INSTALL_PACKAGES, this._wrapEventCallback(this._onRequestInstallPackages));
        socket.on(BowerSrv.EVENTS.INSTALL_PACKAGE, this._wrapEventCallback(this._onRequestInstallPackage));
        socket.on(BowerSrv.EVENTS.UNINSTALL_PACKAGE, this._wrapEventCallback(this._onRequestUninstallPackage));
        socket.on(BowerSrv.EVENTS.GET_CONFIG, this._wrapEventCallback(this._onRequestGetConfig));
        socket.on(BowerSrv.EVENTS.SET_CONFIG, this._wrapEventCallback(this._onRequestSetConfig));
    }
    /**
     * @description Request the packages
     * @param socket
     * @param data
     * @private
     */
    _onRequestGetPackages(socket) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.GET_PACKAGES
            },
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.listPackages(config);
    }
    /**
     * @description Send the result
     * @param result
     * @private
     */
    _onOperationAlways(result) {
        debugger;
        this.log.trace("BowerSrv", `^cemiting^ result on ^c${result.shared.event}^`);
        result.shared.socket.emit(result.shared.event, result.result);
    }
    /**
     * @description Search a package
     * @param socket
     * @param data
     * @private
     */
    _onRequestSearchPackage(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.SEARCH_PACKAGE
            },
            config: data.config,
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.search(data.query, config);
    }
    /**
     * @description Get info for a package
     * @param socket
     * @param data
     * @private
     */
    _onRequestInfoPackage(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.INFO_PACKAGE
            },
            config: data.config,
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.info(data.name, config);
    }
    /**
     * @description Install a package
     * @param socket
     * @param data
     * @private
     */
    _onRequestInstallPackage(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.INSTALL_PACKAGE
            },
            config: data.config,
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.install(data.name, config);
    }
    /**
     * @description Install all packages
     * @param socket
     * @param data
     * @private
     */
    _onRequestInstallPackages(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.INSTALL_PACKAGES
            },
            config: data.config,
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.installAll(config);
    }
    /**
     * @description Uninstall a package
     * @param socket
     * @param data
     * @private
     */
    _onRequestUninstallPackage(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.UNINSTALL_PACKAGE
            },
            config: data.config,
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.uninstall(data.name, config);
    }
    /**
     * @description Get the bower.json file
     * @param socket
     * @private
     */
    _onRequestGetConfig(socket) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.GET_CONFIG
            },
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.getConfigFile(config);
    }
    /**
     * @description Set the bower.json file
     * @param socket
     * @param data
     * @private
     */
    _onRequestSetConfig(socket, data) {
        let callback = this._onOperationAlways.bind(this);
        let config = {
            share: {
                socket: socket,
                event: BowerSrv.EVENTS.SET_CONFIG
            },
            progress: callback,
            error: callback,
            done: callback
        };
        this.manager.setConfigFile(data.config, config);
    }
}
BowerSrv.BASE_EVENT = "bower";
BowerSrv.EVENTS = {
    GET_PACKAGES: "bower.packages.get",
    INSTALL_PACKAGES: "bower.packages.install",
    INSTALL_PACKAGE: "bower.packages.package.install",
    SEARCH_PACKAGE: "bower.packages.package.search",
    INFO_PACKAGE: "bower.packages.package.info",
    UNINSTALL_PACKAGE: "bower.packages.package.uninstall",
    GET_CONFIG: "bower.config.get",
    SET_CONFIG: "bower.config.set"
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BowerSrv;
