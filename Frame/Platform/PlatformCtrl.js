var Sys = require('../common/Sys')

class PlatformCtrl {

    constructor () {
        
    }

    /**
     * 原生的get 请求
     * @param url url 请求链接
     */
    NativeGet (url) {
        Com.info('Native Get')
        if (! Sys.Platform.ISNATIVE) return
        if (Sys.Platform.OS == Sys.Platform.ANDROID) {
            this.CallNative(
                'com/petGame/Utils/HttpMgr', 
                'JsGet', 
                '(Ljava/lang/String;)V',
                url )
        } else if (Sys.Platform.OS == Sys.Platform.IOS) {

        }
    }
    /**
     * 原生的 post 请求
     * @param url url 请求链接
     * @param data data要發送給服務器的數據 字符串-到原生端進行解析
     */
    NativePost (url, data) {
        if (! Sys.Platform.ISNATIVE) return
        Com.info('Native Post')
        if (Sys.Platform.OS == Sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod(
                'com/petGame/Utils/HttpMgr', 
                'JsPost', 
                '(Ljava/lang/String;Ljava/lang/String;)V',
                url, data )
        } else if (Sys.Platform.OS == Sys.Platform.IOS) {

        }
    }

    /**
     * 获取原生平台的一些配置
     * @param packName 包名/类名
     * @param funcName 函数名
     * @param sign 签名：android才有，ios传null
     * @param values 参数-不定参数
     */
    GetNativeCfg (packName, funcName, sign, ...values) {
        if (! Sys.Platform.ISNATIVE) return
        Com.info('is open paypal')
        let value
        if (Sys.Platform.OS == Sys.Platform.ANDROID) {
            value = jsb.reflection.callStaticMethod(packName, funcName, sign, ...values)
            // value = this.CallNative(packName, funcName, sign, ...values)
        } else if (Sys.Platform.OS == Sys.Platform.IOS) {
            value = jsb.reflection.callStaticMethod(packName, funcName, ...values)
            // value = this.CallNative(packName, funcName, ...values)
        }
        Com.info('get value: ', value)
        return value
    }

    /**
     * 调用原生接口
     */
    CallNative (...values) {
        if (! Sys.Platform.ISNATIVE) return
        let value = null
        if (Sys.Platform.OS == Sys.Platform.IOS) {
            value = jsb.reflection.callStaticMethod(...values)
        } else if (Sys.Platform.OS == Sys.Platform.ANDROID) {
            value = jsb.reflection.callStaticMethod(...values)
        }
        Com.info('Call Native -:', value)
        return value
    }
}

module.exports = PlatformCtrl
