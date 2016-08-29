import * as express from "express";
import * as path from "path";
import BowerSrv from "./bower/BowerSrv";
import * as Logger from "./common/Logger";
import * as bodyParser from "body-parser";
import * as Socket from "socket.io";
import * as http from "http";
const logger = Logger.getLogger("server",{saveInFile:true});
export interface IServerConfig{
    port:number;
    socketPort:number;
}

/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
export class Server {
    protected app;
    protected socketServer;
    protected io;
    protected config:IServerConfig;
    public static DEFAULTS:IServerConfig = {
        port:8081,
        socketPort:8082
    };
    constructor(config:IServerConfig){
        //get express instance
        this.config = config;
        this.config.port = config.port || Server.DEFAULTS.port;
        this.config.socketPort = config.socketPort || Server.DEFAULTS.socketPort;
        this.app = express();
        this.app.use( bodyParser.json() );       // to support JSON-encoded bodies
        this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        }));
        //set root
        this.app.use('/', express.static(path.resolve("./")));
        //set port
        this.app.listen(this.config.port);
        this.socketServer = http.Server(this.app);
        this.socketServer.listen(this.config.socketPort);
        this.io = new Socket(this.socketServer);
        logger.info("Server","Running on port",this.config.port);
        logger.info("Server","Socket listening on port",this.config.socketPort);
        //start bower server
        BowerSrv.getInstance(this.io);
    }
}