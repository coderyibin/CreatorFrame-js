var CusEvent = require("CusEvent")
var Common = require("Common")
var Global = require("Global")
var UI = require('UIMgr')

var BaseComponent = cc.Class({
    extends : UI,

    properties : {
        _emitter : null,
        _hasLayer : null,
        //滚动容器
        _list_ :null,
        _unit_ : null,
        _listData : null,
    },

    onLoad () {
        this._super(this._script)
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
     * 注册事件
     */
    registerEvent () {
        let self = this;
        Com.info(this._script, 'cur script event:', self._arrEmit);
        for (let i = 0; i < self._arrEmit.length; i ++) {
            let sName = self._arrEmit[i];
            if (self[sName]) {
                self._emitter.on(self._arrEmit[i], self[sName].bind(this), self);
            } else {
                Com.warn("未注册事件,请在脚本中实现函数 " + sName + '函数');
            }
        }
    },
    
    /**
     * 初始化变量
     */
    __initValue () {
        this._emitter = CusEvent.getInstance()
        this._hasLayer = {}
    },

    /**
     * 初始化ui
     */
    __initUI () {
        this.InitUI()
    },
    _isNative () {
        return cc.sys.isNative;
    },

    /**
     * 显示一个layer
     * @param {*} layerName layer名称
     * @param {*} parent layer加入的父节点
     * @param {*} only 当前节点是否只能显示一个
     */
    showLayer (layerName, parent, only) {
        if (only) {
            if (this._hasLayer[layerName]) {
                return this._hasLayer[layerName]
            }
        }
        let node = this.ShowUnit(layerName, parent || this.GetCanvas())
        if (only) this._hasLayer[layerName] = node
        return node
    },ShowLayer (layerName, parent, only=false) {return this.showLayer(layerName, parent, only)},

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
    
    //清空容器内容
    ClearList (name) {
        let node = this.getNode(name)
        let scroll = node.getComponent(cc.ScrollView)
        scroll.content.removeAllChildren()
    },

    /**
     * 清理数据
     */
    ClaenData () {
        //清理自定义事件
        this.cleanEvent()
    },

    /**
     * 节点被销毁时调用
     */
    onDestroy () {
        this._super()
        this._hasLayer = {}
    },

    /**
     * 清理事件
     */
    cleanEvent () {
        let self = this
        for (let i = 0; i < self._arrEmit.length; i ++) {
            let temp = self._arrEmit[i]
            self.CleanAppointEvent(temp)
        }
    },

    /**
     * 清理指定事件
     * @param 事件名称
     */
    CleanAppointEvent (name) {
        this._emitter.un(name)
    },
});