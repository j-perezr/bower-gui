///<reference path="../../../../_all.d.ts"/>
module common.utils.toast{
    import BaseCtrl = common.controllers.BaseCtrl;
    export class ToastCtrl extends BaseCtrl{
        public static $inject = BaseCtrl.EXTEND_DEPENDENCIES_LIST(BaseCtrl.$inject,[
            "$mdToast",
            "params"
        ]);
        protected params:IToastPrvOpenParams;
        constructor(...dependencies){
            super(dependencies);
            if(this.params.message){
                this.params.messages = [this.params.message];
            }
        }
        protected _resolveDependenciesList(){
            return ToastCtrl.$inject;
        }
    }
    let module = angular.module("Toast",[
        "ngMaterial"
    ]);
    module.controller("ToastCtrl",ToastCtrl);
}