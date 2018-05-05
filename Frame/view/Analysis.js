var Analysis = cc.Class({
    extends : cc.class,

    properties : {
        _uis : null,
        _valus : null,
        _uival : null,
    },

    ctor () {
    },

    startAnalysis (node, comp) {
        for (let i in node.children) {
            let _node = node.children[i]
            this._getLabelObject(_node)
            this._registerButton(_node, comp)
            this._getAllNodeRegisterButton(_node)
        }
    },

    _getLabelObject (node) {
        let name = node.name
        let c = node.name.indexOf('_label_')
        if (c >= 0) {
            let name = Global.GetStrLen(node.name, 7)
            this._labelData[name] = node.getComponent(cc.Label)
        }
    },

    _registerButton (node, comp) {
        let name = '_tap_' + node.name
        node.addComponent('ButtonClick').CreateEvent(name, comp)
        this._buttonData[name] = node
    },
})