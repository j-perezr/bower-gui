"use strict";
const _BaseSrv_1 = require("../common/_BaseSrv");
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
class BowerSrv extends _BaseSrv_1.BaseSrv {
    constructor(socket) {
        super(socket, "bower");
        this.socket = socket;
        this.name = "BowerSrv";
    }
    _registerEvents(socket) {
        socket.on("a", this._onGetPackages.bind(this));
    }
    _onGetPackages() {
        this.logger.info("a");
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
//# sourceMappingURL=BowerSrv.js.map