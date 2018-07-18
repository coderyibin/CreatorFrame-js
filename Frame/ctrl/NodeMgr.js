var CusEvent = require('CusEvent')
var Common = require('Common')

//当前类现仅作为调试使用
var NodeMgr = cc.Class({
    extends : cc.Class,
    properties : {
        _nodes : null,
        _button : null,
    },

    ctor () {
        this._nodes = {}
        this._button = {}
    },

    //加入管理
    JoinMgr (script, nodes) {
        this._nodes[script] = nodes
    },

    //按钮事件
    JoinButton (script, name) {
        this._button[script] = name
    },

    //获取界面节点
    GetNode (script) {
        return this._nodes[script]
    },

    //获取脚本所有注册的按钮事件名称
    GetButton (script) {
        return this._button[script]
    },

    //清理
    Clear () {
        this._nodes = {}
        this._button = {}
    },
})

window['UI'] = new NodeMgr()