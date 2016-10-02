"use strict";
const Logger_1 = require("../common/Logger");
const path = require("path");
/**
 * @class BowerManager
 * @description Servicios de bower que otorgan la api rest
 */
class BowerManager {
    constructor(bower, fs) {
        this.bower = bower;
        this.fs = fs;
        this.logger = Logger_1.Logger.getLogger("server");
    }
    /**
     * @description Attepmt to install all packages registered
     * @param {IOperationOptions}   options     Options
     * @see https://bower.io/docs/api/#install
     */
    installAll(options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", `attempting to install all packages...`);
        this.bower.commands.install([], options.config)
            .on("log", function (log) {
            debugger;
            if (log.id == "cached") {
                logger.trace("BowerManager", `^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
            }
            else if (log.id == "install") {
                logger.info("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            else {
                logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            if (options.progress) {
                let notify = {
                    log: log
                };
                let result = {
                    error: null,
                    result: null,
                    notify: notify
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.progress(operationResult);
            }
        })
            .on("error", function (e) {
            debugger;
            logger.error("BowerManager", ` fail on install all packages. Code: ${e.code}, details: ${e.message}`);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (results) {
            debugger;
            logger.info("BowerManager", `^gok^: Packages installed`);
            if (options.done) {
                let result = {
                    error: null,
                    result: results,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Attempt to install a package
     * @param {String}              name        Name of the package to install
     * @param {IOperationOptions}   options     Options
     * @see https://bower.io/docs/api/#install
     */
    install(name, options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", `attempting to install the package '${name}'...`);
        this.bower.commands.install([name], options.config)
            .on("log", function (log) {
            debugger;
            if (log.id == "cached") {
                logger.trace("BowerManager", `^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
            }
            else if (log.id == "install") {
                logger.info("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            else {
                logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            if (options.progress) {
                let notify = {
                    log: log
                };
                let result = {
                    error: null,
                    result: null,
                    notify: notify
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.progress(operationResult);
            }
        })
            .on("error", function (e) {
            debugger;
            logger.error("BowerManager", `fail on uninstall '${name}'. Code: ${e.code}, details: ${e.message}`);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (results) {
            debugger;
            logger.info("BowerManager", `^gok^: Package'${name}' installed`);
            if (options.done) {
                let result = {
                    error: null,
                    result: results,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Attempt to uninstall a package
     * @param {String}              name        Name of the package to uninstall
     * @param {IOperationOptions}   options     Options
     * @https://bower.io/docs/api/#uninstall
     */
    uninstall(name, options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", `attempting to uninstall the package '${name}'...`);
        this.bower.commands.uninstall([name], options)
            .on("log", function (log) {
            debugger;
            if (log.id == "not-installed") {
                logger.warn("BowerManager", `'${name}' is not installed. Any change done`);
                if (options.done) {
                    let result = {
                        error: null,
                        result: null,
                        notify: null
                    };
                    let operationResult = {
                        result: result,
                        shared: options.share
                    };
                    options.done(operationResult);
                }
            }
            else {
                if (log.id == "cached") {
                    logger.trace("BowerManager", `^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
                }
                else if (log.id == "install") {
                    logger.info("BowerManager", `^c${log.id}^: ${log.message}`);
                }
                else {
                    logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
                }
                if (options.progress) {
                    let notify = {
                        log: log
                    };
                    let result = {
                        error: null,
                        result: null,
                        notify: notify
                    };
                    let operationResult = {
                        result: result,
                        shared: options.share
                    };
                    options.progress(operationResult);
                }
            }
        })
            .on("error", function (e) {
            debugger;
            logger.error("BowerManager", `fail on uninstall '${name}'. Code: ${e.code}, details: ${e.message}`);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (results) {
            debugger;
            logger.info("BowerManager", `^gok^: Package '${name}' uninstalled`);
            if (options.done) {
                let result = {
                    error: null,
                    result: results,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Get info for a package
     * @param {String}              name        Name of the package to get info
     * @param {IOperationOptions}   options     Options
     * @see https://bower.io/docs/api/#info
     */
    info(name, options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", `retriving package info for '${name}'...`);
        this.bower.commands.info(name, options.config)
            .on("log", function (log) {
            debugger;
            if (log.id == "cached") {
                logger.trace("BowerManager", `^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
            }
            else {
                logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            if (options.progress) {
                let notify = {
                    log: log
                };
                let result = {
                    error: null,
                    result: null,
                    notify: notify
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.progress(operationResult);
            }
        })
            .on("error", function (e) {
            debugger;
            switch (e.code) {
                case "ENOTFOUND":
                    logger.warn("BowerManager", `Not found '${name}' package`);
                    break;
                default:
                    logger.error("BowerManager", `fail on get info for '${name}'. Code: ${e.code}, details: ${e.message}`);
                    break;
            }
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (results) {
            logger.info("BowerManager", `^gok^: Retrived '${name}' package info`);
            if (options.done) {
                let result = {
                    error: null,
                    result: results,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Search a package
     * @param {String}              query       Query to search
     * @param {IOperationOptions}   options     Options
     * @see https://bower.io/docs/api/#search
     */
    search(query, options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", `search packages for '${query}'...`);
        this.bower.commands.search(query, options.config)
            .on("log", function (log) {
            if (log.id == "cached") {
                logger.trace("BowerManager", `^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
            }
            else {
                logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
            }
            if (options.progress) {
                let notify = {
                    log: log
                };
                let result = {
                    error: null,
                    result: null,
                    notify: notify
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.progress(operationResult);
            }
        })
            .on("error", function (e) {
            debugger;
            logger.error("BowerManager", `fail on search packages. Term: ${query}. Code: ${e.code}, details: ${e.message}`);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (results) {
            logger.info("BowerManager", `^gok^: search packages for '${query}'...`);
            if (options.done) {
                let result = {
                    error: null,
                    result: results,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Get the packages
     * @param {IOperationOptions}   options     Options
     * @see https://bower.io/docs/api/#list
     */
    listPackages(options = {}) {
        let logger = this.logger;
        this.logger.info("BowerManager", "retriving packages...");
        this.bower.commands.list()
            .on("log", function (log) {
            debugger;
            logger.trace("BowerManager", `${log.id}: ${log.message}`);
            if (options.progress) {
                let notify = {
                    log: log
                };
                let result = {
                    error: null,
                    result: null,
                    notify: notify
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.progress(operationResult);
            }
        })
            .on("error", function (e) {
            debugger;
            logger.error("BowerManager", `on retriving packages. Code: '${e.code}', details:'${e.message}'`);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        })
            .on("end", function (info) {
            logger.info("BowerManager", "^gok^: retriving packages");
            if (options.done) {
                let result = {
                    error: null,
                    result: info,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.done(operationResult);
            }
        });
    }
    /**
     * @description Overwrite the content of the bower.json file
     * @param {Object}              config          The object to set in bower.json file
     * @param {IOperationOptions}   options     Options
     */
    setConfigFile(config, options = {}) {
        this.logger.info("BowerManager", "writting config file...");
        try {
            if (typeof config != "string") {
                config = JSON.stringify(config, null, 4); //stringify and prettify
            }
            this.fs.writeFile("bower.json", config, function (err) {
                if (!err) {
                    this.logger.info("BowerManager", "writting config file...^gok^:");
                    if (options.done) {
                        let result = {
                            error: null,
                            result: true,
                            notify: null
                        };
                        let operationResult = {
                            result: result,
                            shared: options.share
                        };
                        options.done(operationResult);
                    }
                }
                else {
                    this.logger.error("BowerManager", "fail on writting bower.json file:", err.details);
                    if (options.error) {
                        let error = {
                            code: err.code,
                            message: err.detail,
                            error: err
                        };
                        let result = {
                            error: error,
                            result: null,
                            notify: null
                        };
                        let operationResult = {
                            result: result,
                            shared: options.share
                        };
                        options.error(operationResult);
                    }
                }
            }.bind(this));
        }
        catch (e) {
            this.logger.error("BowerManager", "fail on writting bower.json file:", e.message);
            if (options.error) {
                let error = {
                    code: e.code,
                    message: e.message,
                    error: e
                };
                let result = {
                    error: error,
                    result: null,
                    notify: null
                };
                let operationResult = {
                    result: result,
                    shared: options.share
                };
                options.error(operationResult);
            }
        }
    }
    /**
     * @description Get the content of the bower.json file
     * @param {IOperationOptions}   options     Options
     */
    getConfigFile(options = {}) {
        this.logger.info("BowerManager", "retriving config file...");
        let route = path.resolve(process.cwd(), "bower.json");
        debugger;
        /*try {
            let bowerrc = this.fs.readFileSync(".bowerrc", {encoding: "utf8"});
            this.logger.trace("BowerManager",`.bowerrc found, parsing options`);
        }catch(e){
            if(e.code != "ENOENT"){
                if(options.error) {
                    let error: IError = {
                        code: e.code,
                        message: e.message,
                        error: e
                    };
                    let result: IApiResult = {
                        error: error,
                        result: null,
                        notify:null
                    };
                    let operationResult: IOperationResult = {
                        result: result,
                        shared: options.share
                    };
                    options.error(operationResult);
                }
            }
        }*/
        this.logger.trace("BowerManager", `trying to read bower.json from ^c${route}^`);
        this.fs.readFile(route, { encoding: "utf8" }, function (err, data) {
            if (!err) {
                try {
                    let bowerJsonResult = JSON.parse(data);
                    this.logger.info("BowerManager", "retriving config file...^gok^:");
                    if (options.done) {
                        let result = {
                            error: null,
                            result: bowerJsonResult,
                            notify: null
                        };
                        let operationResult = {
                            result: result,
                            shared: options.share
                        };
                        options.done(operationResult);
                    }
                }
                catch (e) {
                    this.logger.error("BowerManager", "fail on parse bower.json file:", e.message);
                    if (options.error) {
                        let error = {
                            code: e.code,
                            message: e.message,
                            error: e
                        };
                        let result = {
                            error: error,
                            result: null,
                            notify: null
                        };
                        let operationResult = {
                            result: result,
                            shared: options.share
                        };
                        options.error(operationResult);
                    }
                }
            }
            else {
                switch (err.code) {
                    case "ENOENT":
                        this.logger.warn("BowerManager", "not config file found");
                        break;
                    default:
                        this.logger.error("BowerManager", "fail on get bower.json file:", err.message);
                        break;
                        if (options.error) {
                            let error = {
                                code: err.code,
                                message: err.message,
                                error: err
                            };
                            let result = {
                                error: error,
                                result: null,
                                notify: null
                            };
                            let operationResult = {
                                result: result,
                                shared: options.share
                            };
                            options.error(operationResult);
                        }
                }
            }
        }.bind(this));
    }
}
exports.BowerManager = BowerManager;
