import * as log from "loglevel";
/**
 * @class LogPrefix
 * @description Plugin for loglevel to add prefixes
 */
export class LogPrefix {
    protected originalFactory;
    protected rawMethod;

    /**
     * @param log               Instance of loglevel to apply the plugin
     * @param [separator=" "]   Separator for prefix
     */
    constructor (protected log,
                 protected separator = " "){
        //store original factory
        this.originalFactory = this.log.methodFactory;
        let that = this;
        //create new factory
        log.methodFactory = function(){
            return that._factory.apply(that,arguments);
        };
        //invocar set level para aplicar plugin
        log.setLevel(log.getLevel());
    }

    /**
     * @description Generate the function to build the log. Invoked by loglevel
     * @param methodName        Name of the method invoked. Ej: info
     * @param logLevel          Log level related to method
     * @param loggerName        Log name
     * @returns {function}
     * @protected
     */
    protected _factory (methodName,logLevel,loggerName){
        //generate the log function by the original factory
        let rawMethod = this.originalFactory(methodName,logLevel,loggerName);
        //generate the log function
        return new LogRaw(rawMethod, methodName,logLevel,loggerName,this.separator).getRawFunction();
    }
}
/**
 * @class LogRaw
 * @description Generate the function to create the log messages and print them
 */
class LogRaw {
    protected parsedMethodName;

    /**
     *
     * @param originalRawMethod         Original method for print log
     * @param methodName                Name of the method invoked. Ej: info
     * @param logLevel                  Log level related to method
     * @param loggerName                Log name
     * @param separator                 Separator for prefix
     */
    constructor (protected originalRawMethod,
                 protected methodName,
                 protected logLevel,
                 protected loggerName,
                 protected separator){
        this.parsedMethodName = methodName.toUpperCase();
    }

    /**
     * @description Obtains the method to assign to logllevel to print the log
     * @returns {function}
     */
    public getRawFunction(){
        let that = this;
        return function(){
            that._makeLog.apply(that,arguments);
        }
    }

    /**
     * @description Genera el log
     * @param {String||String[]}  prefix    Pefix or prefixes to apply
     * @param {String[]}          messages  Message to print
     * @protected
     */
    protected _makeLog(prefix,...messages){
        let toPrefix = arguments.length > 1 ? arguments[0] : null;
        let prefix = this._makePrefix(toPrefix);
        let toLog = [prefix].concat(messages);
        this.originalRawMethod.apply(this,toLog);
    }

    /**
     * @description Generate the prefix. Includes timestamp and method name
     * @param toPrefix
     * @returns {string}
     * @protected
     */
    protected _makePrefix (toPrefix){
        let prefix = [];
        prefix.push(this.parsedMethodName);
        prefix.push(new Date().toISOString());
        if(toPrefix){
            if(Array.isArray(toPrefix)){
                prefix = prefix.concat(toPrefix);
            }else{
                prefix.push(toPrefix)
            }
        }
        prefix.push();
        return "[ "+prefix.join(this.separator)+" ]";
    }
}