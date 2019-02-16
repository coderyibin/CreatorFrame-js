var Common = require('../../Frame/common/Common')

class MsgText {

    /**
     * 创建一个飘的文字
     * @param {*} parent 父节点
     * @param {*} text 内容
     * @param {*} color 颜色
     */
    static Create (parent, text, color=new cc.Color(255, 255, 255)) {
        let node = new cc.Node()
        node.color = color
        parent.addChild(node)
        let comp = node.addComponent(cc.Label)
        if (Common.OpenLanguage) {
            node.addComponent('LocalizedLabel').dataID = text
        } else {
            comp.string = text
        }
        return node
    }
}

module.exports = MsgText