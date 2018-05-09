var Common = require("Common")
const i18n = require('LanguageData')
var Global = require('Global')

var Analysis = cc.Class({
    extends : cc.class,

    properties : {
        _allNode : null,
        _uis : null,
        _valus : null,
        _uival : null,
    },

    ctor () {
        this._allNode = {}
        i18n.init(Common.DefaultLanguage);
    },

    startAnalysis (node, comp) {
        for (let i in node.children) {
            let _node = node.children[i]
            this._registerButton(_node, comp)
            this.startAnalysis(_node)
            this._allNode[_node.name] = _node
        }
    },

    _registerButton (node, comp) {
        let name = '_tap_' + node.name
        node.addComponent('ButtonClick').CreateEvent(name, comp)
    },

    getNode(name) {
        let node = this._allNode[name]
        if (! node) {
            console.error(name + ':node not found')
            return null
        }
        return node
    },

    getLabelString(name) {
        let node = this.getNode(name)
        if (node) {
            return node.getComponent(cc.Label).string
        }
    },

    setLabelString (name, value, ...values) {
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
})