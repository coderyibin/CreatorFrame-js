var CusEvent = require("../../Frame/ctrl/CusEvent")
var Common = require("Common")
var Global = require("Global")
var Sys = require('../common/Sys')
var UI = require('./UIMgr')

var BaseComponent = cc.Class({
    extends : UI,

    properties : {
        _emitter : null,
        _hasLayer : null,
        //滚动容器
        _list_ :null,
        _unit_ : null,
        _listData : null,
        _event : null,
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
        //兼容项目
        this._emitter = CusEvent.getInstance()
        //新接口
        this._event = this._emitter
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

    /**
     * 设置滚动列表数据
     */
    SetListData (data) {
        this._listData = data
    },

    /**
     * 刷新列表
     * @param {*} listName 列表名称 ScrollView 节点名
     * @param {*} unitName 单元名称
     */
    refreshList (listName, unitName) {
        let node = this.GetNode(listName)
        if (node) {
            let scroll = this.GetNodeComp(node, 'cc.ScrollView')
            if (scroll) {
                let data = this._listData
                let parent = scroll.content
                let layout = parent.getComponent(cc.Layout)
                let left, bottom, top, right, width, spacingX
                width = parent.width
                if (layout) {
                    left = layout.paddingLeft
                    bottom = layout.paddingBottom
                    right = layout.paddingRight
                    top = layout.paddingTop
                    spacingX = layout.spacingX
                }
                let laywidth = left + right
                this.ClearList(listName)
                for (let i = 0; i < data.length; i ++) {
                    let node = this.ShowUnit(unitName, parent, i, data[i])
                    //自适配计算
                    if (layout.type == Sys.Layout.Type.Grid) {//网格布局
                        if (layout.startAxis == Sys.Layout.AxisDirection.Horizonal) {
                            let w = node.width
                            if (i == 0) {
                                parent.height += node.height * 2
                            }
                            laywidth += w + spacingX
                            if (laywidth > parent.width) {
                                parent.height += node.height
                                laywidth = left + right
                            }
                        }
                    }
                }
            }
        }
    },
    
    //清空容器内容
    ClearList (name) {
        let node = this.getNode(name)
        let scroll = node.getComponent(cc.ScrollView)
        scroll.content.removeAllChildren()
        scroll.content.height = 0
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