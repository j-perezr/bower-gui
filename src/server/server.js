"use strict";
const express = require("express");
const path = require("path");
const BowerSrv_1 = require("./bower/BowerSrv");
const Logger = require("./utils/Logger");
const bodyParser = require("body-parser");
let logger = Logger.getLogger("server");
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
class Server {
    constructor(config = { port: 3000 }) {
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
        logger.info("Server", "Running on port", config.port);
        //open default browser
        //open("http://localhost:"+config.port);
        //start bower server
        BowerSrv_1.default.getInstance(this.app);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map