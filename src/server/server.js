"use strict";
const express = require("express");
const path = require("path");
const BowerSrv_1 = require("./bower/BowerSrv");
const Logger = require("./common/Logger");
const bodyParser = require("body-parser");
const Socket = require("socket.io");
const http = require("http");
const logger = Logger.getLogger("server", { saveInFile: true });
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
class Server {
    constructor(config) {
        //get express instance
        this.config = config;
        this.config.port = config.port || Server.DEFAULTS.port;
        this.config.socketPort = config.socketPort || Server.DEFAULTS.socketPort;
        this.app = express();
        this.app.use(bodyParser.json()); // to support JSON-encoded bodies
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        //set root
        this.app.use('/', express.static(path.resolve("./")));
        //set port
        this.app.listen(this.config.port);
        this.socketServer = http.Server(this.app);
        this.socketServer.listen(this.config.socketPort);
        this.io = new Socket(this.socketServer);
        logger.info("Server", "Running on port", this.config.port);
        logger.info("Server", "Socket listening on port", this.config.socketPort);
        //start bower server
        BowerSrv_1.default.getInstance(this.io);
    }
}
Server.DEFAULTS = {
    port: 8081,
    socketPort: 8082
};
exports.Server = Server;
//# sourceMappingURL=server.js.map