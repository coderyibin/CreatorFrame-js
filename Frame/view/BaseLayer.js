var BaseComponent = require("BaseComponent")

var BaseLayer = cc.Class({
    extends : BaseComponent,

    properties : {

    },

    onLoad () {
        this._super()

        this._initValue()
    },

    start () {
        this._initUi()
    },

    _initValue () {

    },

    _initUi () {

    },

    remove () {
        this.node.destroy()
    },
})