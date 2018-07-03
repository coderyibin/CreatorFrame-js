cc.Class({
    extends : cc.Button,

    properties : {
        _touch : true
    },

    CreateEvent (cb, _target) {
        let self = this
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            self.node.scaleX = 1.1
            self.node.scaleY = 1.1
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            self.node.scaleX = 1
            self.node.scaleY = 1
        })
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            self.node.scaleX = 1            
            self.node.scaleY = 1
            if (self._touch == false) return
            self._touch = false
            let that = self
            self.scheduleOnce(function () {
                that._touch = true
            });
            if (_target[cb]) _target[cb]()
        })
    },
});