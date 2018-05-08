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
            this._getLabelObject(_node)
            this._registerButton(_node, comp)
            this.startAnalysis(_node)
            this._allNode[_node.name] = _node
        }
    },

    _getLabelObject (node) {
        let name = node.name
        let c = node.name.indexOf('_label_')
        if (c >= 0) {
            let name = Global.GetStrLen(node.name, 7)
            // this._labelData[name] = node.getComponent(cc.Label)
        }
    },

    _registerButton (node, comp) {
        let name = '_tap_' + node.name
        node.addComponent('ButtonClick').CreateEvent(name, comp)
        // this._buttonData[name] = node
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

    setLabelString (name, value) {
        let node = this.getNode(name)
        if (node) {
            if (Common.OpenLanguage) {
                node.getComponent('LocalizedLabel').dataID = value
            } else {
                node.getComponent(cc.Label).string = value
            }
        }
    },
})