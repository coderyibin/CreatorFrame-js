var Global = require('../../Frame/common/Global')
var Common = require('../common/Common')

module.exports = class BaseData {
    _projectName = 'EndVoidFly'

    constructor () {
        this._global = Global
    }

    /**
     * 获取数据
     * 数据模块所有的请求都来调用这个函数
     * 也可以直接调用原本函数，这里只是做了数据的统一克隆
     * @param 函数名称
     * @param 额外的附带参数
     */
    Get (funcName, ...values) {
        if (this[funcName]) {
            let data = this[funcName](...values)
            if (data instanceof Object) {//如果是对象，克隆出来
                return Global.CloneJson(data)
            } else if (data instanceof Array) {//如果是数组，克隆出来
                return Global.CloneArray(data)
            } else {//其他的类型，直接返回值
                return data
            }
        } else {
            Com.error('当前数据类没有成员函数-> '+ funcName + ' 请注册')
        }
    }

    /**
     * 设置模块数据
     * 数据模块所有的请求都来调用这个函数
     * 也可以直接调用原本函数
     * @param 函数名称
     * @param 额外的附带参数 
     * */
    Set (funcName, ...values) {
        if (this[funcName]) {
            return this[funcName](...value)
        } else {
            Com.error('当前数据类没有成员函数-> '+ funcName + ' 请注册')
        }
    }

    setAccount (info) {
        if (! info.account || ! info.password) {
            Com.info('当前没有账号密码需要保存')
            return
        }
        this.setLocalData('account', info)
    }

    /**
     * 保存普通数据
     */
    SetLocalNormal (key, data) {
        if (! Common.LocalKey[key]) Common.LocalKey[key] = key
        cc.sys.localStorage.setItem(key, data)
    }

    GetLocalNormal (key) {
        let data = cc.sys.localStorage.getItem(key)
        return data
    }

    /**
     * 保存游戏数据-一般保存json格式对象
     */
    setLocalData (key, data) {
        data = Global.JSONToStr(data)
        cc.sys.localStorage.setItem(key, data)
    }

    getLocalData (key) {
        let d = cc.sys.localStorage.getItem(key)
        if (d) return this._clone(this._strToJson(d))
        return null
    }

    /**
     * 克隆数据
     */
    _clone (data) {
        return Global.CloneJSON(data)
    }

    /**
     * 克隆数组
     */
    _cloneArray (array) {
        return Global.CloneArray(array)
    }

    /**
     * 数据转换-json转字符串
     */
    _jsonToStr (json) {
        return this._global.JSONToStr(json)
    }

    /**
     * 数据转换-字符串转json对象
     */
    _strToJson (str) {
        return this._global.StrToJSON(str)
    }

    /**
     * 清理本地数据Key
     */
    ClearLocalKey () {
        for (let i in Common.LocalKey) {
            cc.sys.localStorage.removeItem(Common.LocalKey[i])
        }
    }
}