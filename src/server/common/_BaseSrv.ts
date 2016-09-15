/// <reference path="../../../typings/index.d.ts" />
import * as Socket from "socket.io";
import {Logger}  from "./Logger";
export interface IServiceError {
    code:string;
    message:string;
}
export interface IServiceResult{
    error:boolean|IServiceError;
    result:any;
}
/**
 * @class BaseSrv
 * @abstract
 * @description Base for services
 */
export abstract class BaseSrv {
    protected connections: Map<string, SocketIO.Socket> = new Map();
    protected log;
    protected name;
    protected logger;
    /**
     * 
     * @param socket        Socket to use 
     * @param [namespace]   Optional namespace to manage events
     */
    constructor(protected socket:SocketIO.Socket, protected namespace?:string) {
        this.logger = Logger.getLogger("server");
        this.log.debug(this.name,"Initializing...");
        this._init();
        if(!!namespace) {
            this.log.debug(this.name,`Namespace provided, using '${namespace}'`);
            this.socket= socket.of(`/${namespace}`);
        }
        this.socket.on("connect",this._onClientConnect.bind(this));
    }
    protected abstract _registerEvents(socket:SocketIO.Socket);
    protected _init(){}

    /**
     * @description Close all conections.
     */
    public disconnectAll() {
        this.log.debug(this.name, "Disconecting all...");
        let connectionItems = this.connections.values();
        for (let connection of connectionItems) {
            this.log.debug(this.name,`Disconecting '${connection.id}'`);
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
    protected _onClientConnect(socket:SocketIO.Socket) {
        this.log.info(this.name, "Client connection");
        this.log.debug(this.name, `with id '${socket.id}'`);
        this.connections.set(socket.id,socket);
        socket.on("disconnect",this._onClientDisconnect.bind(this));
        this._registerEvents(socket);
        this._onCompleteConnectionProcess();
    }

    /**
     * @description Invoked when the connection process is finished. Allow to implement custom operations like emit some event to notify client
     * @protected
     */
    protected _onCompleteConnectionProcess(){}
    /**
     * @description Invoked when the connection is closed. Update the state
     * @protected
     */
    protected _onClientDisconnect(socket) {
        this.logger.info("Client disconnected");
        this.logger.debug(this.name,`with id '${socket.id}'. There are ${this.connections.size} connection/s`);
        this.connections.delete(socket.id);
    }
}
