///<reference path="../../_all.d.ts"/>
import {IAngularStatic,IQService,IHttpService} from "@types/angular";
/**
 * @module LocaleLoader
 * @description Modulo encargado de la carga de ficheros de idiomas
 */

module localizer {
    let lang = {},
        langConfig = { 
            default:"es",
            resolveAs:{
                "ca":"es",
                "es-es":"es"
            }
        };
    /**
     * @abstract
     * @class
     * @description Clase padre para los cargadores
     */
    abstract class BaseLocalizerSrv extends common.services.BaseSrv{
        protected baseUrl:string;
        protected promise:JQueryPromise<any>;
        protected request;
        constructor(protected $http,protected $q, protected name,protected config,protected langConfig){
            super($http,name,config);
        }

        /**
         * @description Modifica los datos obtenidos de servidor
         * @param data      Datos a modificar
         * @returns {boolean}
         * @private
         */
        protected _parseResult(method,params,data){
            if(typeof data == "string") {
                try {
                    eval( data );
                }catch(e){
                    return false;
                }
            }
            return true;
        }
        /**
         * @description Resuelve el idioma final en base al dado. En caso de que haya idiomas similares se puede configurar una alternativa.
         * Por ejemplo, se puede establecer que para fr-CA se resuelva el idioma como fr.
         * @param lang
         * @returns {any}
         * @private
         */
        protected _resolveLang(lang){
            let aletrnative = this.langConfig.resolveAs[lang.toLowerCase()];
            return aletrnative || lang;
        }
        /**
         * Obtiene los datos del idioma. En caso de algún fallo, provee de los datos locales
         * @param lang
         * @returns {IPromise<T>}
         */
        public getLocale(lang){
            let langToGet = this._resolveLang( lang );
            this.promise = this._makeGet("getLocale",this.baseUrl.replace( "{{lang}}", langToGet ),{});
            return this.promise;
        }
    }
    /**
     * @class
     * @extend
     * Gestiona los ficheros de idiomas para la aplicación
     */
    class BowerGuiLocaleSrv extends BaseLocalizerSrv{
        public baseUrl = "i18n/app/app_{{lang}}.js";
        constructor(protected $http,protected $q,protected config,protected langConfig){
            super($http,$q,"bowerGuiLocale", config,langConfig);
        }
        protected _parseResult(data){
            if(typeof data == "string") {
                try {
                    eval( data );
                }catch(e){
                    return false;
                }
            }
            return lang["es"];
        }
    }
    /**
     * Servicio que expone los métodos para gestionar la internacionalización de los componentes de la aplicación
     */
    class LocalizerSrv{
        public static $inject = [
            "$q",
            "$translate"
        ];
        protected current:String;//lenguaje actual
        constructor (protected $q, protected $translate){

        }

        /**
         * @description Devuelve el lenguaje actual
         * @returns {String}
         */
        public getCurrent (){
            return this.current;
        }
        /**
         * Resuelve el idioma comprobando si existe una alternativa al lenguaje indicad
         * @param lang
         * @returns {*|any}
         * @see langConfig
         * @private
         */
        protected _resolveLang(lang){
            let aletrnative = langConfig.resolveAs[lang.toLowerCase()];
            return aletrnative || lang;
        }

        /**
         * Lanza el proceso de carga de ficheros de idioma para los componentes.
         * Si el lenguaje indicado no está disponible para alguno de los componentes, se carga el idioma por defecto y se resuelve
         * la promesa como fallida
         * @param lang
         * @returns {IPromise<T>}
         */
        public use(lang){
            let deferred = this.$q.defer(),
                that = this;
            lang = this._resolveLang(lang);
            this.$translate.use(lang).then(function(results){
                that.current = lang;
                deferred.resolve({lang:lang});
            },function(results){
                //si la carga de algún idioma falla se cargan los datos por defecto
                deferred.reject(results);
                //that.$translate.use(langConfig.default).then(function (result) {
                //    deferred.reject({lang:langConfig.default,message:result});
                //});
            });
            return deferred.promise;
        }
    }
    let localizerModule = angular.module("Localizer",[]);
    localizerModule.service( 'localizerSrv',LocalizerSrv);
    /**
     * Gestiona la carga de ficheros de idioma para los diferentes módulos que lo requieran
     */
    localizerModule.provider( 'localizerPrv', function () {
        this.$get = function ( $http, $q ) {
            return function (options) {
                let deferred = $q.defer(),
                    promises = [],//inicialización de los servicios
                    audiovisualLocaleSrv = new BowerGuiLocaleSrv($http,$q,null,langConfig);
                //carga de datos
                promises.push(audiovisualLocaleSrv.getLocale(options.key));
                // do something with $http, $q and key to load localization files
                $q.all(promises).then(function(results){
                    deferred.resolve(results);
                },function(results){
                    deferred.reject(results);
                });
                return deferred.promise;
            };
        };
    } );
}
