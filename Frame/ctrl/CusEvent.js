
var CusEvent = cc.Class({
    extends : cc.Class,

    properties : {
        _event : null,
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
    },

    on (name, cb, self) {
        if (! this._event[name]) this._event[name] = {};
        if (! this._event[name]["cb"]) {
            this._event[name]["cb"] = [];
        }
        this._event[name]["cb"].push(cb);
        this._event[name]["target"] = self;
    },

    once (name, cb) {
    },

    emit (name, data) {
        if (this._event[name]) {
            for (let i in this._event[name]["cb"]) {
                if (this._event[name]["cb"][i]) {
                    let tar = this._event[name]["target"];
                    this._event[name]["cb"][i](data);
                    console.log('push ->', name);
                }
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
            console.warn("不存在该key订阅->", name);            
        }
    },
});

// window['Event'] = CusEvent.getInstance();