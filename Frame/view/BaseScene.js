var BaseComponent = require("./BaseComponent")
var Common = require('../common/Common')
var Sys = require('../common/Sys')
var MsgText = require('./MsgText')
var Action = require('../ctrl/CusAction')
var CusTouch = require('../ctrl/CusTouch')
var TouchMgr = require('../../Frame/view/TouchMgr')
var GameCtrl = require('../../Frame/ctrl/GameCtrl')

var BaseaScene = cc.Class({
    extends : BaseComponent,

    properties : {
        _physics : null,
        _physicsDraw : null,
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
        this._physicsDraw = false//绘制物理引擎碰撞
        this._touchEnable = false
        this._collision.enabled = false//未开启碰撞
        this._joinLayer = {}
        this._arrEmit = ['onMsg', 'onReStartGame', 'onGamePause', 'onGameResume', 
        'runScene', 'onNetLoading', 'onRemoveNetLoading', 'onClearLayer', 'onGameExit',
        'onMsgText']
        this._gameNode = this.getCanvas() 
        this.OnInit()
        this._log()

        this._openPhysics()
        this._openTouch()
        //初始化游戏控制器
        GameCtrl.getInstance()
    },

    start () {
        this.OnInitValue()
        this.OnInitUi()
    },

    _log () {
        if (! Common.IsDebug) return
        if (this._collision.enabled) Com.info('开启碰撞检测')
    },

    /**
     * 关闭碰撞
     */
    closeCollision () {
        this._collision.enabled = false
    },

    /**
     * 监听系统事件
     */
    _listenerSysEvent () {
        let self = this
        cc.game.on(Sys.Game_Hide, function () {
            self.onGamePause()

        })
        cc.game.on(Sys.Game_Show, function () {
            self.onGameResume()

        })
    },

    /**
     * 游戏暂停
     */
    onGamePause () {
        // cc.game.pause()//这个是暂停游戏的主循环,包括逻辑渲染和事件
        Com.info('游戏暂停')
        cc.director.pause()
    },

    /**
     * 游戏继续
     */
    onGameResume () {
        // cc.game.resume()
        Com.info('游戏继续')
        cc.director.resume()
    },

    /**
     * 退出游戏
     */
    onGameExit () {
        Com.info('退出游戏')
        cc.game.end()
    },

    /**
     * 重启游戏
     */
    onReStartGame () {
        GameCtrl.getInstance().Clear()
        cc.game.restart()
    },

    onClearLayer (layerName) {
        // if (this._hasLayer[layerName])
        //     delete this._hasLayer[layerName]
        this.DelLayer(layerName)
    },

    /**
     * 飘字提示
     */
    onMsgText (text) {
        let self = this
        let up = cc.moveBy(1, cc.v2(0, 150))
        let node = MsgText.Create(this.GetCanvas(), text)
        new Action().Sequence(node, up, cc.callFunc(function () {
            node.removeFromParent()
            node.destroy()
        }))
    },

    /**
     * 兼容旧项目
     * data数据格式{layer:弹窗的预置资源名称, xxxx:xxxx, ...}
     * @param {*} data 数据
     */
    onMsg (data) {
        let self = this

        if (data['layer'] && RES.Get(data['layer'])) {
            let node = this.ShowLayer(data['layer'], self.GetCanvas())
            delete data['layer']
            node.getComponent(node.name).set(data)
        } else {
            // let msg = RES.Get(Common.SceneName.LayerMsg)
            // if (msg) {
            //     self._canvas.addChild(msg)
            //     msg.getComponent(msg.name).set(data)
            // } else {
            //     RES.loadRes("prefab/Msg_Window", function (res) {
            //         self._canvas.addChild(res)
            //     })
            // }
            RES.loadRes("prefab/Msg_Window", function (res) {
                let node = self.GetNode(res)
                self.GetCanvas().addChild(node)
                self.GetNodeComp(node, node.name).Set(data)
            })
        }
    },

    /**
     * 显示弹窗消息
     * @param layer 弹窗的ui名称
     * @param data 弹窗初始值的数据
     */
    ShowMsg (layer, data) {
        let msg = this.ShowLayer(layer, this.node)
        let comp = msg.getComponent(layer)
        comp.Set(data)
        return msg
    },

    OnInitValue () { },
    
    OnInitUi () { },

    OnInit () { },

    _openPhysics () {
        if (this._physics) {
            cc.director.getPhysicsManager().enabled = true
            if (this._physicsDraw) {
                cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
                    cc.PhysicsManager.DrawBits.e_pairBit |
                    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
                    cc.PhysicsManager.DrawBits.e_jointBit |
                    cc.PhysicsManager.DrawBits.e_shapeBit
                    ;
            }
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
        if (this._joinLayer && this._joinLayer[name]) {
            return this._joinLayer[name]
        }
        this._joinLayer[name] = this._super(name, parent)
        return this._joinLayer[name]
    },

    /**
     * 删除一个ShowLayer 方式创建的Layer预制资源
     */
    DelLayer (name) {
        if (! this._joinLayer || ! this._joinLayer[name]) {
            Com.warn('不存在layer：', name)
            return
        }
        this._joinLayer[name].removeFromParent()
        this._joinLayer[name].destroy()
        delete this._joinLayer[name]
    },

    runScene (data) {
        this._runScene(data.Scene || data.scene)
    },

    _removeEvent () {
        let events = this._arrEmit
        Com.info('移除监听器--', events)
        for (let i in events) {
            this._emitter.un(events[i])
        }
    },

    Emit (emitName, emitData) {
        this._emitter.emit(emitName, emitData)
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
        Com.info("跳转场景-->", name)
        cc.director.loadScene(name)
        this._removeEvent()
    },
    
    //节点被销毁之后调用
    onDestroy () {
        this._removeEvent()
    },
    //节点被销毁之前调用
    _onPreDestroy () {

    }
})
