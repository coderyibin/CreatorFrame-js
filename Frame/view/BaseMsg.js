var BaseLayer = require('./BaseLayer')
var CusEvent = require('../ctrl/CusEvent')

var BaseMsg = cc.Class({
    extends : BaseLayer,

    properties : {
        _cancelCb : null,
        _okCb : null,
    },

    onLoad () {
        this._super()
        this._runAcrion()
    },

    Set (data) {
        if (! data) return
        this.set(data)
    },

    set (data) {
        this._data = data
        if (data.title) this.setLabelValue('Title', data.title)
        if (data.content) this.setLabelValue('Content', data.content)
        if (data.select === 'NONE') {
            this.HideNode('Left_Cancel')
            this.HideNode('Right_Ok')
            this.HideNode('Ok')
        } else if (data.select) {
            this.ShowNode('Left_Cancel')
            this.ShowNode('Right_Ok')
            this.HideNode('Ok')
            if (data.Ok) this._okCb = data.Ok
            else {Com.warn('缺少key-> Ok')}
            if (data.Cancel) this._cancelCb = data.Cancel
            else Com.warn('缺少key-> Cancel')
        } else {
            this.HideNode('Left_Cancel')
            this.HideNode('Right_Ok')
            this.ShowNode('Ok')
            if (data.Ok) this._okCb = data.Ok
            else {Com.warn('缺少key-> Ok')}
        }
        if (data.node) {
            this.node.name = data.node 
            let self = this
            CusEvent.getInstance().on(data.node, self._nodeEvent.bind(this), this)
        }
    },

    _nodeEvent (msg) {
        // this.node.removeFromParent()
        cc.removeSelf()
    },

    _runAcrion () {
        let node = this.getNode("Panel")
        if (node) {
            node.scaleX = 0.1
            node.scaleY = 0.1
            let action = cc.scaleTo(0.1, 1)
            node.runAction(action)
        }
    },

    _tap_Left_Cancel () {
        if (this._cancelCb) {
            this._cancelCb()
        }
        this.remove()        
    },

    _tap_Right_Ok () {
        if (this._okCb) {
            this._okCb(this)
        }
    },

    _tap_Ok () {
        this.Remove(true)
        if (this._okCb) {
            this._okCb(this)
        }
    },
})