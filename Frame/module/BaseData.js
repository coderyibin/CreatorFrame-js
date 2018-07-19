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

    /**
     * 保存普通数据
     */
    SetLocalNormal (key, data) {
        cc.sys.localStorage.setItem(key, data)
    },

    GetLocalNormal (key) {
        let data = cc.sys.localStorage.getItem(key)
        return data
    },

    /**
     * 保存游戏数据-一般保存json格式对象
     */
    setLocalData (key, data) {
        data = Global.JSONToStr(data)
        cc.sys.localStorage.setItem(key, data)
    },

    getLocalData (key) {
        let d = cc.sys.localStorage.getItem(key) || Global.StrToJSON({})
        return Global.StrToJSON(d)
    },
})