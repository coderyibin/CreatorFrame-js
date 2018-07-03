var Common = require("Common")
const i18n = require('LanguageData')
var Global = require('Global')

//ui解析类
var Analysis = cc.Class({
    extends : cc.class,

    properties : {
        _allNode : null,
    },

    ctor () {
        this._allNode = {}
        i18n.init(Common.DefaultLanguage);
    },

    startAnalysis (node, comp) {
        for (let i in node.children) {
            let _node = node.children[i]
            this._registerEdit(_node, comp)
            this._registerButton(_node, comp)
            this.startAnalysis(_node, comp)
            this._allNode[_node.name] = _node
        }
    },

    _registerButton (node, comp) {
        let name = '_tap_' + node.name
        if (comp[name]) {
            node.addComponent('ButtonClick').CreateEvent(name, comp)
        }
    },

    getNode(name) {
        let node = this._allNode[name]
        if (! node) {
            console.error(name + ':node not found')
            return null
        }
        return node
    },

    _registerEdit (node, self) {//节点--逻辑脚本
        let _comp = node.getComponent(cc.EditBox)
        if (_comp) {
            let name = node.name;
            let funcName = "_editBox_change_" + name;
            if (self[funcName]) node.on("text-changed", self[funcName].bind(self), self);
            funcName = "_editBox_began_" + name;
            if (self[funcName]) node.on("editing-did-began", self[funcName].bind(self), self);
            funcName = "_editBox_return_" + name;
            if (self[funcName]) node.on("editing-did-ended", self[funcName].bind(self), self);
        }
    },

    getProgressValue (name) {
        let node = this.getNode()
        if (node) {
            let comp = node.getComponent(cc.ProgressBar)
            if (comp) {
                return comp.progress
            } else {
                Com.error('没有该' + name + '节点没有组件ProgressBar')
            }
        }
    },

    setProgressValue (name, value) {
        let node = this.getNode(name)
        if (node) {
            let comp = node.getComponent(cc.ProgressBar)
            if (comp) {
                comp.progress = value
            } else {
                Com.error('没有该' + name + '节点没有组件ProgressBar')
            }
        }
    },

    setEditBoxValue (name, value) {
        let node = this.getNode(name)
        if (node) {
            let comp = node.getComponent(cc.EditBox)
            if (comp) {
                comp.string = value
            } else {
                Com.error('该节点'+ name +'没有EditBox组件')
            }
        }
    },

    getEditBoxValue (name) {
        let node = this.getNode(name)
        if (node) {
            let comp = node.getComponent(cc.EditBox)
            if (comp) {
                return comp.string
            } else {
                Com.error('该节点'+ name +'没有EditBox组件')
            }
        }
    },  

    getLabelValue (name) {
        let node = this.getNode(name)
        if (node) {
            return node.getComponent(cc.Label).string
        }
    },
    getLabelString (name) {
        return this.getLabelValue(name)
    },
    //设置多语言文本组件
    setLabelValue (name, value, ...values) {
        let node = this.getNode(name)
        if (node) {
            if (Common.OpenLanguage) {
                if (node.getComponent('LocalizedLabel')) {
                    node.getComponent('LocalizedLabel').dataID = value
                } else {
                    node.addComponent('LocalizedLabel').dataID = value
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
    //设置文本数字
    setNumberLabelValue (name, value) {
        let node = this.getNode(name)
        if (node) {
            node.getComponent(cc.Label).string = value            
        }        
    }, 
    //以节点名称移除节点从父节点
    removeNodeParent () {
        let node = this.getNode(name)
        if (node) {
            node.removeFromParent()
        }        
    },
})