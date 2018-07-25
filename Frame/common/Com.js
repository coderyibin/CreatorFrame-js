var Common = require('Common')

var Com = {
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
}

window['Com'] = Com