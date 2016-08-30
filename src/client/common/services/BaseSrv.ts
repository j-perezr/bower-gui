/// <reference path="../../typings/index.d.ts" />
import * as io from "socket.io-client";
export module common.services{
    import Socket = SocketIO.Socket;
    export interface ISocketOptions{
        reconnection:boolean;//auto reconnect
        reconnectionDelay:number;//delay between reconnection attept
        timeout:number;//limit of reonnection attempts
    }
    export interface IBaseSrvOptions{
        url:string;//url to connect
        port:number;//port
        name:string;//base for events
        socketOptions:ISocketOptions;
    }
    /**
     * @class BaseSrv
     * @abstract
     * @description Base for services
     */
    export abstract class BaseSrv{
        public static BASE_URL = "http://localhost";
        public static BASE_PORT = 8082;
        public static STATES = {
            disconnected:0,
            connecting:1,
            connected:2,
            reconnecting:3
        };
        protected options:IBaseSrvOptions;//options of service
        protected socket:SocketIO.Socket;
        protected state:number=BaseSrv.STATES.disconnected;
        /**
         * @constructor
         * @param {object}  options          Options for the service
         * @param {String}  options.url      URL of server socket
         * @param {Number}  options.port     Port of server socket
         * @param {String}  options.name     Base for events to manage
         */
        constructor (options:IBaseSrvOptions){
            this.options = {
                url:options.url,
                port:options.port,
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
                //update state
                this.state = BaseSrv.STATES.connecting;
                //connecct
                this.socket = io.connect(this.options.url+":"+this.options.port);
                let that = this;
                this.socket.on("connect",function(){
                    //on connect, call _onConnect with the deferred
                    that._onConnect(deferred);
                })
            }else{
                //a conection already exists
                deferred.resolveWith(this,this.state);
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
        protected _onDisconnect(){

        }
        protected _onReconnecting(){

        }
    }
}