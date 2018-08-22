var BaseComponent = require("BaseComponent")
var CusEvent = require('CusEvent')

var BaseLayer = cc.Class({
    extends : BaseComponent,

    properties : {
        _arrEmit : null,
        _isShield : null,
        _gameNode : null,
        _event : null,
        _data : null,

        /**如果有tiledmap 地图组件 */
        _tiledMapComp : null,//地图组件
        _tiledMapSize : null,//地图大小 像素
        _tiledSize : null,//地图大小 背景地图
        /**如果有tiledmap 地图组件 */
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
        this._event = CusEvent.getInstance()
    },

    registerEvent () {
        let self = this;
        Com.info(this._script, 'cur layer event:', self._arrEmit);
        for (let i = 0; i < self._arrEmit.length; i ++) {
            let sName = self._arrEmit[i];
            if (self[sName]) {
                self._emitter.on(self._arrEmit[i], self[sName].bind(this), self);
            } else {
                Com.warn("未注册事件,请在脚本中实现函数 " + sName + '函数');
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

    Emit (emitName, emitData) {
        this._event.emit(emitName, emitData)
    },

    /**
     * 保留接口
     * @param {*} data 
     */
    Set (data) {
        this._data = data
        // this._initTiledMap()        
    },

    // /**
    //  * 初始化地图的数据
    //  */
    // _initTiledMap () {
    //     if (this._data.hasOwnProperty('tiledMap')) {
    //         let comp = this.node.addComponent(cc.TiledMap)
    //         comp.tmxAsset = RES.Get(data.tiledMap)
    //         this._tiledMapComp = comp
    //         this._tiledMapSize = comp.getMapSize()
    //         this._tiledSize = comp.getTileSize()
    //     }
    // },
    
    Remove (clean=false) {
        this.Emit('onClearLayer', this._script)
        this._super(clean)
    },
})
