var BaseComponent = require("BaseComponent")

var BaseLayer = cc.Class({
    extends : BaseComponent,

    properties : {
        _arrEmit : null,
        _isShield : null,
        _gameNode : null,
    },

    onLoad () {
        this._super()
        this._init()
        this.OnInit()
        //是否添加屏蔽层
        if (this._isShield) this._addShield()

        this._initValue()
    },

    _init () {
        this._isShield = true
        this._arrEmit = []
        this._gameNode = this.getCanvas()
    },

    registerEvent (layerName) {
        let self = this;
        Com.info(layerName, 'cur layer event:', self._arrEmit);
        for (let i = 0; i < self._arrEmit.length; i ++) {
            let sName = self._arrEmit[i];
            if (self[sName]) {
                self._emitter.on(self._arrEmit[i], self[sName].bind(this), self);
            } else {
                Com.warn("未注册事件", sName);
            }
        }
    },

    OnInit () {
    },

    start () {
        this._initUi()
    },

    _initValue () {

    },

    _initUi () {

    },

    _addShield () {
        let size = cc.director.getWinSize();
        let node = new cc.Node("shield");
        node.addComponent(cc.Button);
        node.width = size.width;
        node.height = size.height;
        this.node.addChild(node);
        node.zIndex = -1;
    },

    showLayer (layerName) {
        let node = RES.Get(layerName)
        this._gameNode.addChild(node)
    },

    remove () {
        this.node.removeFromParent()
    },
})