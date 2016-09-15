"use strict";
const Logger_1 = require("./Logger");
/**
 * @class BaseSrv
 * @abstract
 * @description Base for services
 */
class BaseSrv {
    /**
     *
     * @param socket        Socket to use
     * @param [namespace]   Optional namespace to manage events
     */
    constructor(socket, namespace) {
        this.socket = socket;
        this.namespace = namespace;
        this.connections = new Map();
        this.logger = Logger_1.Logger.getLogger("server");
        this.log.debug(this.name, "Initializing...");
        this._init();
        if (!!namespace) {
            this.log.debug(this.name, `Namespace provided, using '${namespace}'`);
            this.socket = socket.of(`/${namespace}`);
        }
        this.socket.on("connect", this._onClientConnect.bind(this));
    }
    _init() { }
    /**
     * @description Close all conections.
     */
    disconnectAll() {
        this.log.debug(this.name, "Disconecting all...");
        let connectionItems = this.connections.values();
        for (let connection of connectionItems) {
            this.log.debug(this.name, `Disconecting '${connection.id}'`);
            connection.disconnect(true);
        }
        this.log.info(this.name, `Disconected ${this.connections.size}`);
        this.connections.clear();
    }
    /**
     * @description Invoked when a client connects. Perform custom operations before start to operate.
     * Once the operations are complete is necessary invoke _completeConnectionProcess to complete the connection process
     * and start the event listening
     * @param deferred  Deferred to resolve when all the operations after connection are completed
     * @protected
     * @see _completeConnectionProcess
     */
    _onClientConnect(socket) {
        this.log.info(this.name, "Client connection");
        this.log.debug(this.name, `with id '${socket.id}'`);
        this.connections.set(socket.id, socket);
        socket.on("disconnect", this._onClientDisconnect.bind(this));
        this._registerEvents(socket);
        this._onCompleteConnectionProcess();
    }
    /**
     * @description Invoked when the connection process is finished. Allow to implement custom operations like emit some event to notify client
     * @protected
     */
    _onCompleteConnectionProcess() { }
    /**
     * @description Invoked when the connection is closed. Update the state
     * @protected
     */
    _onClientDisconnect(socket) {
        this.logger.info("Client disconnected");
        this.logger.debug(this.name, `with id '${socket.id}'. There are ${this.connections.size} connection/s`);
        this.connections.delete(socket.id);
    }
}
exports.BaseSrv = BaseSrv;
//# sourceMappingURL=_BaseSrv.js.map