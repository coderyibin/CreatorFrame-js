var CusEvent = require("CusEvent")
var Common = require("Common")
var Global = require("Global")
var Analysis = require("Analysis")

var BaseComponent = cc.Class({
    extends : cc.Component,

    properties : {
        _script : null,
        _canvas : null,
        _emitter : null,
        _analysisClass : null,
        _analysis : null,
        _allNode : null,
        _hasLayer : null,
        //滚动容器
        _list_ :null,
        _unit_ : null,
        _listData : null,
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

    // /**
    //  * 添加解析ui的key
    //  */
    // JoinAnalysis (...values) {
    //     this._analysisClass.initAnalysis(values, this)
    // },

    /**
     * 初始化变量
     */
    __initValue () {
        this._analysisClass = new Analysis()
        this._canvas = cc.find("Canvas")
        this._emitter = CusEvent.getInstance()
        this._allNode = {}
        this._hasLayer = {}
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

    /**
     * 显示一个layer
     * @param {*} layerName layer名称
     * @param {*} parent layer加入的父节点
     */
    showLayer (layerName, parent, only) {
        if (only) {
            if (this._hasLayer[layerName]) {
                return this._hasLayer[layerName]
            }
        }
        let node = RES.Get(layerName)
        if (parent) parent.addChild(node) 
        else this._gameNode.addChild(node)
        if (only) this._hasLayer[layerName] = node
        return node
    },ShowLayer (layerName, parent, only=false) {return this.showLayer(layerName, parent, only)},

    /**
     * 创建一个unit单元元件
     */
    showUnit (unitName, parent, index, data) {
        let node = this.ShowLayer(unitName, parent)
        node.getComponent(node.name).Set(index, data)
    }, ShowUnit (unitName, parent, index, data) {return this.showUnit(unitName, parent, index, data)},

    //刷新列表*列表名称
    refreshList (listName) {
        let data = this._listData
        let index = 0
        for (let i in data) {
            this._setList(listName, data[i], index)
            index ++
        }
    },
    //设置列表数据
    _setList (name, data, index) {
        let unit = 'Unit_' + name
        let list = '_list_' + name
        let node = RES.Get(unit)
        if (node) {
            let comp = node.getComponent(unit)
            if (! comp) {
                comp = node.addComponent(unit)
            }
            comp.Set(index, data)
            this.getNode(list).addChild(node)
        }
    },

    //获取节点
    getNode (name) {
        return this._analysisClass.getNode(name)
    },
    //显示节点
    ShowNode (name) {
        let node = this.getNode(name)
        if (node) {
            node.active = true
        }
    },
    //隐藏节点
    HideNode (name) {
        let node = this.getNode(name)
        if (node) {
            node.active = false
        }
    },
    //节点是否隐藏
    IsShowNode (name) {
        let node = this.getNode(name)
        if (node) {
            return node.active
        }
    },
    //获取资源节点
    GetResNode (name) {
        return RES.Get(name)
    },
    /**
     * 场景节点解析
     */
    _getAllNode (node) {
        this._analysisClass.startAnalysis(node, this)
        this._allNode = this._analysisClass.GetAllNode()
        UI.JoinMgr(this._script, this._allNode)
    },
    //清空容器内容
    ClearList (name) {
        let node = this.getNode(name)
        let scroll = node.getComponent(cc.ScrollView)
        scroll.content.removeAllChildren()
    },
    //获取文本组件值
    getLabelValue (name) {
        return this._analysisClass.getLabelValue(name)
    },
    //设置文本值
    setLabelValue (name, value, ...values) {
        this._analysisClass.setLabelValue(name, value, ...values)
    },SetLabelValue (name, value, ...values) {this.setLabelValue(name, value, ...values)},
    //设置数字文本值
    setNumberLabelValue (name, value) {
        this._analysisClass.setNumberLabelValue(name, value)
    },
    //设置进度条
    setProgressValue (name, value) {
        this._analysisClass.setProgressValue(name, value)
    },
    //设置进度条
    getProgressValue () {
        return this._analysisClass.getProgressValue(name)
    },
    //获取输入框值
    getEditBoxValue (name) {
        return this._analysisClass.getEditBoxValue(name)
    },
    /**
     * 设置Toggle组件的状态
     * @param 节点名称
     * @param 是否选中
     */
    SetToggle (name, selected) {
        this._analysisClass.GetToggle(name).isCkecked = open
    },
    /**
     * 获取Toggle组件状态
     * @param 节点名
     */
    GetToggle (name) {
        this._analysisClass.GetToggle(name).isCkecked
    },
    //以节点对象从父节点移除自己
    removeNodeFromParent (node) {
        node.removeFromParent()
    },
    //以节点名称移除节点
    removeNameNode (name) {
        this._analysisClass.removeNodeParent(name)
    },

    getCanvas () {
        return this._canvas
    },GetCanvas () {return this.getCanvas()},

    //获取可视视图大小
    GetVisibleSize () {
        return cc.director.getVisibleSize()
    },

    onDestroy () {
        UI.Clear()
        this._hasLayer = {}
    }
});