var Global = require('Global')

var BaseData = cc.Class({
    extends : cc.Class,

    properties : {

    },

    ctor () {

    },

    setAccount (info) {
        if (! info.account || ! info.password) {
            Com.info('当前没有账号密码需要保存')
            return
        }
        this.setLocalData('account', info)
    },

    setLocalData (key, data) {
        data = Global.JSONToStr(data)
        cc.sys.localStorage.setItem(key, data)
    },

    getLocalData (key) {
        let d = cc.sys.localStorage.getItem(key) || Global.StrToJSON({})
        return Global.StrToJSON(d)
    },
})