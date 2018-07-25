var Sys = require('Sys')
var Global = require('Global')

var TouchMgr = cc.Class({
    extends : cc.Class,

    /**
     * 注册单击事件
     * @param {*} comp 需要注册的脚本组件
     */
    RegisterTouchNromal (comp) {
        let start = null
        comp.node.on(Sys.Touch_Begin, function (e) {
            let pos = e.touch.getLocation()
            start = comp._startPos = pos
            if (comp["OnTouchBegin"]) comp["OnTouchBegin"](pos)
        }, comp)
        comp.node.on(Sys.Touch_Cancel, function (e) {
            if (comp["OnTouchCancel"]) comp["OnTouchCancel"](e.touch.getLocation())
        }, comp)
        comp.node.on(Sys.Touch_End, function (e) {
            let pos = e.touch.getLocation()
            if (comp["OnTouchEnd"]) comp["OnTouchEnd"](start, pos)
        }, comp)
        comp.node.on(Sys.Touch_Move, function (e) {
            let pos = e.touch.getLocation()
            if (comp["OnTouchMove"]) comp["OnTouchMove"](start, pos)
        }, comp)
    },

    /**
     * 注册摇杆事件
     * @param 需要注册的节点
     * @param pos node节点原来的坐标
     * @param dis node节点最大的移动距离
     * @param event 点击事件回调
     * @param event 移动事件回调
     * @param event 操作结束事件回调
     */
    RockerTouch (node, pos, dis, startCall, moveCall, endCall) {
        let start = null
        let touch = false
        let self = this
        node.on(Sys.Touch_Begin, function (e) {
            touch = true
            start = e.touch.getLocation()
            if (startCall) startCall(start)
        }, node)
        node.on(Sys.Touch_Move, function (e) {
            if (! touch) return
            let move = e.touch.getLocation()
            let cusPos = move
            cc.pSubIn(move, start)
            let angle = Math.atan2((move.y - pos.y), (move.x - pos.x)) //弧度  0.6435011087932844
            let theta = angle*(180/Math.PI); //角度  36.86989764584402
            if (cc.pDistance(move, pos) >= dis) {
                move = self.getNewPoint(pos, theta, dis)
            }
            node.position = move

            let dir = Tools.GetSub(cusPos, pos)
            dir = Tools.GetNormalize(dir)
            // let vecDir = Global.GetVectorRadians(vec.x, vec.y, 1, 0)
            if (moveCall) {
                //当前点击的位置 摇杆角度 摇杆方位
                moveCall(cusPos, theta, dir)
            }
        }, node)
        node.on(Sys.Touch_End, function (e) {
            node.position = pos
            if (endCall) endCall()
        }, node)
        node.on(Sys.Touch_Cancel, function (e) {
            node.position = pos
            if (endCall) endCall()
        }, node)
    },

    //获取摇杆最大的距离的坐标
    getNewPoint (pointB ,angle ,bevel) {
        //换算过程中先将角度转为弧度
        let radian = angle * Math.PI / 180; 
        let xMargin = Math.cos(radian) * bevel;
        let yMargin = Math.sin(radian) * bevel;
        return cc.v2(pointB.x + xMargin, pointB.y + yMargin);
    }
})