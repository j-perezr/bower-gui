import {IScope,ICacheObject} from "@types/angular";
import {IStateService,IStateParamsService} from "@types/angular-ui-router"
module common {
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
    export class BaseCtrl {
        public static $inject = [
            "$scope",
            "$state",
            "$stateParams",
            "$cacheFactory"
        ];
        protected $inject:String[];
        protected $scope:angular.IScope;
        protected $state:angular.ui.IStateService;
        protected $stateParams:angular.ui.IStateParamsService;
        protected $cacheFactory:any;
        protected stateCache:angular.ICacheObject;
        protected stateParams:any;
        /**
         * @constructor
         */
        constructor (){
            this._registerDependencies(this.$inject,arguments);
        }
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
         * @private
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
                //restaura los datos en las letiables correspondientes. Es necesario implementarlo de manera independiente en cada clase hija
                return this._restoreStateData(toRestore);//debe devolver si se ha restaurado o no el estado
            } else {
                return false;
            }
        }

        /**
         * @description Restaura los datos del estado. Es necesario implementarlo en cada controllador
         * @param {any} state       Datos almacenados en el estado. Estos datos se obtienen mediante _getStateDataToStore
         * @private
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

    }
}