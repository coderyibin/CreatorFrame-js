var Sys = require('../common/Sys')

/**
 * ui 解析类
 * @example new UI(要解析的节点)
 */
class UI {
    constructor (script) {
        this._script = script
        this._allNode = {}
        
        this._start(cc.find("Canvas"))
    }

    /**
     * 开始解析UI
     */
    _start (node) {
        for (let i in node.children) {
            let _node = node.children[i]
            this._allNode[_node.name] = _node
            if (! this._registerButton(_node)) {

            }
            this._start(_node)
        }
    }

    /**
     * 注册按钮
     * @param node 注册按钮事件的节点
     */
    _registerButton (node) {
        let name = '_tap_' + node.name
        let self = this
        if (this._script[name]) {
            node.on(Sys.Touch_End, function () {
                self._script[name]()
            })
            return true
        } return false
    }

    GetNodes () {
        return this._allNode
    }

}

module.exports = UI