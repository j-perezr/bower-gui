"use strict";
/**
 * @class BowerSrv
 * @description Service to manage Bower data
 * @extends BaseSrv
 */
var BowerSrv = (function () {
    function BowerSrv(options) {
        this.name = "BowerSrv";
        _super.call(this, {
            url: BowerSrv.URL,
            name: BowerSrv.NAME,
            socketOptions: options
        });
    }
    BowerSrv.prototype._registerEvents = function () {
        if (this.socket) {
            var that = this;
            this.socket.on("a", function () {
                console.log("a");
            });
        }
    };
    BowerSrv.prototype.getPackages = function () {
        this.log.info(this.name, "Emit event " + BowerSrv.EVENTS.GET_PACKAGES + "...");
        this.socket.emit("a", { a: 1 });
    };
    BowerSrv.prototype._onGetPackagesSuccess = function (response) {
    };
    BowerSrv.URL = BowerSrv.BASE_URL;
    BowerSrv.NAME = "bower";
    BowerSrv.EVENTS = {
        GET_PACKAGES: "bower.packages.get",
        GET_PACKAGE: "bower.packages.package.get",
        INSTALL_PACKAGES: "bower.packages.install",
        INSTALL_PACKAGE: "bower.packages.package.install",
        UNINSTALL_PACKAGE: "bower.packages.package.uninstall",
        GET_CONFIG: "bower.config.get",
        SET_CONFIG: "bower.config.set"
    };
    return BowerSrv;
}());
exports.BowerSrv = BowerSrv;
//# sourceMappingURL=BowerSrv.js.map