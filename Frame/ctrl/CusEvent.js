
var CusEvent = cc.Class({
    extends : cc.Class,

    properties : {
        _event : null,
        _once : null
    },

    statics : {
        _fctor : null,
        getInstance () {
            if (! this._fctor) {
                this._fctor = new CusEvent()
            } return this._fctor
        }
    },

    ctor () {
        this._event = {};
        this._once = []
    },

    /**
     * 注册事件
     * @param {*} name 事件名称
     * @param {*} cb 事件回调函数
     * @param {*} self 注册的脚本对象
     */
    on (name, cb, self) {
        // Com.info('join event->', name)
        if (! this._event[name]) this._event[name] = {};
        if (! this._event[name]["cb"]) {
            this._event[name]["cb"] = [];
        }
        this._event[name]["cb"].push(cb);
        this._event[name]["target"] = self;
    },

    /**
     * 注册单次事件
     * @param {*} name 事件名称
     * @param {*} cb 事件回调函数
     * @param {*} self 注册的脚本对象
     */
    once (name, cb, self) {
        this.on(name, cb, self)
        this._once.push(name)
    },

    emit (name, data) {
        if (this._event[name]) {
            for (let i in this._event[name]["cb"]) {
                if (this._event[name]["cb"][i]) {
                    let tar = this._event[name]["target"];
                    Com.info('push ->', name);
                    this._event[name]["cb"][i](data);
                }
            }
            //如果是单次事件，则触发后立即移除
            if (this._once.indexOf(name) >= 0) {
                this.un(name)
            }
        } else {
            console.warn("不存在该key订阅->", name);
        }
    },

    un (name) {
        if (this._event[name]) {
            console.log("remove->", name);
            delete this._event[name];
        } else {
            // console.warn("不存在该key订阅->", name);            
        }
    },
});

window['CusEvent'] = CusEvent