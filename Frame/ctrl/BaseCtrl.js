var CusEvent = require('../ctrl/CusEvent')
var Common = require('../common/Common')
var Global = require('../common/Global')

class BaseCtrl {

    _event = CusEvent.getInstance()
    _common = Common
    _global = Global
    _name = ''

    constructor (script) {
        this._name = script
        Com.info(this._name + ' constructor')
    }

    /**
     * 事件分发，兼容旧项目
     * @param {*} name 
     * @param {*} data 
     */
    onEmit (name, data) {
        this._event.emit(name, data)
    } onEvent (name, data) {this.onEmit(name, data)}

    /**
     * 新版接口
     * @param {*} name 
     * @param {*} data 
     */
    Emit (name, data) {
        this._event.emit(name, data)
    }
}

module.exports = BaseCtrl