var Global = require('Global')

 var Http = cc.Class({
    extends : cc.Class,

    properties : {
        _http : null,
        _CallBack : null,
        _url : null,
    },

    ctor () {
        this._http = new XMLHttpRequest();
        this._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
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
        Com.warn('数据解析有问题，暂停使用')
        // this._http.open("POST", url)
        // this._CallBack = cb;
        // this._http.onreadystatechange = this._result()
        // this._http.send(param)
        // Com.info('http->', url, param)
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