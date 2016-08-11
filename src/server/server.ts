import * as express from "express";
import * as contentDisposition from "content-disposition";
import * as path from "path";
import BowerSrv from "./bower/BowerSrv";
import * as Logger from "./common/Logger";
import * as bodyParser from "body-parser";
import * as Socket from "socket.io";
import * as http from "http";
let logger = Logger.getLogger("server",{saveInFile:true});
export interface IServerConfig{
    port:number;
}
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
export class Server {
    protected app;
    protected socketServer;
    protected io;
    constructor(config:IServerConfig={port:3000}){
        //get express instance
        this.app = express();
        this.app.use( bodyParser.json() );       // to support JSON-encoded bodies
        this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        }));
        //set root
        this.app.use('/', express.static(path.resolve("./")));
        //set port
        this.app.listen(config.port);
        this.socketServer = http.Server(this.app);
        this.socketServer.listen(3001);
        this.io = new Socket(this.socketServer);
        logger.info("Server","Running on port",config.port);
        //start bower server
        BowerSrv.getInstance(this.io);
    }
}