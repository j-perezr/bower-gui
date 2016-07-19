import * as express from "express";
import * as contentDisposition from "content-disposition";
import * as path from "path";
import * as open from "open";
import BowerSrv from "./bower/BowerSrv";
import * as Logger from "./utils/Logger";
import * as bodyParser from "body-parser";
let logger = Logger.getLogger("server");
export interface IServerConfig{
    port:number;
}
/**
 * @class Server
 * @description Inicializa el servidor con la api erst
 */
export class Server {
    protected app;
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
        logger.info("Server","Running on port",config.port);
        //open default browser
        //open("http://localhost:"+config.port);
        //start bower server
        BowerSrv.getInstance(this.app);
    }
}