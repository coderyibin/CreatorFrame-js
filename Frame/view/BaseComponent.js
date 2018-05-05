var CusEvent = require("CusEvent")
var Common = require("Common")

var BaseComponent = cc.Class({
    extends : cc.Component,

    properties : {
        LabelArray : {
            tooltip : "文本数组",
            default : [],
            type : cc.Node
        },

        _labelData : null,
        _canvas : null,
        _event : null,
    },

    onLoad () {
        this.__initValue();
        this.__initUI();
    },

    start () {},

    /**
     * 初始化变量
     */
    __initValue () {
        this._labelData = {}
        this._buttonData = {}
        this._canvas = cc.find("Canvas")
        this._event = CusEvent.getInstance()
    },

    /**
     * 初始化ui
     */
    __initUI () {
        this._getAllNodeRegisterLabel(this._canvas)
        this._getAllNodeRegisterButton(this._canvas)
    },

    /**
     * 遍历所有节点并且获取文本组件
     */
    _getAllNodeRegisterLabel (node) {
        for (let i in node.children) {
            let _node = node.children[i]
            if (_node.name.indexOf('_label_') >= 0) {
                this._labelData[_node.name] = _node
            }
        }
    },

    /**
     * 获取文本对象
     */
    _getLabel (name) {
        return this._labelData[name]
    },

    /**
     * 获取按钮对象
     */
    _getButton (name) {
        return this._buttonData[name]
    },
    /**
     * 遍历所有节点并注册触发事件
     */
    _getAllNodeRegisterButton (node) {
        for (let i in node.children) {
            let _node = node.children[i]
            let name = '_tap_' + _node.name
            _node.addComponent('ButtonClick').CreateEvent(name, this)
            this._buttonData[name] = _node
            this._getAllNodeRegisterButton(_node)
        }
    },

    getCanvas () {
        return this._canvas
    },
    /**
     * 输出日志
     */
    Log (funcName, ...values) {
        if (Common.IsDebug) {
            let _n = Common.fGetObjectName(this)
            console.log(_n + ':' + funcName + ":" + values)
        }
    }
});