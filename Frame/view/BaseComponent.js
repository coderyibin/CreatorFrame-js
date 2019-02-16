var CusEvent = require("../ctrl/CusEvent")
var Common = require("../common/Common")
var Global = require("../common/Global")
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
        if (! parent) parent = this.GetCanvas()
        let node = this.ShowUnit(layerName, parent)
        if (only) this._hasLayer[layerName] = node
        return node
    },ShowLayer (layerName, parent, only=false) {return this.showLayer(layerName, parent, only)},

    /**
     * 显示一个layer--可以带参数
     * @param {*} layerName layer的资源名称
     * @param {*} data 传输的参数 在layer脚本需要用实现一次onData()就可以用this._data这个变量
     * @param {*} parent layer加入的父节点
     * @returns node 节点
     */
    ShowLayerParam (layerName, data, parent) {
        let node = this.ShowLayer(layerName, parent)
        node.getComponent(layerName).Set(data)
        return node
    },

    /**
     * 获取一个Layer
     */
    GetLayer (name) {
        if (this._hasLayer[name]) {
            return this._hasLayer[name]
        }
    },

    /**
     * 设置滚动列表数据-必须是数组
     */
    SetListData (data) {
        this._listData = Global.CloneArray(data)
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
                let left, bottom, top, right, width, spacingX, spacingY
                width = parent.width
                if (layout) {
                    left = layout.paddingLeft
                    bottom = layout.paddingBottom
                    right = layout.paddingRight
                    top = layout.paddingTop
                    spacingX = layout.spacingX
                    spacingY = layout.spacingY
                }
                let laywidth = left + right
                this.ClearList(listName)
                for (let i = 0; i < data.length; i ++) {
                    let node = this.ShowUnit(unitName, parent, i, data[i])
                    //自适配计算
                    if (layout.type == Sys.Layout.Type.Grid) {//网格布局
                        if (layout.startAxis == Sys.Layout.AxisDirection.Horizonal) {
                            let w = node.width
                            laywidth += w + spacingX
                            if (laywidth > parent.width) {
                                parent.height += node.height
                                laywidth = left + right
                            }
                        }
                    } else if (layout.type == Sys.Layout.Type.Vertical) {//垂直布局
                        parent.height += node.height + spacingY
                    }
                    if (i == 0) {
                        parent.height += node.height * 2
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
     * 获取*列表的*单元
     * @param name 列表节点名称
     * @param index 单元的唯一标识符
     * @return comp 用户脚本组件
     */
    GetListIndex (name, index) {
        let nodes = this.GetNodeComp(name, cc.ScrollView).content.children
        for (let i = 0; i < nodes.length; i ++) {
            let temp = this.GetNodeComp(nodes[i], nodes[i].name)
            if (temp.GetIndex() == index) {
                return temp
            }
        }
    },

    /**
     * 更新列表中指定的Index的Item的值
     */
    UpdateListItem (name, index, data) {
        let nodes = this.GetNodeComp(name, cc.ScrollView).content.children
        for (let i = 0; i < nodes.length; i ++) {
            let temp = this.GetNodeComp(nodes[i], nodes[i].name)
           temp.UpdateUnit(index, data)
        }
    },

    /**
     * 添加pageview单元
     * @param page pageview 节点或者组件对象
     * @param item 将要添加进去的节点
     */
    AddPageView (page, item) {
        if (! page) {
            Com.error(page + ' 组件不能是空')
            return
        }
        if (page instanceof cc.Node) {
            page = page.getComponent(cc.PageView)
            if (! page) {
                return Com.error(page.name + '节点不存在pageview组件')
            }
        }
        if (! item) {
            return Com.error('节点不能为空：位置- BaseComponent:AddPageView()')
        }
        if (item instanceof cc.Node) {
            item.removeFromParent()
            page.addPage(item)
        } else if (typeof(item) == String) {
            return Com.error('item 参数必须是节点对象，不能是字符串或者其他')
        }
    },

    /**
     * 添加pageview单元,将页面插入指定位置中
     * insertPage 
     * @param page pageview 节点或者组件对象
     * @param item 将要添加进去的节点
     * @param index 将要添加进去的位置
     */
    InsertItem (page, item, index) {
        if (! page) {
            return Com.error(page + ' 组件不能是空')
        }
        if (page instanceof cc.Node) {
            page = page.getComponent(cc.PageView)
            if (! page) {
                return Com.error(page.name + '节点不存在pageview组件')
            }
        }
        item.removeFromParent()
        page.insertPage(item)
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