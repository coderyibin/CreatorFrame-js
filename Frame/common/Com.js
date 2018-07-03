var Common = require('Common')

var Com = cc.Class({
    extends : cc.Class,

    info (...values) {
        if (Common.IsDebug) {
            console.log('日志->', ...values)
        }
    },

    warn (...values) {
        if (Common.IsDebug) {
            console.warn('警告->', ...values)
        }
    },

    error (...values) {
        if (Common.IsDebug) {
            console.error('错误->', ...values)
        }
    }
    
})

window['Com'] = new Com()