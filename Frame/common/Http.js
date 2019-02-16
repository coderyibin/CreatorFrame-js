var Global = require('Global')
var CusEvent = require('../ctrl/CusEvent')

 var Http = cc.Class({
    extends : cc.Class,

    properties : {
        _http : null,
        _CallBack : null,
        _url : null,
        _event : null,
    },

    ctor () {
        this._http = cc.loader.getXMLHttpRequest();
        // this._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    },

    _getUrl () {
        if (! this._url) {
            this._url = RES.getConfig().HTTPIP + ':' + RES.getConfig().HTTPPOST + '/'
        } return this._url
    },

    Get (url, param, cb) {
        url = this._getUrl() + url + this._paramToStr(param)
        Com.info('http->', url)
        this._http.open("GET", url, true)
        this._http.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        this._CallBack = cb;
        this._http.onreadystatechange = this._result.bind(this)
        this._http.send()
    },

    _paramToStr (param) {
        let str = '?'
        for (let i in param) {
            str += i + '=' + param[i]
        }
        return str
    },

    Post (url, param, cb) {
        this._http.open("POST", url, true)
        this._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        this._CallBack = cb;
        this._http.onreadystatechange = this._result()
        param = JSON.stringify(param)
        this._http.send(param)
        Com.info('http->', url, param)
    },

    _result () {
        if (this._http.readyState == 4 && this._http.status != 500) {
            let data = Global.StrToJSON(this._http.responseText)
            Com.info('httpCall->', data)
            if (this._CallBack) {
                if (data.data) this._CallBack(data.data)
                else Com.warn('返回值缺少data字段')
            }
        } else {
            Com.error('请求失败')
        }
    },
})

window['Http'] = new Http()

/**
 * 新版接口
 * @example 使用 var Http = require('Http')
 * @example      new Http().Get(url, cb)//url链接 回调函数
 * @example      new Http().Post(url, param, cb)//url链接 param参数(json对象) 回调函数
 */
class CusHttp {
    constructor () {
        this._http
        this._callback
        this._event = CusEvent.getInstance()
    }

    /**
     * Get 请求
     * @param {*} Url 
     * @param {*} cb 
     */
    Get (Url, cb) {
        Com.info(Url)
        let http = cc.loader.getXMLHttpRequest();
        http.open("GET", Url, true)
        http.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        this._callback = cb;
        http.onreadystatechange = this._result.bind(this)
        http.timeout = 30000
        http.send()
        this._http = http
    }

    Post (Url, data, cb) {
        Com.info(Url)
        data = JSON.stringify(data)
        let http = cc.loader.getXMLHttpRequest();
        http.open("POST", Url, true)
        http.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        this._callback = cb;
        http.onreadystatechange = this._result.bind(this)
        http.timeout = 30000//超时10秒
        http.send(data)
        this._http = http
    }

    _result () {
        if (this._http.readyState == 4 && this._http.status != 500) {
            let data = Global.StrToJSON(this._http.responseText).data
            Com.info('httpCall->', data)
            if (this._callback) {
                if (! data) return
                //如果服务端有回执text字段，则显示飘字
                if (data['text']) {
                    this._event.emit('onMsgText', data.text)
                    return
                }
                if (data.code != 200) {
                    this._event.emit('onMsg', {layer : 'Msg_Window', content : data.msg})
                    return
                }
                if (this._callback && this._callback instanceof Function) {
                    Com.info('callBack->', data.data)
                    this._callback(data.data)
                }
                // if (data) this._callback(data)
                // else Com.warn('返回值缺少data字段')
            }
        } else {
            Com.error('请求失败')
        }
    }
}

module.exports = CusHttp