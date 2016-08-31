/// <reference path="../../../typings/index.d.ts" />
import { BaseSrv } from "../common/services/BaseSrv";
import { IBaseSrvOptions } from "../common/services/BaseSrv";
/**
 * @class BowerSrv
 * @description Service to manage Bower data
 * @extends BaseSrv
 */
export class BowerSrv extends BaseSrv{
    public static URL = BowerSrv.BASE_URL;
    public static NAME = "bower";
    protected name = "BowerSrv";
    constructor(options?){
        let srvOptions:IBaseSrvOptions = {
            url:BowerSrv.URL,
            name:BowerSrv.NAME,
            socketOptions:options
        };
        super(srvOptions);
    }
}

