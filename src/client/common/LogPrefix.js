"use strict";
/**
 * @class LogPrefix
 * @description Plugin for loglevel to add prefixes
 */
var LogPrefix = (function () {
    /**
     * @param log               Instance of loglevel to apply the plugin
     * @param [separator=" "]   Separator for prefix
     */
    function LogPrefix(log, separator) {
        if (separator === void 0) { separator = " "; }
        this.log = log;
        this.separator = separator;
        //store original factory
        this.originalFactory = this.log.methodFactory;
        var that = this;
        //create new factory
        log.methodFactory = function () {
            return that._factory.apply(that, arguments);
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
    LogPrefix.prototype._factory = function (methodName, logLevel, loggerName) {
        //generate the log function by the original factory
        var rawMethod = this.originalFactory(methodName, logLevel, loggerName);
        //generate the log function
        return new LogRaw(rawMethod, methodName, logLevel, loggerName, this.separator).getRawFunction();
    };
    return LogPrefix;
}());
exports.LogPrefix = LogPrefix;
/**
 * @class LogRaw
 * @description Generate the function to create the log messages and print them
 */
var LogRaw = (function () {
    /**
     *
     * @param originalRawMethod         Original method for print log
     * @param methodName                Name of the method invoked. Ej: info
     * @param logLevel                  Log level related to method
     * @param loggerName                Log name
     * @param separator                 Separator for prefix
     */
    function LogRaw(originalRawMethod, methodName, logLevel, loggerName, separator) {
        this.originalRawMethod = originalRawMethod;
        this.methodName = methodName;
        this.logLevel = logLevel;
        this.loggerName = loggerName;
        this.separator = separator;
        this.parsedMethodName = methodName.toUpperCase();
    }
    /**
     * @description Obtains the method to assign to logllevel to print the log
     * @returns {function}
     */
    LogRaw.prototype.getRawFunction = function () {
        var that = this;
        return function () {
            that._makeLog.apply(that, arguments);
        };
    };
    /**
     * @description Genera el log
     * @param {String||String[]}  prefix    Pefix or prefixes to apply
     * @param {String[]}          messages  Message to print
     * @protected
     */
    LogRaw.prototype._makeLog = function (prefix) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        var toPrefix = arguments.length > 1 ? arguments[0] : null;
        var prefix = this._makePrefix(toPrefix);
        var toLog = [prefix].concat(messages);
        this.originalRawMethod.apply(this, toLog);
    };
    /**
     * @description Generate the prefix. Includes timestamp and method name
     * @param toPrefix
     * @returns {string}
     * @protected
     */
    LogRaw.prototype._makePrefix = function (toPrefix) {
        var prefix = [];
        prefix.push(this.parsedMethodName);
        prefix.push(new Date().toISOString());
        if (toPrefix) {
            if (Array.isArray(toPrefix)) {
                prefix = prefix.concat(toPrefix);
            }
            else {
                prefix.push(toPrefix);
            }
        }
        prefix.push();
        return "[ " + prefix.join(this.separator) + " ]";
    };
    return LogRaw;
}());
//# sourceMappingURL=LogPrefix.js.map