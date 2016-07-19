let instances = {};
let fs = require("fs");
let path = require("path");
const LEVELS = {
    NONE:0,
    ERROR:1,
    WARN:2,
    INFO:3,
    DEBUG:4,
    TRACE:5,
    ALL:6
};
const defaults = {
    level:LEVELS.TRACE,
    logPath:"logs"
};

class LogMessage{
    /**
     *
     * @param params
     * @param params.terminal   Terminal
     * @param params.level      Level
     * @param params.context    Message context
     * @param params.msg        Message
     */
    constructor(params){
        debugger;
        this.terminal = params.terminal;
        this.level = params.level;
        this.context = params.context;
        this.originalMsg = this._parseMessage(params.msg);
        this.msg = this._prepareMsg(this.context,this.originalMsg);
        this.terminal((params.breakLine !== false ? "\n": "")+this.msg);
        this.terminal.getCursorLocation(this._saveLocation.bind(this));
    }
    _saveLocation(error,x,y){
        if(!error){
            this.location = {
                x:x,
                y:y
            }
        }
    }
    _parseMessage (msg){
        let parsedMsg = "";
        if(Array.isArray(msg)) {
            for (var msgIndex = 0, msgLength = msg.length; msgIndex < msgLength; msgIndex++) {
                var currentMsg = msg[msgIndex];
                if (typeof currentMsg == "object") {
                    try {
                        msg[msgIndex] = JSON.stringify(currentMsg, null, 4);
                    } catch (e) {

                    }
                }
            }
            parsedMsg = msg.join(" ");
        }else{
            parsedMsg = msg;
        }
        return parsedMsg;
    }
    /**
     * @description Prepara el mensaje a imprimir generando el timestamp y dando el formato mediante cli-color
     * @param type      Tipo de mensaje: INFO, WARN, ERROR, etc
     * @param context   Contexto que lanza el log
     * @param msg       Conjunto de mensajes
     * @returns {Array.<*>}
     * @private
     */
    _prepareMsg(context,msg){
        let type;
        switch(this.level){
            case LEVELS.ERROR:
                type="^r[ERROR]^:";
                break;
            case LEVELS.INFO:
                type="^C[INFO]^:";
                break;
            case LEVELS.WARN:
                type="^y[DEBUG]^:";
                break;
            case LEVELS.DEBUG:
                type="^Y[DEBUG]^:";
                break;
            case LEVELS.TRACE:
                type="^b[TRACE]^:";
                break;
        }
        return [type,new Date().toISOString(),"^C["+context+"]^:",msg].join(" ");
    }
    /**
     *
     * @param text
     * @returns {Function}
     * @private
     */
    continue(...newText){
        if(this.position) {
            newText = this._parseMessage(newText);
            this.terminal.saveCursor().moveTo(this.position.x,this.position.y)(newText).restoreCursor();
        }
    }
    file(){
        let date = new Date(),
            day = date.getDate(),
            year = date.getYear(),
            month = date.getMonth(),
            hour = date.getHours(),
            route = path.resolve(this.config.logPath);
        if(!fs.existsSync(route)){
            fs.mkdirSync(route);
        }
        route = path.resolve(route,year.toString());
        if(!fs.existsSync(route)){
            fs.mkdirSync(route);
        }
        route = path.resolve(route,month.toString());
        if(!fs.existsSync(route)){
            fs.mkdirSync(route);
        }
        route = path.resolve(route,day.toString());
        if(!fs.existsSync(route)){
            fs.mkdirSync(route);
        }
        fs.writeFile(hour+".txt",msg);
    }
}
/**
 * @class Logger
 * @description Sistema de logging
 * @requires cli-color
 */
class Logger{
    constructor(config){
        this.setConfig(config);
        this.terminal = require("terminal-kit").terminal;
    }
    /**
     * @description Muestra un mensaje warn
     * @param context   El contexto hace referencia a la clase o elemento que produce el log, se enmarca en []
     * @param msg       Uno o varios mensajes.
     * @returns continue    Permite imprimir a continuación del log.
     * @example let continueLog = logger.warn("Contexto","mensaje","en","warn")
     * [WARN] 2016-07-02T12:29:38.174Z [Contexto] mensaje en warn
     * continueLog("y más","mensaje")
     * [WARN] 2016-07-02T12:29:38.174Z [Contexto] mensaje en warn y más mensaje
     */
    warn (context,...msg){
        let message = new LogMessage({
            terminal:this.terminal,
            level:LEVELS.WARN,
            context:context,
            msg:msg
        });
        return message;
    }
    /**
     * @description Muestra un mensaje info
     * @param context   El contexto hace referencia a la clase o elemento que produce el log, se enmarca en []
     * @param msg       Uno o varios mensajes.
     * @returns continue    Permite imprimir a continuación del log.
     * @example let continueLog = logger.info("Contexto","mensaje","en","info")
     * [INFO] 2016-07-02T12:29:38.174Z [Contexto] mensaje en info
     * continueLog("y más","mensaje")
     * [INFO] 2016-07-02T12:29:38.174Z [Contexto] mensaje en info y más mensaje
     */
    info (context,...msg){
        let message = new LogMessage({
            terminal:this.terminal,
            level:LEVELS.INFO,
            context:context,
            msg:msg
        });
        return message;
    }
    /**
     * @description Muestra un mensaje de error
     * @param context   El contexto hace referencia a la clase o elemento que produce el log, se enmarca en []
     * @param msg       Uno o varios mensajes.
     * @returns continue    Permite imprimir a continuación del log.
     * @example let continueLog = logger.error("Contexto","mensaje","en","error")
     * [ERROR] 2016-07-02T12:29:38.174Z [Contexto] mensaje en error
     * continueLog("y más","mensaje")
     * [ERROR] 2016-07-02T12:29:38.174Z [Contexto] mensaje en error y más mensaje
     */
    error (context,...msg){
        let message = new LogMessage({
            terminal:this.terminal,
            level:LEVELS.ERROR,
            context:context,
            msg:msg
        });
        return message;
    }

    /**
     * @description Actualiza la configuración del logger
     * @param config
     */
    setConfig(config){
        this.config = config;
    }




}
module.exports = {
    getLogger:function(name,config){
        if(!instances[name]){
            instances[name] = new Logger(config);
        }
        return instances[name];
    }
};
