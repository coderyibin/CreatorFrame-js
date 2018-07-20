var BaseComponent = require("BaseComponent")
var Common = require('Common')
var Sys = require('Sys')
var CusTouch = require('CusTouch')

var BaseaScene = cc.Class({
    extends : BaseComponent,

    properties : {
        _physics : null,
        _touchEnable : null,
        _startPos : null,
        _arrEmit : null,
        _netloading : null,
        _gameNode : null,
        _collision : null,
        _joinLayer : null,
    },

    onLoad () {
        this._super()
        this._collision = cc.director.getCollisionManager();
        this._collision.enabledDebugDraw = Common.IsShowCollision;
        this._physics = false
        this._touchEnable = false
        this._collision.enabled = false//未开启碰撞
        this._joinLayer = {}
        this._arrEmit = ['onMsg', 'runScene', 'onNetLoading', 'onRemoveNetLoading', 'onClearLayer']
        this._gameNode = this.getCanvas()
        this.OnInit()

        this._openPhysics()
        this._openTouch()
    },

    start () {
        this.OnInitValue()
        this.OnInitUi()
    },

    //注册自定义事件
    registerEvent () {
        let self = this;
        Com.info('cur scene event:', self._arrEmit);
        for (let i = 0; i < self._arrEmit.length; i ++) {
            let sName = self._arrEmit[i];
            if (self[sName]) {
                self._emitter.on(self._arrEmit[i], self[sName].bind(this), self);
            } else {
                Com.warn("未注册事件", sName);
            }
        }
    },

    onClearLayer (layerName) {
        if (this._hasLayer[layerName])
            delete this._hasLayer[layerName]
    },

    onMsg (data) {
        let self = this
        let msg = RES.Get(Common.SceneName.LayerMsg)
        if (msg) {
            self._canvas.addChild(msg)
            msg.getComponent(msg.name).set(data)
        } else {
            RES.loadRes("Prefab/Layer_Msg", function (res) {
                self._canvas.addChild(res)
            })
        }
    },

    OnInitValue () { },
    
    OnInitUi () { },

    OnInit () { },

    _openPhysics () {
        if (this._physics) {
            cc.director.getPhysicsManager().enabled = true
        }
    },

    _closePhysics () {
        cc.director.getPhysicsManager().enabled = false        
    },

    /**
     * 开启触摸事件
     */
    _openTouch () {
        if (! this._touchEnable) return 
        new TouchMgr().RegisterTouchNromal(this)
        // Com.info('开启触摸事件')
        // let start = null
        // this.node.on(Sys.Touch_Begin, function (e) {
        //     let pos = e.touch.getLocation()
        //     this._startPos = start = pos
        //     if (this["OnTouchBegin"]) this["OnTouchBegin"](pos)
        // }, this)
        // this.node.on(Sys.Touch_Cancel, function (e) {
        //     if (this["OnTouchCancel"]) this["OnTouchCancel"](e.touch.getLocation())
        // }, this)
        // this.node.on(Sys.Touch_End, function (e) {
        //     let pos = e.touch.getLocation()
        //     if (this["OnTouchEnd"]) this["OnTouchEnd"](start, pos)
        // }, this)
        // this.node.on(Sys.Touch_Move, function (e) {
        //     let pos = e.touch.getLocation()
        //     if (this["OnTouchMove"]) this["OnTouchMove"](start, pos)
        // }, this)
    },

    /**
     * 摇杆事件
     */
    RockerTouch (node) {
        new TouchMgr().RockerTouch(node)
    },

    _closeTouch () {
        this.node.off(cc.Node.EventType.TOUCH_START, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_END, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, function (e) {}, this)
    },

    /**
     * 显示一个layer
     * @param {*} layerName layer名称
     * @param {*} parent layer要加入的父节点，为空则加入canvas中
     */
    ShowLayer (name, parent) {
        if (this._joinLayer[name]) {
            return this._joinLayer[name]
        }
        this._joinLayer[name] = this._super(name, parent)
        return this._joinLayer[name]
    },

    /**
     * 删除一个ShowLayer 方式创建的Layer预制资源
     */
    DelLayer (name) {
        if (! this._joinLayer[name]) {
            Com.warn('不存在layer：', name)
            return
        }
        this._joinLayer[name].removeFromParent()
    },

    runScene (data) {
        this._runScene(data.Scene || data.scene)
    },

    _removeEvent () {
        let events = this._arrEmit
        for (let i in events) {
            this._emitter.un(events[i])
        }
    },

    onNetLoading () {
        let self = this
        this.onRemoveNetLoading()
        if (! self._canvas) return 
        let name = Common.SceneName.LayerNet
        let net = RES.Get(name)
        if (net) {
            net.name = name
            self._canvas.addChild(net)
            this._netloading = net
        } else {
            Com.warn('没有找到网络数据加载loading界面-->', name)
        }
    },

    onRemoveNetLoading () {
        if (this._netloading) {
            this.removeNodeFromParent(this._netloading)
            this._netloading = null
        }
    },

    /**
     * 场景跳转
     * @param 场景名称 name 
     */
    _runScene (name) {
        console.log("跳转场景-->", name)
        cc.director.loadScene(name)
    },
    //节点被销毁之后调用
    onDestroy () {
        this._removeEvent()
    },
    //节点被销毁之前调用
    _onPreDestroy () {

    }
})
