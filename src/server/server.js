"use strict";
var express = require("express");
var path = require("path");
var BowerSrv_1 = require("./bower/BowerSrv");
var Logger = require("./common/Logger");
var bodyParser = require("body-parser");
var Socket = require("socket.io");
var http = require("http");
var logger = Logger.getLogger("server", { saveInFile: true });
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
var Server = (function () {
    function Server(config) {
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
        this.socketServer.listen(config.port + 1);
        this.io = new Socket(this.socketServer);
        logger.info("Server", "Running on port", config.port);
        logger.info("Server", "Socket listening on port", config.port + 1);
        //start bower server
        BowerSrv_1.default.getInstance(this.io);
    }
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map