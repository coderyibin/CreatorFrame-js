var BaseComponent = require("../../Frame/view/BaseComponent")

var BaseLayer = cc.Class({
    extends : BaseComponent,

    properties : {
        _arrEmit : null,
        _isShield : null,
        _gameNode : null,
        _data : null,

        /**如果有tiledmap 地图组件 */
        _tiledFileName : '',//地图文件名
        _tiledMapComp : null,//地图组件
        _tiledMapSize : null,//地图大小总图块个数
        _tiledSize : null,//地图大小 背景地图
        _tiledMapNodeSize : null,//地图大小，总像素
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

    _initValue () { },

    _initUi () { },

    _addShield () {
        let size = cc.director.getWinSize();
        let node = new cc.Node("shield");
        node.addComponent(cc.Button);
        node.width = size.width;
        node.height = size.height;
        this.node.addChild(node);
        node.zIndex = -1;
    },

    /**
     * 设置瓦片地图组件
     * @param name 瓦片地图名称
     * @param node 地图所在的节点，默认当前节点
     */
    SetTiledMap (name, node=this.node) {
        let map = node.getComponent(cc.TiledMap)
        if (! map) {
            map = node.addComponent(cc.TiledMap)
        }
        this._tiledFileName = name
        map.tmxAsset = RES.Get(name)
        //瓦片地图组件
        this._tiledMapComp = map
        //地图大小
        this._tiledMapSize = map.getMapSize()
        //获取地图背景中 tile 元素的大小。
        this._tiledSize = map.getTileSize()
        //地图总大小
        this._tiledMapNodeSize = node.getContentSize()
        //地图加载结束后的通知
        this.Emit('onTiledMapOnEnter')
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
        this.onData()
    },

    onData () { },

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
        this._removeEvent()
        this._super(clean)
    },

    _removeEvent () {
        let events = this._arrEmit
        Com.info('移除监听器--', events)
        for (let i in events) {
            this._emitter.un(events[i])
        }
    },
})
