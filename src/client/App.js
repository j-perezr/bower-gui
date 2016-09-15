"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="typings/index.d.ts"/>
var React = require("react");
var ReactDOM = require("react-dom");
var log = require("loglevel");
var LogPrefix_1 = require("./common/LogPrefix");
var react_router_1 = require('react-router');
var MuiThemeProvider_1 = require('material-ui/styles/MuiThemeProvider');
var Bower_1 = require("./bower/Bower");
require("./index.html");
require("../../node_modules/normalize.css/normalize.css");
require("../../node_modules/flexboxgrid/dist/flexboxgrid.css");
//config log
log.setDefaultLevel(0);
new LogPrefix_1.LogPrefix(log.getLogger("client"));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return React.createElement("div", {className: "wrapper"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs"})));
    };
    return App;
}(React.Component));
exports.App = App;
ReactDOM.render(React.createElement(MuiThemeProvider_1.default, null, React.createElement(react_router_1.Router, {history: react_router_1.hashHistory}, React.createElement(react_router_1.Route, {path: "/", component: App}, React.createElement(react_router_1.Route, {path: "/bower", component: Bower_1.Bower})))), document.getElementById("main"));
//# sourceMappingURL=App.js.map