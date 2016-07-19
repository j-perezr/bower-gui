"use strict";
const logger = require("../utils/Logger");
const bower = require("bower");
const express = require("express");
const fs = require("fs");
const BowerManager_1 = require("./BowerManager");
/**
 * @class BowerSrv
 * @description Servicios de bower que otorgan la api rest
 */
class BowerSrv {
    constructor(expressInstance) {
        this.expressInstance = expressInstance;
        this.bower = bower;
        this.logger = logger.getLogger("server");
        this.logger.info("BowerSrv", "creating BowerSrv instance");
        this.bowerManager = new BowerManager_1.BowerManager(bower, fs);
        this._registerRoutes();
    }
    /**
     * @description Obtiene la instancia del servicio
     * @param expressInstance
     * @param bower
     * @returns {any}
     */
    static getInstance(expressInstance, bower) {
        if (!BowerSrv.instance) {
            BowerSrv.instance = new BowerSrv(expressInstance);
        }
        return BowerSrv.instance;
    }
    /**
     * @description Registra todas las rutas disponibles exponiendo el api
     * @private
     */
    _registerRoutes() {
        this.router = express.Router();
        this.router.get(BowerSrv.GET_PACKAGES, this.routeListPackages.bind(this));
        this.logger.info("BowerSrv", "GET method on", BowerSrv.GET_PACKAGES + " registered");
        this.router.get(BowerSrv.GET_SEARCH_PACKAGE, this.routeSearchPackage.bind(this));
        this.logger.info("BowerSrv", "GET method on", BowerSrv.GET_SEARCH_PACKAGE + " registered");
        this.router.get(BowerSrv.GET_INFO_PACKAGE, this.routeInfoPackage.bind(this));
        this.logger.info("BowerSrv", "GET method on", BowerSrv.GET_INFO_PACKAGE + " registered");
        this.router.delete(BowerSrv.UNINSTALL_PACKAGE, this.routeUninstallPackage.bind(this));
        this.logger.info("BowerSrv", "DELETE method on", BowerSrv.UNINSTALL_PACKAGE + " registered");
        this.router.post(BowerSrv.INSTALL_PACKAGES, this.routeInstallAllPackages.bind(this));
        this.logger.info("BowerSrv", "POST method on", BowerSrv.INSTALL_PACKAGES + " registered");
        this.router.post(BowerSrv.INSTALL_PACKAGE, this.routeInstallPackage.bind(this));
        this.logger.info("BowerSrv", "POST method on", BowerSrv.INSTALL_PACKAGE + " registered");
        this.router.get(BowerSrv.GET_CONFIG, this.routeGetConfigFile.bind(this));
        this.logger.info("BowerSrv", "GET method on", BowerSrv.GET_CONFIG + " registered");
        this.router.put(BowerSrv.PUT_CONFIG, this.routePutConfigFile.bind(this));
        this.logger.info("BowerSrv", "PUT method on", BowerSrv.PUT_CONFIG + " registered");
        this.expressInstance.use(BowerSrv.BASE_URL, this.router);
    }
    /**
     * @description Invocado por express encapsulando el uso de installAll
     * @param req
     * @param res
     */
    routeInstallAllPackages(req, res) {
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.installAll({
            save: req.query.save == true || req.query.save == "true",
            saveDev: req.query.saveDev == true || req.query.saveDev == "true",
            forceLatest: req.query.forceLatest == true || req.query.forceLatest == "true",
            saveExact: req.query.saveExact == true || req.query.saveExact == "true",
            production: req.query.production == true || req.query.production == "true"
        })
            .then(function (results) {
            response.result = results;
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de install
     * @param req
     * @param res
     */
    routeInstallPackage(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.install(req.params.package_name, {
            save: req.query.save == true || req.query.save == "true",
            saveDev: req.query.saveDev == true || req.query.saveDev == "true",
            forceLatest: req.query.forceLatest == true || req.query.forceLatest == "true",
            saveExact: req.query.saveExact == true || req.query.saveExact == "true",
            production: req.query.production == true || req.query.production == "true"
        })
            .then(function (results) {
            response.result = results;
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de uninstall
     * @param req
     * @param res
     */
    routeUninstallPackage(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.uninstall(req.params.package_name, {
            save: req.query.save == true || req.query.save == "true",
            saveDev: req.query.saveDev == true || req.query.saveDev == "true"
        })
            .then(function (results) {
            response.result = results;
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de info
     * @param req
     * @param res
     */
    routeInfoPackage(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.info(req.params.package_name)
            .then(function (results) {
            response.result = results;
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de search
     * @param req
     * @param res
     */
    routeSearchPackage(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.search(req.query.q)
            .then(function (results) {
            response.result = results;
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de getPackages
     * @param req
     * @param res
     * @param send
     */
    routeGetConfigFile(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.getConfigFile()
            .then(function (result) {
            let response = {
                error: false,
                result: result
            };
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de listPackages
     * @param req
     * @param res
     * @param send
     */
    routeListPackages(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.listPackages()
            .then(function (info) {
            let response = {
                error: false,
                result: info
            };
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
    /**
     * @description Invocado por express encapsulando el uso de listPackages
     * @param req
     * @param res
     * @param send
     */
    routePutConfigFile(req, res) {
        debugger;
        let response = {
            error: false,
            result: null
        };
        this.bowerManager.setConfigFile(req.body)
            .then(function (result) {
            let response = {
                error: false,
                result: result
            };
            res.json(response);
        })
            .catch(function (error) {
            debugger;
            res.status(500);
            response.error = {
                code: error.code,
                message: error.message
            };
            res.json(response);
        });
    }
}
BowerSrv.BASE_URL = "/bower";
BowerSrv.BASE_PACKAGES = "/packages";
BowerSrv.GET_PACKAGES = BowerSrv.BASE_PACKAGES;
BowerSrv.INSTALL_PACKAGES = BowerSrv.BASE_PACKAGES;
BowerSrv.GET_SEARCH_PACKAGE = BowerSrv.BASE_PACKAGES + "/search";
BowerSrv.GET_INFO_PACKAGE = BowerSrv.BASE_PACKAGES + "/:package_name";
BowerSrv.INSTALL_PACKAGE = BowerSrv.BASE_PACKAGES + "/:package_name";
BowerSrv.UNINSTALL_PACKAGE = BowerSrv.BASE_PACKAGES + "/:package_name";
BowerSrv.BASE_CONFIG = "/config";
BowerSrv.GET_CONFIG = BowerSrv.BASE_CONFIG;
BowerSrv.PUT_CONFIG = BowerSrv.BASE_CONFIG;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BowerSrv;
//# sourceMappingURL=BowerSrv.js.map