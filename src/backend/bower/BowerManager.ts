
import {Logger} from "../common/Logger";
import * as q from "q";
export interface IError {
    code:string;
    message:string;
}
export interface IOperationResult{
    result:IResult;
    shared:any;
}
export interface IResult{
    error:boolean|IError;
    result:any;
}
export interface IUninstall{
    save?:boolean;
    saveDev?:boolean;
}
export interface IInstall{
    save?:boolean;
    saveDev?:boolean;
    forceLatest?:boolean;
    production?:boolean;
    saveExact?:boolean;

}
/**
 * @class BowerManager
 * @description Servicios de bower que otorgan la api rest
 */
export class BowerManager {
    protected logger;

    constructor(protected bower, protected fs) {
        this.logger = Logger.getLogger("server");
    }

    /**
     * @description Attempt to insall all packages
     * @param options       Options for bower
     * @returns {Promise<T>}
     */
    public installAll(options):Q.IPromise<any>{
        let defer = q.defer(),
            logger = this.logger;
        this.logger.info("BowerManager",`attempting to install all packages...`);
        this.bower.commands.install([],options)
            .on("log",function (log) {
                debugger;
                if(log.id == "cached"){
                    logger.trace("BowerManager",`^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
                }else if(log.id == "install"){
                    logger.info("BowerManager", `^c${log.id}^: ${log.message}`);
                }else{
                    logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
                }
            })
            .on("error",function(e){
                debugger;
                logger.error("BowerManager",` fail on install all packages. Code: ${e.code}, details: ${e.message}`);
                defer.reject(e);
            })
            .on("end",function(result){
                debugger;
                logger.info("BowerManager",`^gok^: Packages installed`);
                defer.resolve(result);
            });
        return defer.promise;
    }

    /**
     * @description Attempt to install a package
     * @param name          Name of the package to install
     * @param options       Options for bower
     * @returns {Promise<T>}
     */
    public install(name,options:IInstall):Q.IPromise<any>{
        let defer = q.defer(),
            logger = this.logger;
        this.logger.info("BowerManager",`attempting to install the package '${name}'...`);
        this.bower.commands.install([name],options)
            .on("log",function (log) {
                debugger;
                if(log.id == "cached"){
                    logger.trace("BowerManager",`^cFound cache^:, package: ${log.data.resolver.name}, source: ${log.data.resolver.source}, target: ${log.data.resolver.target}`);
                }else if(log.id == "install"){
                    logger.info("BowerManager", `^c${log.id}^: ${log.message}`);
                }else{
                    logger.trace("BowerManager", `^c${log.id}^: ${log.message}`);
                }
            })
            .on("error",function(e){
                debugger;
                logger.error("BowerManager",`fail on uninstall '${name}'. Code: ${e.code}, details: ${e.message}`);
                defer.reject(e);
            })
            .on("end",function(result){
                debugger;
                logger.info("BowerManager",`^gok^: Package'${name}' installed`);
                defer.resolve(result);
            });
        return defer.promise;
    }
    /**
     * @description Uninstall a package
     * @param name                  Name of the package to uninstall
     * @param [options]             Opciones for bower. Accept:
     * @param [options.save]        Removes the package from the dependencies register
     * @param [options.saveDev]     Removes the package from the dev dependencies register
     * @returns {Promise<T>}
     */
    public uninstall(name,options:IUninstall){
        let defer = q.defer(),
            logger = this.logger;
        this.logger.info("BowerManager", `attempting to uninstall the package '${name}'...`);
        this.bower.commands.uninstall([name],options)
            .on("log", function (log) {
                debugger;
                if(log.id=="not-installed"){
                    logger.warn("BowerManager",`'${name}' is not installed. Any change done`);
                    defer.resolve(null);
                }
            })
            .on("error", function (e) {
                debugger;
                logger.error("BowerManager", `fail on uninstall '${name}'. Code: ${e.code}, details: ${e.message}`);
                defer.reject(e);
            })
            .on("end", function (result) {
                debugger;
                logger.info("BowerManager", `^gok^: Package '${name}' uninstalled`);
                defer.resolve(result);
            });
        return defer.promise;
    }
    /**
     * @description Display the info of a package
     * @param name              Name of the package
     * @returns {Promise<T>}
     */
    public info(name) {
        let defer = q.defer(),
            logger = this.logger;
        this.logger.info("BowerManager", `retriving package info for '${name}'...`);
        this.bower.commands.info(name)
            .on("log", function () {
                debugger;
            })
            .on("error", function (e) {
                debugger;
                switch(e.code){
                    case "ENOTFOUND":
                        logger.warn("BowerManager", `Not found '${name}' package`);
                        defer.resolve(null);
                        break;
                    default:
                        logger.error("BowerManager", `fail on get info for '${name}'. Code: ${e.code}, details: ${e.message}`);
                        defer.reject(e);
                        break;
                }
            })
            .on("end", function (result) {
                logger.info("BowerManager", `^gok^: Retrived '${name}' package info`);
                defer.resolve(result);
            });
        return defer.promise;
    }
    /**
     * @description Search a package
     * @param query
     * @returns {Promise<T>}
     */
    public search(query){
        let defer = q.defer(),
            logger = this.logger;
        this.logger.info("BowerManager", `search packages for '${query}'...`);
        this.bower.commands.search(query)
            .on("log",function(){
                debugger;
            })
            .on("error",function(e){
                debugger;
                logger.error("BowerManager",`fail on search packages. Term: ${query}. Code: ${e.code}, details: ${e.message}`);
                defer.reject(e);
            })
            .on("end",function(results){
                logger.info("BowerManager", `^gok^: search packages for '${query}'...`);
                defer.resolve(results);
            });
        return defer.promise;
    }
    /**
     * @description Obtiene los paquetes de bower
     */
    public listPackages(share) {
        let logger = this.logger,
            defer = q.defer();
        this.logger.info("BowerManager", "retriving packages...");
        this.bower.commands.list()
            .on("log",function(e){
                debugger;
                logger.trace("BowerManager",`${e.id}: ${e.message}`);
            })
            .on("error",function(e){
                debugger;
                logger.error("BowerManager",`on retriving packages. Code: '${e.code}', details:'${e.message}'`);
                let error:IError = {
                    code:e.code,
                    message:e.message
                };
                let result:IResult = {
                    error:error,
                    result:null
                };
                defer.reject(result);
            })
            .on("end", function (info) {
                logger.info("BowerManager", "^gok^: retriving packages");
                let result:IResult = {
                    error:null,
                    result:info
                };
                defer.resolve({result:result,shared:share});
            });
        return defer.promise;
    }

    /**
     * @description Sobreescribe el fichero bower.json con el contenido indicado
     * @param config
     * @returns {IResult}
     */
    public setConfigFile(config):IResult{
        let defer = q.defer();
        this.logger.info("BowerManager", "writting config file...");
        try{
            if(typeof config != "string"){
                config = JSON.stringify(config,null,2);//stringify and prettify
            }
            this.fs.writeFile("bower.json",config,function(err){
                if(!err){
                    this.logger.info("BowerManager", "writting config file...^gok^:");
                    defer.resolve(true);
                }else{
                    this.logger.error("BowerManager","fail on writting bower.json file:",err.details);
                    defer.reject(err);
                }
            }.bind(this));
        }catch(e){
            defer.reject(e);
            this.logger.error("BowerManager","fail on writting bower.json file:",e.details);
        }
        return defer.promise;
    }
    /**
     * @description Verifica la existencia del fichero de configuración de bower
     */
    public getConfigFile():IResult {
        let defer = q.defer();
        this.logger.info("BowerManager", "retriving config file...");
        this.fs.readFile("bower.json", {encoding: "utf8"},function(error,data){
            if(!error){
                try{
                    let result = JSON.parse(data);
                    this.logger.info("BowerManager", "retriving config file...^gok^:");
                    defer.resolve(data);
                }catch(e){
                    defer.reject(error);
                    this.logger.error("BowerManager", "fail on get bower.json file:", error.message);
                }
            }else{
                switch(error.code) {
                    case "ENOENT":
                        defer.resolve(null);
                        this.logger.warn("BowerManager", "not config file found");
                        break;
                    default:
                        defer.reject(error);
                        this.logger.error("BowerManager", "fail on get bower.json file:", error.message);
                        break;
                }
            }
        }.bind(this));
        return defer.promise;
    }
}