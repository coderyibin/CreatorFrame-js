var UI = require('./UIMgr')

cc.Class({
    extends : UI,

    properties : {

    },

    onLoad () {
        this._super()
        this._sceneValue()
    },

    start () {
        this._sceneUi()
    },

    _sceneValue () {
        this._initValue()
    },

    _sceneUi () {
        this._initUi()
    },

    _runScene (scene) {
        Com.info('跳转的场景: ', scene)
        cc.director.loadScene(scene)
    },
})
