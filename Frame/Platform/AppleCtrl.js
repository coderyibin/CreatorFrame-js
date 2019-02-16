var Sys = require('../common/Sys')

class AppleCtrl {

    constructor () {
        
    }

    /**
     * 支付
     * @param info 商品信息
     */
    Pay (info) {
        Com.info('apple pay!')
        if (Sys.Platform.IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod(
                'AppleCtrl',  
                'Pay:shopID:', 
                info.GoogleKey,
                info.ID
                );
        }
    }

    static _fctor
    static getInstance () {
        if (! this._fctor) {
            this._fctor = new AppleCtrl()
        } return this._fctor
    }
}

module.exports = AppleCtrl
