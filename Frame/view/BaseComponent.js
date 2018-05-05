var CusEvent = require("CusEvent")
var Common = require("Common")
var Global = require("Global")
var Analysis = require("Analysis")

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
        _analysisClass : null,
        _analysis : null,
    },

    onLoad () {
        this.OnInitValueBefore();
        this.__initValue();
        this.__initUI();
    },

    start () {},

    /**
     * 初始化__initValue之前执行
     */
    OnInitValueBefore () {
    },

    /**
     * 添加解析ui的key
     */
    JoinAnalysis (...values) {
        this._analysisClass.initAnalysis(values, this)
    },

    /**
     * 初始化变量
     */
    __initValue () {
        this._analysisClass = new Analysis()
        this._labelData = {}
        this._buttonData = {}
        this._canvas = cc.find("Canvas")
        this._event = CusEvent.getInstance()
        this._analysis = {
            '_label_' : this._labelData,
        }
    },

    /**
     * 初始化ui
     */
    __initUI () {
        this._getAllNode(this._canvas)
    },

    /**
     * 遍历所有节点并且获取文本组件
     */
    _getAllNodeRegisterLabel (node) {
        for (let i in node.children) {
            let _node = node.children[i]
            let c = _node.name.indexOf('_label_')
            if (c >= 0) {
                let name = Global.GetStrLen(_node.name, 7)
                this._labelData[name] = _node.getComponent(cc.Label)
            }
            this._getAllNodeRegisterLabel(_node)
        }
    },
    /**
     * 获取文本对象
     */
    getLabel (name) {
        return this._labelData[name]
    },
    /**
     * 获取按钮对象
     */
    getButton (name) {
        return this._buttonData[name]
    },
    /**
     * 场景节点解析
     */
    _getAllNode (node) {
        this._analysisClass.startAnalysis(node)
    },
    //注册文本
    _getLabelObject (node) {
        let name = node.name
        let c = node.name.indexOf('_label_')
        if (c >= 0) {
            let name = Global.GetStrLen(node.name, 7)
            this._labelData[name] = node.getComponent(cc.Label)
        }
    },
    /**
     * 注册按钮触发事件
     */
    _registerButton (node) {
        let name = '_tap_' + node.name
        node.addComponent('ButtonClick').CreateEvent(name, this)
        this._buttonData[name] = node
    },
    getCanvas () {
        return this._canvas
    },
    /**
     * 输出日志
     */
    Log (funcName, ...values) {
        if (Common.IsDebug) {
            let _n = Global.GetObjectName(this)
            console.log(_n + ':' + funcName + ":" + values)
        }
    }
});