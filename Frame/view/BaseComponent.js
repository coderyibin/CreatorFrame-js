var CusEvent = require("CusEvent")
var Common = require("Common")
var Global = require("Global")
var Analysis = require("Analysis")

var BaseComponent = cc.Class({
    extends : cc.Component,

    properties : {
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
        this._canvas = cc.find("Canvas")
        this._event = CusEvent.getInstance()
    },

    /**
     * 初始化ui
     */
    __initUI () {
        this._getAllNode(this._canvas)
    },
    _isNative () {
        return cc.sys.isNative;
    },

    //获取节点
    getNode (name) {
        return this._analysisClass.getNode(name)
    },
    /**
     * 场景节点解析
     */
    _getAllNode (node) {
        this._analysisClass.startAnalysis(node)
    },
    //获取文本组件值
    getLabelValue (name) {
        return this._analysisClass.getLabelString(name)
    },
    //设置文本值
    setLabelValue (name, value, ...values) {
        this._analysisClass.setLabelString(name, value, values)
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