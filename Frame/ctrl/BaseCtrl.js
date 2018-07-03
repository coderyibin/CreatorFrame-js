var CusEvent = require('CusEvent')
var Common = require('Common')

var BaseCtrl = cc.Class({
    extends : cc.Class,

    properties : {
        _event : null,
        _common : null,
    },

    ctor () {
        this._event = CusEvent.getInstance()
        this._common = Common
    },

    //事件分发
    onEmit (name, data) {
        this._event.emit(name, data)
    },onEvent (name, data) {this.onEmit(name, data)},
})