class CusAction {
    constructor () {}

    /**
     * 重复指定次数的动作
     * @param 执行动作的节点
     * @param 执行动作的次数
     * @param ...action 动作数据
     */
    ForeverCount (node, count, ...actions) {
        if (count < 1) {
            return Com.error('动作次数不能小于1')
        }
        node.runAction(cc.repeat(cc.sequence(...actions), count))
    }

    /**
     * 永远重复执行动作
     * @param node 执行动作节点
     * @param ...action 动作数据
     */
    Forever (node, ...action) {
        node.runAction(cc.repeatForever(...action))
    }

    /**
     * 同步执行动作
     * @param node 执行动作节点
     * @param ...values 动作数据
     */
    Spawn (node, ...values) {
        var action = cc.spawn(...values);

        node.runAction(action)
    }

    /**
     * 顺序执行动作
     * @param node 执行动作节点
     * @param ...values 动作数据
     */
    Sequence (node, ...values) {
        var action = cc.sequence(...values);

        node.runAction(action)
    }
}

module.exports = CusAction