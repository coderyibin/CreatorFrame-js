var Common = require("../common/Common")
const i18n = require('LanguageData')
var Global = require('../common/Global')
var Sys = require('../common/Sys')
var Tools = require('../common/Tools')

/**
 * 当前类为UI的基类
 * 不允许手动创建
 * 只允许被继承
 */
var UI = cc.Class({
    extends : cc.Component,

    properties : {
        UiCache : {
            default : 0,
            type : cc.Enum({
                'true' : 0,
                'false' : 1
            }),
            tooltip : '是否遍历ui缓存起来，如果选false的话，该脚本的据大多数函数将不可用,将只能使用creator所自带的功能',
        },

        _script : null,
        _allNode : null,
        _canvas : null,
        _size : null,
        _disTime : null,
        _global : null,
        _common : null,
        _tools : null,
        _numberEdits : null,
    },

    onLoad () {
        this._script = cc.js.getClassName(this)
        this.name = this._script
        this._canvas = cc.find('Canvas')
        this._size = this.node.getContentSize()
        this._disTime = {}
        this._global = Global
        this._common = Common
        this._tools = Tools
        this._numberEdits = []
    },

    /**
     * 初始化当前节点ui
     */
    InitUI () {
        if (this.UiCache == 1) {
            return
        }
        this._allNode = {}
        let node = this.node
        this._start(node)
        NodeMgr.JoinMgr(this._script, this._allNode)
    },

    /**
     * 开始解析UI
     */
    _start (node) {
        for (let i in node.children) {
            let _node = node.children[i]
            this._allNode[_node.name] = _node
            //以下判断保证一个节点只注册一种类型事件
            if (! this._registerEdit(_node)) {
                if (! this._registerButton(_node)) {
                    this._registerToggle(_node)
                }
            }
            this._initTiledMap(_node)
            this._start(_node)
        }
    },

    /**
     * 初始化TiledMap地图组件
     */
    _initTiledMap (node) {
        let comp = node.getComponent('cc.TiledMap')
        if (comp) {
            CusTiledMap.InitTiledMap(comp)                    
        }
    },

    /**
     * 设置按钮间隔时间
     * 设置间隔时间可以触发，避免玩家一直点击造成异常
     * @param 节点名称
     * @param 间隔时间
     */
    SetButtonTime (key, value) {
        this._disTime[key] = value
    },

    /**
     * 注册按钮事件
     * @param {*} node 遍历到的节点对象
     */
    _registerButton (node) {
        let bname = node.name
        let name = '_tap_' + bname
        let cancel = '_cancel_' + bname
        //当前节点的用户脚本组件有这个成员函数，则注册事件，没有则略过
        if (this[name]) {
            let time = 0
            if (this._disTime[bname]) {
                time = this._disTime[bname]
            }
            node.addComponent('ButtonClick').CreateEvent(name, cancel, this, time)
            NodeMgr.JoinButton(this._script, name)
            return true
        } return false
    },

     /**
     * 注册输入框事件
     * @param {*} node 节点
     */
    _registerEdit (node) {
        let _comp = node.getComponent(cc.EditBox)
        if (_comp) {
            let name = node.name;
            let funcName = "_editBox_change_" + name;
            let register = false
            let self = this
            if (self[funcName]) {//输入框改变的时候调用
                // node.on(Sys.Editing, self[funcName].bind(self), self);
                let changeFunc = funcName
                node.on(Sys.Editing, function (e) {
                    //用户输入的除了最后一个字符串的字符串 145d => 145
                    let string = Global.GetSubStr(e.detail.string, 0, e.detail.string.length - 1)
                    let endstring = Global.GetSubStr(e.detail.string, e.detail.string.length - 1, 1)

                    let allow = self._isAllowNumber(e.detail.node.name)
                    if (allow) {//当前输入框只允许输入数字
                        let bool = Global.StrIsNumber(endstring)
                        if (! bool) {
                            e.detail.string = string
                        }
                    }
                    self[changeFunc](e)
                }, self);
                register = true
            }
            funcName = "_editBox_began_" + name;
            if (self[funcName]) {//输入框开始输入的时候调用
                node.on(Sys.Edit_Begin, self[funcName].bind(self), self);
                register = true
            }
            funcName = "_editBox_return_" + name;
            if (self[funcName]) {//暂时不清楚干嘛用的
                node.on(Sys.Edit_Return, self[funcName].bind(self), self);
                register = true
            }
            funcName = "_editBox_end_" + name;
            if (self[funcName]) {//输入框结束的时候调用
                node.on(Sys.Edit_End, self[funcName].bind(self), self);
                register = true
            }
        }
    },

    /**
     * 注册监听只允许用户输入数字
     * @param name 输入框的节点名称
     */
    _registerAllowNumber (name) {
        for (let i in this._numberEdits) {
            if (this._numberEdits[i] == name) {//已经存在，不需要重复注册
                return
            }
        }
        this._numberEdits.push(name)
    },

    /**
     * 判断只允许用户输入数字的输入框
     * @param name 输入框的节点名称
     */
    _isAllowNumber (name) {
        for (let i in this._numberEdits) {
            if (this._numberEdits[i] == name) {
                return true//数字
            }
        }
        return false//非数字
    },

    /**
     * 由节点名称获取节点
     * @param {*} name 节点名称或者对象预制资源之类
     */
    GetNode(name) {
        //如果是预制资源，则克隆出一个节点返回
        if (name instanceof cc.Prefab) {
            let node = cc.instantiate(name)
            return node
        }
        //通过框架遍历
        let node = this._allNode[name]
        if (! node) {
            console.error(name + ':node not found')
            return null
        }
        return node
    },

    /**
     * 兼容旧项目
     */
    getNode (name) {
        return this.GetNode(name)
    },

    /**
     * 获取所有节点
     */
    GetAllNode () {
        return this._allNode
    },

    /**
     * 获取指定节点坐标
     * @param node 节点名称或者节点对象-仅限于当前creator界面场景中的节点，无法获取动态创建的节点
     */
    GetNodePosition (node) {
        if (! node || node == '') {
            return Com.error('获取节点坐标，节点对象参数不能是空的')
        }
        if (node instanceof Object) {
            return node.position
        }
        return this.GetNode(node).position
    },

    /**
     * 注册复选框事件
     * @param node 节点
     * 复选框e.detail.isCkecked=是否选中
     */
    _registerToggle (node) {
        let _comp = node.getComponent(cc.Toggle)
        let self = this
        if (_comp) {
            let name = node.name;
            let event = '_toggle_' + name
            if (self[event]) {
                node.on(Sys.Touch_Toggle, function (e) {
                    self[event](e.detail)
                }, self)
            }
        }
    },

    /**
     * 由节点名称获取节点下的进度条组件当前进度
     * @param {*} name 
     */
    GetProgressValue (name) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.ProgressBar)
            if (comp) {
                return comp.progress
            } else {
                Com.error('没有该' + name + '节点没有组件ProgressBar')
            }
        }
    },

    /**
     * 设置进度条总长度
     * @param name 节点名称
     * @param total 总长度
     */
    SetProgressTotal (name, total) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.ProgressBar)
            if (comp) {
                comp.totalLength = total
            } else {
                Com.error('没有该' + name + '节点没有组件ProgressBar')
            }
        }
    },

    /**
     * 设置名称节点下的进度条组件的进度值
     * @param {*} name 
     * @param {*} value 
     */
    SetProgressValue (name, value) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.ProgressBar)
            if (comp) {
                comp.progress = value
            } else {
                Com.error('没有该' + name + '节点没有组件ProgressBar')
            }
        }
    },

    /**
     * 兼容旧项目
     */
    setProgressValue (name, value) {
        this.SetProgressValue(name, value)
    },

    /**
     * 设置输入框的值
     * @param {*} name 
     * @param {*} value 
     */
    SetEditBoxValue (name, value) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.EditBox)
            if (comp) {
                comp.string = value
            } else {
                Com.error('该节点'+ name +'没有EditBox组件')
            }
        }
    },

    /**
     * 获取输入框的文本值
     * @param {*} name 
     */
    GetEditBoxValue (name) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.EditBox)
            if (comp) {
                return comp.string
            } else {
                Com.error('该节点'+ name +'没有EditBox组件')
            }
        }
    },  

    /**
     * 获取文本组件的值
     * @param {*} name 
     */
    GetLabelValue (name) {
        let node = this.GetNode(name)
        if (node) {
            return node.getComponent(cc.Label).string
        }
    },

    /**
     * 获取文本值-兼容旧项目
     * @param {*} name 
     */
    getLabelString (name) {
        return this.GetLabelValue(name)
    },

    /**
     * 设置多语言文本组件
     * @param 节点名称
     * @param 要设置的值
     * @param 要替换掉的值中的%s的值
     */
    SetLabelValue (name, value, ...values) {
        let node = this.GetNode(name)
        if (node) {
            if (Common.OpenLanguage) {
                if (node.getComponent('LocalizedLabel')) {
                    node.getComponent('LocalizedLabel').dataID = value
                } else {
                    let comp = node.addComponent('LocalizedLabel')
                    comp.dataID = value
                }
            } else {
                node.getComponent(cc.Label).string = value
            }
            if (values.length > 0) {
                let str = this.getLabelString(name)
                for (let i in values) {
                    node.getComponent(cc.Label).string = str.replace(/%s/, values[i])
                }
            }
        }
    },

    /**
     * 兼容旧项目
     */
    setLabelValue (name, value, ...values) {
        this.SetLabelValue(name, value, ...values)
    },

    /**
     * 设置动态文本 - 不作为多语言使用的文本
     * @param {*} name 
     * @param {*} value 
     */
    SetDyLabelValue (name, value) {
        let node = this.GetNode(name)
        if (node) {
            if (node.getComponent('LocalizedLabel')) {
                Com.warn('动态文本不需要有多语言脚本,请移除!' + name)
                node.removeComponent('LocalizedLabel')
            }          
            node.getComponent(cc.Label).string = value  
        }
    },

    /**
     * 设置文本数字值
     * @param {*} name 
     * @param {*} value 
     */
    SetNumberLabelValue (name, value) {
        let node = this.GetNode(name)
        if (node) {
            if (node.getComponent('LocalizedLabel')) {
                Com.warn('数字文本不需要有多语言脚本,请移除!' + name)
                node.removeComponent('LocalizedLabel')
            }          
            node.getComponent(cc.Label).string = value  
        }
    }, 

    /**
     * 获取Toggle组件
     * @param 节点名称
     */
    GetToggle (name) {
        let node = this.GetNode(name)
        if (node) {
            let comp = node.getComponent(cc.Toggle)
            if (comp) {
                return comp
            } Com.wran('节点->', name, '不存在组件类型Toggle')
        }
    },

    /**
     * 设置Toggle组件的状态
     * @param 节点名称
     * @param 是否选中
     */
    SetToggle (name, selected) {
        let comp = this.GetToggle(name)
        comp.isChecked = selected
    },
    
    /**
     * 以节点名称从节点的父节点删除该节点
     * @param 如果不传入 cleanup 参数或者传入 true，那么这个节点上所有绑定的事件、action 都会被删除。
     */
    RemoveNodeParent (name, cleanup=true) {
        let node = this.GetNode(name)
        if (node) {
            node.removeFromParent(cleanup)
        }        
    },

    /**
     * 移除所有子节点
     * @param 节点名称
     * @param 如果不传入 cleanup 参数或者传入 true，那么这个节点上所有绑定的事件、action 都会被删除。
     */
    RemoveAll (name, cleanup=true) {
        let node = this.GetNode(name)
        if (node) {
            node.removeAllChildren(cleanup)
        }
    },

    /**
     * 移除自己
     * @param clean 是否释放所占用内存
     */
    Remove (clean=false) {
        // Com.info('移除当前节点->', this._script)
        this.node.removeFromParent()
        this.ClaenData()
        if (clean) {
            this.node.destroy() 
            // Com.info('彻底清理' + this.name)
        }
    },

    /**
     * 兼容旧项目
     */
    remove () {
        this.Remove()
    },

    /**
     * 显示指定节点
     * @param name
     */
    ShowNode (name) {
        if (name instanceof Object) {
            if (name.active) return 
            return name.active = true
        }
        let node = this.GetNode(name)
        if (node) {
            if (node.active) return 
            node.active = true
        }
    },

    /**
     * 隐藏指定节点
     * @param name 节点名称或者节点对象
     */
    HideNode (name) {
        if (! name || name == '') {
            Com.error('name 不能为空')
            return
        }
        if (name instanceof Object) {
            if (! name.active) return 
            return name.active = false
        }
        let node = this.GetNode(name)
        if (node) {
            if (! node.active) return 
            node.active = false
        }
    },

    /**
     * 节点是否隐藏
     * @param name
     */
    IsHideNode (name) {
        if (name instanceof Object) {
            return ! name.active
        }
        let node = this.GetNode(name)
        if (node) {
            return ! node.active
        }
    },

    /**
     * 获取节点名称组件
     * @param name 节点名称或者节点对象
     * @param comp 组件名称
     */
    GetNodeComp (name, comp) {
        if (! comp || comp == "") {
            Com.error('组件名称不能是空')
            return
        }
        //name为字符串
        if (name instanceof String || typeof(name) == 'string') {
            let node = this.GetNode(name)
            if (node) {
                let _comp = node.getComponent(comp)
                if (_comp) {
                    return _comp
                }
            }
        } else {
            if (name) {
                let _comp = name.getComponent(comp)
                if (_comp) {
                    return _comp
                }
            }
        }
        Com.error('该节点没有组件：', comp)
        return null
    },

    /**
     * 获取资源节点
     * */
    GetResNode (name) {
        let res = RES.Get(name)
        if (res instanceof cc.Node) {
            return res
        }
        Com.error('在resources文件夹下没有该名称的预制资源:' + name) 
        return null
    },

    /**
     * 添加节点
     */
    AddChild (node) {
        this.node.addChild(node)
    },

    /**
     * 设置节点颜色
     * @param node 节点名或者节点对象
     * @param color 颜色值
     * @example this.SetNodeColor(node, new cc.Color(xxx,xxx,xxx,xxx))
     */
    SetNodeColor (node, color=new cc.Color(255, 255, 255, 255)) {
        if (node instanceof String || typeof(node) == 'string') {
            node = this.GetNode(node)
        }
        if (! node) {
            node.color = color
        } else {
            Com.error(node + '当前节点不存在,请检查！')
        }
    },

    /**
     * 获取节点颜色
     * @param node 节点名或者节点对象
     */
    GetNodeColor (node) {
        if (node instanceof String || typeof(node) == 'string') {
            node = this.GetNode(node)
        }
        if (! node) {
            return node.color
        } else {
            Com.error(node + '当前节点不存在,请检查！')
        }
    },

    /**
     * 获取画布节点
     */
    getCanvas () {
        return this._canvas
    },GetCanvas () {return this.getCanvas()},

    /**
     * 获取指定节点大小
     * 如果不传参数，就是获取自身
     */
    GetNodeSize (name) {
        if (! name) {
            return this._size
        }
        let node = this.GetNode(name)
        if (node) {
            return node.getContentSize()
        }
    },

    /**
     * 获取可视视图大小
     * */
    GetVisibleSize () {
        return cc.director.getVisibleSize()
    },

    /**
     * 显示自己
     */
    Show () {
        this.node.active = true
    },

    /**
     * 隐藏自己
     */
    Hide () {
        this.node.active = false
    },

    /**
     * 判断自身是否隐藏
     */
    IsHide () {
        return ! this.node.active
    },

    /**
     * 创建Unit单元元件
     * @param name 预制资源名称
     * @param parent 添加进的父节点
     * @param index 唯一标识符
     * @param data 创建时初始化的值
     * @returns 返回创建完成的节点
     */
    ShowUnit (name, parent, index, data) {
        if (! parent) {
            Com.error('父节点不能是空的')
            return
        }
        let node = this.GetResNode(name)
        if (! node) {
            Com.error(name + '资源不存在，请检查resources资源或者配置文件！')
            return
        }
        parent.addChild(node)
        let comp = this.GetNodeComp(node, node.name)
        if (comp && data) {
            comp.Set(index, data)
        }
        return node
    },

    /**
     * 获取当前场景对象的用户脚本组件-与场景同名的脚本组建
     */
    GetSceneClass () {
        let canvas = this.GetCanvas()
        let comp = this.GetNodeComp(canvas, cc.director.getScene().name)
        return comp
    },

    /**
     * 设置精灵帧-旧接口
     */
    _setSpriteFrame (node, image, atals) {
        let comp = node.getComponent(cc.Sprite)
        if (comp) {
            //如果是合图
            if (atals) {
                let res = RES.GetAtlas(image, atals)
                if (res) {
                    comp.spriteFrame = res
                    return
                } Com.error('没有合图加载图片纹理:'+ atals + '图片名称：' + image)
                return
            }
            let res = RES.Get(image)
            if (res) {
                comp.spriteFrame = res
                return
            } Com.error('没有加载图片纹理:'+ image)
        } Com.error('该节点没有精灵组件:'+ name)
    },

    /**
     * 更改精灵帧-旧接口
     * @param name 节点名称或者节点对象
     * @param image 精灵的图片名称
     * @param atals 精灵合图名称
     */
    ChangeSpriteFrame (name, image, atals=null) {
        let node
        if (name instanceof String || typeof(name) == 'string') {
            node = this.getNode(name)
        } else {
            node = name
        }
        // let node = this.getNode(name)
        if (node) {
            let comp = node.getComponent(cc.Sprite)
            if (comp) {
                //如果是合图
                if (atals) {
                    let res = RES.GetAtlas(image, atals)
                    if (res) {
                        comp.spriteFrame = res
                        return
                    } Com.error('没有合图加载图片纹理:'+ atals + '图片名称：' + image)
                    return
                }
                let res = RES.Get(image)
                if (res) {
                    comp.spriteFrame = res
                    return
                } Com.error('没有加载图片纹理:'+ image)
            } Com.error('该节点没有精灵组件:'+ name)
        }
    },

    /**
     * 改变精灵spriteFrame-新接口
     * 当前接口会优先寻找image表中匹配的数据,如果没有,则在全局资源中寻找匹配数据
     * 全局中的资源寻找不包含合图资源
     * 
     * @param node 要装载的精灵节点或者节点名称
     * @param image 图片名称
     */
    SetSpriteFrame (node, image) {
        if (! image) {
            Com.error('图片名称不能是空的' + image)
            return
        }
        if (! node) {
            Com.error('要替换纹理的精灵组件节点不能为空')
            return
        }
        let imageCfg = RES.GetConfig('image')
        let res = imageCfg[image]
        //没有image配置文件的情况下
        if (! res) {
            this.ChangeSpriteFrame(node, image)
            return 
        }
        if (res && res.Atlas) {//合图中寻找
            this.ChangeSpriteFrame(node, res.Name, res.AtlasName)
        } else if (res) {
            this.ChangeSpriteFrame(node, res.Name)
        } else {
            Com.warn('图片资源不存在，请确认是否存在名称 ' + image + '的图片')
        }
    },

    // /**
    //  * 居于节点对象 改变精灵的Frame
    //  * @param node 节点对象
    //  * @param image 图片名称
    //  */
    // SetSpriteFrameOfNode (node) {
    //     let imageCfg = RES.GetConfig('image')
    //     let res = imageCfg[image]
    //     if (res.Atlas) {//合图中寻找
    //         // this.ChangeSpriteFrame(node, res.Name, res.AtlasName)
    //         this._setSpriteFrame(node, res.Name, res.AtlasName)  
    //     } else {
    //         // this.ChangeSpriteFrame(node, res.Name)
    //         this._setSpriteFrame(node, res.Name) 
    //     }
    // },

    /**
     * 执行节点上所在的动画
     * @param node 动画所在节点或者节点名称
     * @param name 动画名称
     */
    PlayAnimation (node, name) {
        if (typeof(node) == 'string' || node instanceof String) {
            node = this.GetNode(node)
        }
        this.GetNodeComp(node, 'cc.Animation').play(name)
    },

    onDestroy () {
        this._clean()
    },

    ClaenData () { },

    /**
     * 清理
     */
    _clean () {
        this._allNode = {}
        NodeMgr.Clear()
    }
})
