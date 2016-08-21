"use strict";
const logger = require("../common/Logger");
const bower = require("bower");
const fs = require("fs");
const BowerManager_1 = require("./BowerManager");
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
class BowerSrv {
    constructor(socketInstance) {
        this.socketInstance = socketInstance;
        this.bower = bower;
        this.logger = logger.getLogger("server");
        this.logger.info("BowerSrv", "creating BowerSrv instance");
        this.bowerManager = new BowerManager_1.BowerManager(bower, fs);
        this.bowerSocket = socketInstance;
        this.bowerSocket.on('connection', this._onClientConnect.bind(this));
    }
    /**
     * @description Obtiene la instancia del servicio
     * @param expressInstance
     * @param bower
     * @returns {any}
     */
    static getInstance(socketInstance) {
        if (!BowerSrv.instance) {
            BowerSrv.instance = new BowerSrv(socketInstance);
        }
        return BowerSrv.instance;
    }
    _onClientConnect(socket) {
        debugger;
        this._registerEvents(socket);
        this.logger.info("BowerSrv", "connected and listenging");
    }
    /**
     * @description Registra todas las rutas disponibles exponiendo el api
     * @private
     */
    _registerEvents(socket) {
        var that = this;
        socket.on(BowerSrv.GET_PACKAGES, function (data) {
            that._onGetPackages(data, socket);
        });
    }
    _onGetPackages(data, socket) {
        debugger;
        this.logger.info("BowerSrv", "get packages");
    }
}
BowerSrv.BASE_EVENT = "bower";
BowerSrv.BASE_PACKAGES = "packages";
BowerSrv.GET_PACKAGES = BowerSrv.BASE_PACKAGES + ".list";
BowerSrv.INSTALL_PACKAGES = BowerSrv.BASE_PACKAGES + ".install";
BowerSrv.GET_SEARCH_PACKAGE = BowerSrv.BASE_PACKAGES + ".search";
BowerSrv.GET_INFO_PACKAGE = BowerSrv.BASE_PACKAGES + ".info";
BowerSrv.UNINSTALL_PACKAGE = BowerSrv.BASE_PACKAGES + ".uninstall";
BowerSrv.BASE_CONFIG = "config";
BowerSrv.GET_CONFIG = BowerSrv.BASE_CONFIG + ".get";
BowerSrv.PUT_CONFIG = BowerSrv.BASE_CONFIG + ".set";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BowerSrv;
//# sourceMappingURL=BowerSrv.js.map