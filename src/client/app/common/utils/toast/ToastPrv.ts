///<reference path="../../../../_all.d.ts"/>
module common.utils.toast{
    export interface IToastPrvOpenParams{
        hideDelay?:number;
        title?:string;
        message?:string;
        messages?:string[];
        position?:{top?:boolean;right?:boolean;bottom?:boolean;left?:boolean;};
    }
    export class ToastPrv{
        public static $inject = [
            "$mdToast"
        ];
        constructor (protected $mdToast:angular.material.IToastService){

        }

        /**
         *
         * @param params
         * @returns {angular.IPromise<any>}
         */
        open(params:IToastPrvOpenParams){
            let position = params.position || {},
                strPosition = "";
            if(position.top){
                strPosition = "top";
            }else{
                strPosition = "bottom";
            }
            if(position.right){
                strPosition+=" right";
            }else{
                strPosition+=" left";
            }
            position = strPosition;
            let cparams = {
                templateUrl:"./app/common/utils/toast/toast.tpl.html",
                controller:"ToastCtrl",
                controllerAs:"toastCtrl",
                bindToController:true,
                hideDelay:params.hideDelay || 10000,
                position:position,
                locals:{
                    params:params
                }
            };
            return this.$mdToast.show(cparams);
        }
    }
    angular.module("Toast").service("ToastPrv",ToastPrv);
}
