///<reference path="../../_all.d.ts"/>
import {IScope,ICacheObject} from "@types/angular";
import {IStateService,IStateParamsService} from "@types/angular-ui-router";
namespace common.controllers {
    "use strict";
    /**
     * @class _BaseCtrl
     * @abstract
     * @description Clase base de la cual heredarán todos los controladores
     * @requires $scope
     * @requires $state
     * @requires $stateParams
     * @requires $cacheFactory
     * @protected
     */
    export abstract class BaseCtrl {
        public static $inject:string[] = [
            "$scope",
            "$state",
            "$stateParams",
            "$cacheFactory"
        ];
        protected $scope:angular.IScope;
        protected $state:angular.ui.IStateService;
        protected $stateParams:angular.ui.IStateParamsService;
        protected $cacheFactory:any;
        protected stateCache:angular.ICacheObject;
        protected stateParams:any;
        /**
         * @constructor
         */
        constructor (dependencies){
            //al utilizarse el spread operator para las dependencias, se van anidando por lo que es necesario extraerlas
            dependencies = this._extractValidDependencies(dependencies);
            this._registerDependencies(this._resolveDependenciesList(),dependencies);
        }

        /**
         * @description Extrae el listado de dependencias
         * @param dependencies
         * @returns {any}
         * @private
         */
        protected _extractValidDependencies(dependencies){
            let result,
                toCheck = dependencies[0];
            if(Array.isArray(toCheck)){
                result = this._extractValidDependencies(toCheck);
            }else{
                result = dependencies;
            }
            return result;
        }
        /**
         * @description Devuelve la lista de dependencias a inyectar
         * @returns {string[]}
         * @protected
         */
        protected abstract _resolveDependenciesList();
        /**
         * @description Habilita la posibilidad de almacenar datos para el estado
         * @param [name]        Nombre de la caché a utilizar. Por defecto se utiliza el nombre del state
         */
        protected enableStateCache (name,params){
            if (!this.stateCache) {
                let cache = this.$cacheFactory.get(name || this.$state.current.name);
                if (!cache) {
                    cache = this.$cacheFactory(name || this.$state.current.name);
                }
                this.stateCache = cache;
                this.stateParams = params;
                let that = this;
                this.$scope.$on('$stateChangeStart', function () {
                    that.saveState();
                });
            }
        }
        /**
         * @description Elimina los datos almacenados en el state
         * @return True si se ha eliminado el estado. False en caso contrario
         */
        protected clearState ():boolean{
            if (this.stateCache) {
                this.stateCache.removeAll();
                return true;
            } else {
                return false;
            }
        }
        /**
         * @description Guarda el estado actual
         */
        protected saveState ():boolean {
            if (this.stateCache) {
                //obtiene los datos a almacenar. Es necesario implementarlo de manera independiente en cada clase hija
                let toStore = this._getStateDataToStore(),
                    currentState = this.stateCache.get("state");
                $.extend(toStore, currentState);
                this.stateCache.put("state", toStore);
                return true;
            } else {
                return false;
            }
        }

        /**
         * @description Devuelve los datos a guardar en el estado. Es necesario implementarlo en cada controlador
         * @protected
         * @return any  Datos a almacenar
         */
        protected _getStateDataToStore (){}
        /**
         * @description Restaura el estado almacenado
         * @returns {boolean}   True si se ha restaurado el estado. False en caso contrario
         */
        protected restoreState ():boolean {
            if (this.stateCache) {
                let toRestore = this.stateCache.get("state");
                if (this.stateParams == undefined || this.stateParams.flushOnRestore != false) {
                    this.stateCache.removeAll();
                }
                //restaura los datos en las variables correspondientes. Es necesario implementarlo de manera independiente en cada clase hija
                return this._restoreStateData(toRestore);//debe devolver si se ha restaurado o no el estado
            } else {
                return false;
            }
        }

        /**
         * @description Restaura los datos del estado. Es necesario implementarlo en cada controllador
         * @param {any} state       Datos almacenados en el estado. Estos datos se obtienen mediante _getStateDataToStore
         * @protected
         */
        protected _restoreStateData (state:any):boolean{return false;}
        /**
         * @description Registra las dependencias comunes para evitar tener que mapearlas a mano en cada clase hija
         * @protected
         */
        protected _registerDependencies  (dependenciesNames, dependencies) {
            for (let dependenceIndex = 0, dependenciesNamesLength = dependenciesNames.length; dependenceIndex < dependenciesNamesLength; dependenceIndex++) {
                let currentdependence = dependenciesNames[dependenceIndex];
                this[currentdependence] = dependencies[dependenceIndex];
            }
        }
        /**
         * @description Genera un mensaje por defecto en función del error indicado
         * @param response
         * @param response.error        Código de error
         * @param response.message      Mensaje de error
         * @protected
         */
        protected _onRequestError (response) {
            //noinspection TypeScriptUnresolvedVariable
            let errors = common.services.BaseSrv.ERROR_CODES,
                msg;
            switch (response.error) {
                case errors.invalid:
                case errors.badRequest:
                    msg = "Se ha producido un error y no se ha podido procesar la operacion";
                    break;
                case errors.methodNotAllowed:
                case errors.notAuthorized:
                    msg = "No tiene permisos para realizar esta operación.";
                    break;
                case errors.notAvailable:
                case errors.notFound:
                    msg = "El servicio no está disponible. Inténtelo de nuevo en unos minutos y si el error persiste contacte al administrador de la aplicación.";
                    break;
                case errors.timeout:
                    msg = "Se ha superado el límite de tiempo al enviar los datos. Inténtelo de nuevo en unos minutos y si el error persiste contacte al administrador de la aplicación.";
                    break;
                case errors.entityToLarge:
                    msg = "Se ha superado el límite de datos admitidos. Si ha introducido texto y puede reducirlo, por favor redúzcalo. En caso contrario contacte al administrador de la aplicación.";
                    break;
                case errors.error:
                    msg = "Se ha producido un error al procesar la operación. Inténtelo de nuevo en unos minutos y si el error persiste contacte al administrador de la aplicación.";
                    break;
                case errors.tooManyRequests:
                    msg = "Se han superado el número de peticiones. Inténtelo de nuevo en unos minutos y si el error persiste contacte al administrador de la aplicación.";
                    break;
                case errors.unknow:
                default:
                    msg = "Se ha producido un error no esperado. Inténtelo de nuevo en unos minutos y si el error persiste contacte al administrador de la aplicación.";
                    break;
            }
            return msg;
        }

        /**
         * @description Extiende las dependencias del hijo incluyendo las del padre
         * @param parentDependencies
         * @param childrenDependencies
         * @returns {string[]}
         * @constructor
         */
        protected static EXTEND_DEPENDENCIES_LIST (parentDependencies:string[],childrenDependencies:string[]){
            return $.unique(
                childrenDependencies.concat(parentDependencies)
            );
        }
    }
}