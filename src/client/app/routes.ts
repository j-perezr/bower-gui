///<reference path="../_all.d.ts"/>
/**
 * @module Routes
 * @description Directrices de navegación
 */
module bowergui {
    "use strict";
    bowergui.bowerguiModule.config( function ( $stateProvider, $urlRouterProvider ) {
        /**
         * @property audiovisual
         * @description Marco común
         */
        $stateProvider.state('bowergui', {
            url: '/',
            templateUrl: './app/master/master.tpl.html',
            controller: "MasterCtrl",
            controllerAs:"masterCtrl",
            bindToController:true
        });
    });
}
