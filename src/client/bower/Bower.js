"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var BowerSrv_1 = require("./BowerSrv");
var Bower = (function (_super) {
    __extends(Bower, _super);
    function Bower() {
        _super.call(this);
        this._init();
    }
    Bower.prototype._init = function () {
        this.bowerSrv = new BowerSrv_1.BowerSrv();
        var that = this;
        this.bowerSrv.connect().then(function () {
            that.bowerSrv.getPackages();
        });
    };
    Bower.prototype.render = function () {
        return React.createElement("h1", null, "Hi");
    };
    return Bower;
}(React.Component));
exports.Bower = Bower;
//# sourceMappingURL=Bower.js.map