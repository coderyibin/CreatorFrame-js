var CusEvent = require('CusEvent')
var Common = require('Common')
var Global = require('Global')

var BaseCtrl = cc.Class({
    extends : cc.Class,

    properties : {
        _event : null,
        _common : null,
        _global : null,
    },

    ctor () {
        this._event = CusEvent.getInstance()
        this._common = Common
        this._global = Global
    },

    //事件分发
    onEmit (name, data) {
        this._event.emit(name, data)
    },onEvent (name, data) {this.onEmit(name, data)},
})