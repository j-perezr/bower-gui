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
        $stateProvider.state('audiovisual', {
            url: '/',
            abstract: true,
            templateUrl: 'app/components/master/master.tpl.html',
            controller: "MasterCtrl"
        });
    });
}
