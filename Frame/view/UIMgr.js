var Analysis = require('./UIAnalysis')

cc.Class({
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

        _allNode : null,//所有节点缓存
        _analysis : null,//ui解析类
    },

    onLoad () {

        if (this.UiCache === 0) {
            //解析UI
            let analysis = new Analysis(this)
            this._allNode = analysis.GetNodes()
            this._analysis = analysis
        }
    },

    /**
     * 获取节点
     * @param name 节点名称
     * @return 返回一个节点对象
     */
    GetNode (name) {
        if (name instanceof cc.Node) {
            return name
        }
        let n = this._allNode[name]
        if (! n) {
            return Com.error('不存在该节点对象:', name)
        } return n
    },

    /**
     * 获取节点组件
     * @param node 节点对象或者节点名称
     * @param comp 组件名称
     * @return 组件对象
     */
    GetNodeComp (node, comp) {
        let _node = this.GetNode(node)
        if (! _node) {
            return Com.error('要获取的组件的所依赖的节点不能为空:', node)
        }
        let _comp = _node.getComponent(comp)
        if (! _comp) {
            return Com.error('该 ' + node + '节点下不存在组件名称: ', comp, '的对象')
        }
        return _comp
    }
})