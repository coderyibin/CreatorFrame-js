var CusEvent = require('CusEvent')

var BaseMsg = cc.Class({
    extends : require('BaseLayer'),

    properties : {
    },

    onLoad () {
        this._super()
        this._initAction()
    },

    /**
     * 初始化弹窗默认缩放动作
     */
    _initAction () {
        this.node.scale = 0.3
        let action = cc.scaleTo(0.1, 1.2)
        let reaction = cc.scaleTo(0.03, 1.0)
        this.node.runAction(cc.sequence(action, reaction, cc.callFunc(this._actionCall, this)))
    },

    /**
     * 显示弹窗的动画播放完成的回调
     */
    _actionCall () {
        if (this['openCall']) this['openCall']()
    },

    // /**
    //  * 移除弹窗动作
    //  */
    // RemoveAction () {
    //     let action = cc.scaleTo(0.03, 1.2)
    //     let reaction = cc.scaleTo(0.1, 0.3)
    //     this.node.runAction(cc.sequence(action, reaction, cc.callFunc(this._removeActionCall, this)))
    // },

    // /**
    //  * 移除弹窗的动画播放完的回调
    //  */
    // _removeActionCall () {
    //     if (this['closeCall']) this['closeCall']()
    //     this.Remove()
    // },
})