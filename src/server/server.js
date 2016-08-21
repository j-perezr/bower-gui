"use strict";
const express = require("express");
const path = require("path");
const BowerSrv_1 = require("./bower/BowerSrv");
const Logger = require("./common/Logger");
const bodyParser = require("body-parser");
const Socket = require("socket.io");
const http = require("http");
let logger = Logger.getLogger("server", { saveInFile: true });
exports.defaultConfig = {
    port: 8081,
    socketPort: 8082
};
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
class Server {
    constructor(config) {
        //get express instance
        this.app = express();
        this.app.use(bodyParser.json()); // to support JSON-encoded bodies
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        //set root
        this.app.use('/', express.static(path.resolve("./")));
        //set port
        this.app.listen(config.port);
        this.socketServer = http.Server(this.app);
        this.socketServer.listen(config.socketPort);
        this.io = new Socket(this.socketServer);
        logger.info("Server", "Running on port", config.port);
        logger.info("Server", "Socket listening on port", config.socketPort);
        //start bower server
        BowerSrv_1.default.getInstance(this.io);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map