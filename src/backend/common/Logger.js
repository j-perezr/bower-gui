"use strict";
let instances = {};
let fs = require("fs");
let path = require("path");
const LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    TRACE: 4,
    ALL: 5
};
const defaults = {
    level: LEVELS.TRACE,
    logPath: path.resolve(process.cwd(), "logs")
};
class LogMessage {
    /**
     *
     * @param params
     * @param params.terminal       Terminal
     * @param params.level          Level
     * @param params.context        Message context
     * @param params.msg            Message
     * @param params.saveInFile     Save automatically in a file
     * @param [params.logPath=logs] Path where save logs
     */
    constructor(params) {
        this.logPath = params.logPath || defaults.logPath;
        this.date = new Date();
        this.terminal = params.terminal;
        //this.terminal.getCursorLocation(this._saveLocation.bind(this));
        this.level = params.level;
        this.context = params.context;
        this.originalMsg = this._parseMessage(params.msg);
        this.msg = this._prepareMsg(this.context, this.originalMsg);
        this.terminal((params.breakLine !== false ? "\n" : "") + this.msg);
        if (params.saveInFile) {
            this.file();
        }
    }
    _saveLocation(error, x, y) {
        if (!error) {
            this.location = {
                x: x,
                y: y
            };
        }
    }
    _parseMessage(msg) {
        let parsedMsg = "";
        if (Array.isArray(msg)) {
            for (var msgIndex = 0, msgLength = msg.length; msgIndex < msgLength; msgIndex++) {
                var currentMsg = msg[msgIndex];
                if (typeof currentMsg == "object") {
                    try {
                        msg[msgIndex] = JSON.stringify(currentMsg, null, 4);
                    }
                    catch (e) {
                    }
                }
            }
            parsedMsg = msg.join(" ");
        }
        else {
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
    _prepareMsg(context, msg) {
        let type;
        switch (this.level) {
            case LEVELS.ERROR:
                type = "^r[ERROR]^:";
                break;
            case LEVELS.INFO:
                type = "^C[INFO]^:";
                break;
            case LEVELS.WARN:
                type = "^y[WARN]^:";
                break;
            case LEVELS.TRACE:
                type = "^Y[TRACE]^:";
                break;
        }
        var time = this.date.toISOString();
        return [type, time.substr(time.indexOf("T") + 1), "^C[" + context + "]^:", msg].join(" ");
    }
    /**
     *
     * @param text
     * @returns {Function}
     * @private
     */
    continue(...newText) {
        if (this.position) {
            for (var textIndex = 0; textIndex < newText.length; textIndex++) {
                newText[textIndex] = this._parseMessage(newText[textIndex]);
            }
            this.terminal.saveCursor().moveTo(this.position.x, this.position.y)(newText.join(" ")).restoreCursor();
        }
    }
    file() {
        let date = this.date, day = date.getDate(), year = date.getFullYear(), month = date.getMonth() + 1, hour = date.getHours(), route = path.resolve(this.logPath);
        if (!fs.existsSync(route)) {
            fs.mkdirSync(route);
        }
        route = path.resolve(route, year.toString());
        if (!fs.existsSync(route)) {
            fs.mkdirSync(route);
        }
        route = path.resolve(route, month.toString());
        if (!fs.existsSync(route)) {
            fs.mkdirSync(route);
        }
        route = path.resolve(route, day.toString());
        if (!fs.existsSync(route)) {
            fs.mkdirSync(route);
        }
        route = path.resolve(route, hour.toString() + ".txt");
        fs.appendFile(route, this.msg + "\n", this._onWrite.bind(this));
    }
    _onWrite(e) {
        if (e) {
            console.error("[Logger]", `Error on write file:${e}`);
        }
    }
}
/**
 * @class Logger
 * @description Sistema de logging
 * @requires cli-color
 */
class Logger {
    constructor(config) {
        this.setConfig(config);
        this.terminal = require("terminal-kit").terminal;
    }
    /**
     * @description Muestra un mensaje error
     * @param context   El contexto hace referencia a la clase o elemento que produce el log, se enmarca en []
     * @param msg       Uno o varios mensajes.
     * @returns continue    Permite imprimir a continuación del log.
     * @example let continueLog = logger.error("Contexto","mensaje","en","error")
     * [ERROR] 2016-07-02T12:29:38.174Z [Contexto] mensaje en error
     * continueLog("y más","mensaje")
     * [ERROR] 2016-07-02T12:29:38.174Z [Contexto] mensaje en error y más mensaje
     */
    error(context, ...msg) {
        let message = new LogMessage({
            terminal: this.terminal,
            level: LEVELS.ERROR,
            context: context,
            msg: msg,
            saveInFile: this.config.saveInFile
        });
        return message;
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
    warn(context, ...msg) {
        let message = new LogMessage({
            terminal: this.terminal,
            level: LEVELS.WARN,
            context: context,
            msg: msg,
            saveInFile: this.config.saveInFile
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
    info(context, ...msg) {
        let message = new LogMessage({
            terminal: this.terminal,
            level: LEVELS.INFO,
            context: context,
            msg: msg,
            saveInFile: this.config.saveInFile
        });
        return message;
    }
    /**
     * @description Muestra un mensaje de traza
     * @param context   El contexto hace referencia a la clase o elemento que produce el log, se enmarca en []
     * @param msg       Uno o varios mensajes.
     * @returns continue    Permite imprimir a continuación del log.
     * @example let continueLog = logger.trace("Contexto","mensaje","en","traza")
     * [TRACE] 2016-07-02T12:29:38.174Z [Contexto] mensaje en traza
     * continueLog("y más","mensaje")
     * [TRACE] 2016-07-02T12:29:38.174Z [Contexto] mensaje en error y más mensaje
     */
    trace(context, ...msg) {
        let message = new LogMessage({
            terminal: this.terminal,
            level: LEVELS.TRACE,
            context: context,
            msg: msg,
            saveInFile: this.config.saveInFile
        });
        return message;
    }
    /**
     * @description Actualiza la configuración del logger
     * @param config
     */
    setConfig(config) {
        this.config = config;
    }
    static getLogger(name, config) {
        if (!instances[name]) {
            instances[name] = new Logger(config);
        }
        return instances[name];
    }
}
exports.Logger = Logger;
