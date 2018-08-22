var Sys = require('Sys')
cc.Class({
    extends : cc.Button,

    properties : {
        _touch : true
    },

    /**
     * 注册按钮事件
     * @param 按钮弹起触发事件
     * @param 按钮取消触发事件
     * @param 事件函数逻辑脚本
     * @param 按钮间隔时间
     */
    CreateEvent (cb, cancelCall, _target, disTime=0) {
        let self = this
        this.node.on(Sys.Touch_Begin, function () {
            self.node.scaleX = 1.1
            self.node.scaleY = 1.1
        })
        this.node.on(Sys.Touch_Cancel, function () {
            self.node.scaleX = 1
            self.node.scaleY = 1
            if (_target[cancelCall]) _target[cancelCall]()            
        })
        this.node.on(Sys.Touch_End, function () {
            self.node.scaleX = 1            
            self.node.scaleY = 1
            CusAudio.PlayButton()
            if (self._touch == false) return
            let that = self
            if (disTime != 0) {
                self._touch = false
                self.scheduleOnce(function () {
                    that._touch = true
                }, disTime);
            }
            if (_target[cb]) _target[cb]()
        })
    },
});