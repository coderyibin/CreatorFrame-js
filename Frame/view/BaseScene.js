var BaseComponent = require("BaseComponent")

var BaseaScene = cc.Class({
    extends : BaseComponent,

    properties : {
        _physics : null,
        _touchEnable : null,
        _startPos : null,
        _arrEvent : null,
    },

    onLoad () {
        this._super()
        this._physics = false
        this._touchEnable = false
        this._arrEvent = ['onMsg', 'runScene']
        this.OnInit()

        this._openPhysics()
        this._openTouch()
    },

    start () {
        this.OnInitValue()
        this.OnInitUi()
    },

    _registerEvent () {
        let event = this._arrEvent;
        for (let i in event) {
            this._event.on(i, event[i])
        }
    },

    onMsg () {},

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

    _openTouch () {
        if (! this._touchEnable) return 
        let start = null
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            let pos = e.touch.getLocation()
            this._startPos = start = pos
            if (this["OnTouchBegin"]) this["OnTouchBegin"](pos)
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            if (this["OnTouchCancel"]) this["OnTouchCancel"](e.touch.getLocation())
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
            let pos = e.touch.getLocation()
            if (this["OnTouchEnd"]) this["OnTouchEnd"](start, pos)
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            let pos = e.touch.getLocation()
            if (this["OnTouchMove"]) this["OnTouchMove"](start, pos)
        }, this)
    },

    _closeTouch () {
        this.node.off(cc.Node.EventType.TOUCH_START, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_END, function (e) {}, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, function (e) {}, this)
    },

    runScene (data) {
        this._runScene(data.Scene)
    },

    _removeEvent () {

    },

    /**
     * 场景跳转
     * @param 场景名称 name 
     */
    _runScene (name) {
        console.log("跳转场景-->", name)
        cc.director.loadScene(name)
    }
})
