var BaseLayer = require('BaseLayer')
var CusEvent = require('CusEvent')

var BaseMsg = cc.Class({
    extends : BaseLayer,

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
        this.node.runAction(cc.sequence(action, reaction))
    },

    /**
     * 移除弹窗动作
     */
    RemoveAction () {

    },
})