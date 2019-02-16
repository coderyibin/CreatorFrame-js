var Sys = require('../common/Sys')
var Common = require('../common/Common')

class PaypalCtrl {

    constructor () {

    }

    /**
     * 消费
     * @param shopInfo 商品信息
     */
    Paypal (shopInfo) {
        //ios端
        let usd = shopInfo.USD
        usd = usd.toFixed(2)
        let explain = shopInfo[Common.DefaultLanguage + '_Explain']
        let id = shopInfo.ID + ''
        if (Sys.Platform.IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('PayPalCtrl',  'Pay:Content:shop:', usd, explain, id);
        } else if (Sys.Platform.ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod(
                'com/petGame/VitalityMainland/AppActivity', 
                'Paypal', 
                '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',
                explain, usd, id )
        } else {

        }
        return
    }

    static _fctor
    static getInstance () {
        if (! this._fctor) {
            this._fctor = new PaypalCtrl()
        } return this._fctor
    }
}

module.exports = PaypalCtrl