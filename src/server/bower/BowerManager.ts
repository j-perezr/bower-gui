/// <reference path="../../../typings/index.d.ts" />
import {Logger} from "../common/Logger";
import * as q from "q";
import * as fs from "fs";
export interface IError {
    code:string;
    message:string;
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
    public installAll(options){
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
    public install(name,options:IInstall){
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
     * @description Desinstala un paquete
     * @param name                  Nombre del paquete a desinstalar
     * @param [options]             Opciones para la desinstalación. Acepta:
     * @param [options.save]        Elimina el paquete del registro de dependencias(bower.json)
     * @param [options.saveDev]     Elimina el paquete del registro de dependencias de desarrollo(bower.json)
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
     * @description Busca paquetes cuyo nombre coincida con el término indicado
     * @param term
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
     * @description Busca paquetes cuyo nombre coincida con el término indicado
     * @param term
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
     * @param done  Callback a invocar si el proceso es satisfactorio
     * @param fail  Callback a invocar si el proceso falla
     */
    public listPackages() {
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
                defer.reject(e);
            })
            .on("end", function (info) {
                logger.info("BowerManager", "^gok^: retriving packages");
                defer.resolve(info);
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