/// <reference path="../../../../typings/index.d.ts" />
import * as io from "socket.io-client";
import * as $ from "JQuery";
import * as log from "loglevel";
import * as loglevelMessagePrefix from "loglevel-message-prefix";
import { LogPrefix } from "../LogPrefix";
import Socket = SocketIO.Socket;
export interface ISocketOptions{
    reconnection:boolean;//auto reconnect
    reconnectionDelay:number;//delay between reconnection attept
    timeout:number;//limit of reonnection attempts
}
export interface IBaseSrvOptions{
    url:string;//url to connect
    name:string;//base for events
    socketOptions:ISocketOptions;
}
/**
 * @class BaseSrv
 * @abstract
 * @description Base for services
 */
export abstract class BaseSrv{
    public static BASE_URL = "http://localhost:8082";
    public static STATES = {
        disconnected:0,
        connecting:1,
        connected:2,
        reconnecting:3
    };
    protected options:IBaseSrvOptions;//options of service
    protected socket:SocketIO.Socket;
    protected state:number=BaseSrv.STATES.disconnected;
    protected log;
    protected name;
    /**
     * @constructor
     * @param {object}  options          Options for the service
     * @param {String}  options.url      URL of server socket
     * @param {Number}  options.port     Port of server socket
     * @param {String}  options.name     Base for events to manage
     */
    constructor (options:IBaseSrvOptions){
        this.log = log.getLogger("client");
        this.options = {
            url:options.url,
            name:options.name,
            socketOptions:options.socketOptions
        };

    }

    /**
     * @description Create a connection using url and port in options.
     * Only one connection at same time its allowed
     * returns JQueryPromise<any>
     */
    public connect():JQueryPromise<any>{
        let deferred = $.Deferred();
        //if socket doesn't exists
        if(!this.socket){
            this.log.info(this.name,`Attempt to connect to ${this.options.url}...`);
            //update state
            this.state = BaseSrv.STATES.connecting;
            //connecct
            this.socket = io.connect(this.options.url);
            let that = this;
            this.socket.on("connect",function(){
                that._onConnect(deferred);
            });
            this.socket.on("disconnect",function(){
                that._onDisconnect.apply(that,arguments);
            });
            this.socket.on("reconnecting",function(){
                that._onReconnecting.apply(that,arguments);
            });
            this.socket.on("reconnect_error",function(){
                that._onReconnectError.apply(that,arguments);
            });
            this.socket.on("error",function(){
                that._onConnectionError.apply(that,arguments);
            });
            this.socket.on("reconnect_failed",function(){
                that._onReconnectFailed.apply(that,arguments);
            })
        }else{
            //a conection already exists
            deferred.resolveWith(this,[this.state]);
        }
        return deferred.promise();
    }
    protected _registerEvents (){
        let that = this;
        if(this.socket){

        }
    }
    public disconnect(){

    }
    public reconnect(){

    }

    /**
     * @description Invoked when the socket connects. Perform custom operations before start to operate.
     * Once the operations are complete is necessary invoke _completeConnectionProcess to complete the connection process
     * and start the event listening
     * @param deferred  Deferred to resolve when all the operations after connection are completed
     * @protected
     * @see _completeConnectionProcess
     */
    protected _onConnect(deferred:JQueryDeferred<any>){
        this.log.info(this.name,"Connection success");
        this._completeConnectionProcess(deferred);//by default call completeConnectionProcess
    }
    /**
     * @description Invoked manually when the custom operations has been peformed. Register the events to manage,
     * starts to operate and resolve the connect deferred.
     * @param deferred _completeConnectionProcess
     * @protected
     */
    protected _completeConnectionProcess (deferred:JQueryDeferred<any>){
        //update state
        this.state = BaseSrv.STATES.connected;
        //register events and start to listen
        this._registerEvents();
        //resolve connect deferred
        deferred.resolveWith(this);
    }

    /**
     * @description Invoked when some error occurs
     * @param error
     * @protected
     */
    protected _onConnectionError (error){
        this.log.error(this.name,`Something went wrong`,error);
    }

    /**
     * @description Invoked when the connection is closed. Update the state
     * @protected
     */
    protected _onDisconnect(){
        this.state = BaseSrv.STATES.disconnected;
        this.log.info(this.name,`Connection closed`);
    }

    /**
     * @description Invoked in each reconnect attempt
     * @param number    Numero de intento
     * @protected
     */
    protected _onReconnecting(number){
        this.state = BaseSrv.STATES.reconnecting;
        this.log.info(this.name,`Attempting ${number} to reconnect to ${this.options.url}...`);
    }

    /**
     * @description Invoked when a reconnect attempt fail
     * @protected
     */
    protected _onReconnectError (){
        this.log.warn(this.name,`Reconnect attempt failed`);
    }

    /**
     * @description Invoked when all the reconnection attempts have been failed
     * @private
     */
    protected _onReconnectFailed (){
        this.state = BaseSrv.STATES.disconnected;
        this.log.warn(this.name,`All attempts to reconnect have been failed.`)
    }
}