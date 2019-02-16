var Sys = require('../common/Sys')

class GoogleCtrl {

    constructor () {
        
    }

    /**
     * 支付
     * @param info 商品信息
     */
    Pay (info) {
        Com.info('google pay!')
        if (Sys.Platform.ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod(
                'com/petGame/Utils/GooglePay',   
                'Pay', 
                '(Ljava/lang/String;Ljava/lang/String;)V', 
                info.GoogleKey, info.ID
                );
        }
    }

    static _fctor
    static getInstance () {
        if (! this._fctor) {
            this._fctor = new GoogleCtrl()
        } return this._fctor
    }
}

module.exports = GoogleCtrl
