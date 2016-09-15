"use strict";
/// <reference path="../../../../typings/index.d.ts" />
var io = require("socket.io-client");
var $ = require("JQuery");
var log = require("loglevel");
/**
 * @class BaseSrv
 * @abstract
 * @description Base for services
 */
var BaseSrv = (function () {
    /**
     * @constructor
     * @param {object}  options          Options for the service
     * @param {String}  options.url      URL of server socket
     * @param {Number}  options.port     Port of server socket
     * @param {String}  options.name     Base for events to manage
     */
    function BaseSrv(options) {
        this.options = options;
        this.state = BaseSrv.STATES.disconnected;
        this.log = log.getLogger("client");
    }
    /**
     * @description Create a connection using url and port in options.
     * Only one connection at same time its allowed
     * returns JQueryPromise<any>
     */
    BaseSrv.prototype.connect = function () {
        var deferred = $.Deferred();
        //if socket doesn't exists
        if (!this.socket) {
            this.log.info(this.name, "Attempt to connect to " + this.options.url + "...");
            //update state
            this.state = BaseSrv.STATES.connecting;
            //connecct
            this.socket = io.connect(this.options.url);
            var that_1 = this;
            this.socket.on("connect", function () {
                that_1._onConnect(deferred);
            });
            this.socket.on("disconnect", function () {
                that_1._onDisconnect.apply(that_1, arguments);
            });
            this.socket.on("reconnecting", function () {
                that_1._onReconnecting.apply(that_1, arguments);
            });
            this.socket.on("reconnect_error", function () {
                that_1._onReconnectError.apply(that_1, arguments);
            });
            this.socket.on("error", function () {
                that_1._onConnectionError.apply(that_1, arguments);
            });
            this.socket.on("reconnect_failed", function () {
                that_1._onReconnectFailed.apply(that_1, arguments);
            });
        }
        else {
            //a conection already exists
            deferred.resolveWith(this, [this.state]);
        }
        return deferred.promise();
    };
    BaseSrv.prototype.disconnect = function () {
    };
    BaseSrv.prototype.reconnect = function () {
    };
    /**
     * @description Invoked when the socket connects. Perform custom operations before start to operate.
     * Once the operations are complete is necessary invoke _completeConnectionProcess to complete the connection process
     * and start the event listening
     * @param deferred  Deferred to resolve when all the operations after connection are completed
     * @protected
     * @see _completeConnectionProcess
     */
    BaseSrv.prototype._onConnect = function (deferred) {
        this.log.info(this.name, "Connection success");
        this._completeConnectionProcess(deferred); //by default call completeConnectionProcess
    };
    /**
     * @description Invoked manually when the custom operations has been peformed. Register the events to manage,
     * starts to operate and resolve the connect deferred.
     * @param deferred _completeConnectionProcess
     * @protected
     */
    BaseSrv.prototype._completeConnectionProcess = function (deferred) {
        //update state
        this.state = BaseSrv.STATES.connected;
        //register events and start to listen
        this._registerEvents();
        //resolve connect deferred
        deferred.resolveWith(this);
    };
    /**
     * @description Invoked when some error occurs
     * @param error
     * @protected
     */
    BaseSrv.prototype._onConnectionError = function (error) {
        this.log.error(this.name, "Something went wrong", error);
    };
    /**
     * @description Invoked when the connection is closed. Update the state
     * @protected
     */
    BaseSrv.prototype._onDisconnect = function () {
        this.state = BaseSrv.STATES.disconnected;
        this.log.info(this.name, "Connection closed");
    };
    /**
     * @description Invoked in each reconnect attempt
     * @param number    Numero de intento
     * @protected
     */
    BaseSrv.prototype._onReconnecting = function (number) {
        this.state = BaseSrv.STATES.reconnecting;
        this.log.info(this.name, "Attempting " + number + " to reconnect to " + this.options.url + "...");
    };
    /**
     * @description Invoked when a reconnect attempt fail
     * @protected
     */
    BaseSrv.prototype._onReconnectError = function () {
        this.log.warn(this.name, "Reconnect attempt failed");
    };
    /**
     * @description Invoked when all the reconnection attempts have been failed
     * @private
     */
    BaseSrv.prototype._onReconnectFailed = function () {
        this.state = BaseSrv.STATES.disconnected;
        this.log.warn(this.name, "All attempts to reconnect have been failed.");
    };
    BaseSrv.BASE_URL = "http://localhost:8082";
    BaseSrv.STATES = {
        disconnected: 0,
        connecting: 1,
        connected: 2,
        reconnecting: 3
    };
    return BaseSrv;
}());
exports.BaseSrv = BaseSrv;
//# sourceMappingURL=BaseSrv.js.map