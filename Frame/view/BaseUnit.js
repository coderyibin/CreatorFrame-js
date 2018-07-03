var BaseComponent = require('BaseComponent')

var BaseUnit = cc.Class({
    extends : BaseComponent,

    statics : {
    },

    properties : {
        _data : null,
        _index : null,
    },

    onLoad () {
        this._super()

        this._initValue()
    },

    start () {
        this._initUI()
    },

    _initValue () {

    },

    _initUI () {

    },

    Set (index, data) {
        this._data = data
        this._index = index
    }
})