///<reference path="../../_all.d.ts"/>
module bowergui.master{
    import BaseCtrl = common.controllers.BaseCtrl;
    export class MasterCtrl extends BaseCtrl{
        public static $inject = BaseCtrl.EXTEND_DEPENDENCIES_LIST(BaseCtrl.$inject,[

        ]);
        constructor(...dependencies){
            super(dependencies);
        }
        protected _resolveDependenciesList(){
            return MasterCtrl.$inject;
        }
    }
    bowergui.bowerguiModule.controller("MasterCtrl",MasterCtrl);
}
