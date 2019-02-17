var UI = require('./UIMgr')

cc.Class({
    extends : UI,

    properties : {

    },

    onLoad () {
        this._super()
        this._unitValue()
    },

    start () {
        this._unitUi()
    },

    _unitValue () {
        this._initValue()
    },

    _unitUi () {
        this._initUi()
    },
})
