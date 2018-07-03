var Common = require('Common')
var Event = require('CusEvent')
var Pomelo = cc.Class({
    extends : cc.Class,

    ctor () {
    },

    _on () {
        pomelo.on('onServer', function (data) {
            Event.getInstance().emit('onRemoveNetLoading')
            let code = data.Code
            Event.getInstance().emit(code, data.data)
        })
        pomelo.on('heartbeat timeout', function () {
            Event.getInstance().emit('sockieClose')
        })
    },

    InitPomelo (cb) {
        let self = this
        self._on()
        pomelo.init({
            host : RES.getConfig().GAMESERVERIP,
            port : RES.getConfig().GAMESERVERPORT
        }, function () {
            var route = Common.Routes.PomeloInit;
            self.Request(route, {}, function (data) {
                let host = data.host
                let port = data.port
                pomelo.disconnect(function () {
                    Com.info('断开链接')
                    pomelo.init({host : host, port : port}, function (data) {
                        Com.info('init ok')
                        if (cb) cb() 
                    })
                })
            })
        });
    },

    Request (route, data, cb) {
        Com.info('client -->', route, data)
        if (! route) return
        Event.getInstance().emit('onNetLoading')
        pomelo.request(route, data, function (data) {
            Event.getInstance().emit('onRemoveNetLoading')
            if (data.code == 200) {
                Com.info('server call -->', data.data)
                if (cb) cb(data.data)
            } else {
                if (data['Code']) {
                    Event.getInstance().emit('onMsg', {content : data['Code']})
                } else {
                    Event.getInstance().emit('onMsg', {content : "SERVERERROR"})                    
                }
            }
        })
    },

    Notify (route, data={}) {
        Com.info('notify -->', route, data)
        if (! route) return
        Event.getInstance().emit('onNetLoading')
        pomelo.notify(route, data)        
    },
})

window['Pomelo'] = new Pomelo()