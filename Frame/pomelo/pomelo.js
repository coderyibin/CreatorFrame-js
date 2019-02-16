var Common = require('../common/Common')
var Event = require('CusEvent')
var Pomelo = cc.Class({
    extends : cc.Class,

    ctor () {
    },

    _on () {
        //初始化pomelo几个监听器
        pomelo.on('onServer', function (data) {
            let code = data.Code || data.code
            Com.info('listener:', code, '-->', data.data)
            Event.getInstance().emit(code, data.data)
            Event.getInstance().emit('onRemoveNetLoading')
        })
        pomelo.on('heartbeat timeout', function () {
            Event.getInstance().emit('sockieClose')
        })
        pomelo.on('disconnect', function () {
            Event.getInstance().emit('onMsg', {
                layer : Common.SceneName.Msg_Window,
                content : '网络已断开，请重新登录'
            })
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
            } else if (data.code == 201) {//弹窗错误提示
                Event.getInstance().emit('onMsg', {content : data['msg'], layer : 'Msg_Window'})
            } else {
                if (data['Code']) {
                    Event.getInstance().emit('onMsg', {layer : 'Msg_Window', content : /*data['Code']*/data['msg']})
                } else {
                    Event.getInstance().emit('onMsg', {content : data['msg'] || "SERVERERROR", layer : 'Msg_Window'})                    
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

window['Pomelo'] = module.exports = new Pomelo()