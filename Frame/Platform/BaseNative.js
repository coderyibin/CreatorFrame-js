// var BaseCtrl = require('../../Frame/ctrl/BaseCtrl')
var CusEvent = require('../../Frame/ctrl/CusEvent')
var Sys = require('../../Frame/common/Sys')

class Native {

    constructor () {
        let platform = Sys.Platform
        if (platform.OS == platform.ANDROID || platform.OS == platform.IOS) {
            Com.info('原生监听器')
            this._defineNative()
        }
    }

    /**
     * 定义原生监听器
     */
    _defineNative () {
        this._event = CusEvent.getInstance()
        //游戏中调用原生的监听器名称
        this._jsArray = [ ]
        //原生端调用js端的监听器名称
        this._nativeArray = [ ]
    }

    /**
     * 开始注册监听器
     */
    StartRegisterListener () {
        for (let i in this._jsArray) {
            this._event.on(this._jsArray[i], this[this._jsArray[i]].bind(this), this)
        }
        for (let j in this._nativeArray) {
            this._event.on(this._jsArray[j], this[this._jsArray[j]].bind(this), this)
        }
    }
}

module.exports = Native