var BaseCtrl = require('BaseCtrl')
var Sys = require('../common/Sys')

class WechatCtrl extends BaseCtrl {

    constructor () {
        super('WechatCtrl')

        this._loginSuccess = null
        this._userWechat = null

        this.OpenGameShare()
    }

    /**
     * 直接开启游戏转发功能
     * @param title 转发标题
     */
    OpenGameShare (title='闲暇时间玩了这款游戏，深深迷住了，才玩了一会儿，就9999分了。想挑战我就来吧') {
        if (! Sys.IsWeChatGame) return
        wx.showShareMenu();
        wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
                title: title,
                // imageUrl : 'https://down.chinafjjdkj.com/game_game/shareImage.png'
            }
        })
    }

    /**
     * 微信小游戏检测登录
     * @param successCb 登录成功回调
     */
    WechatGameLogin (successCb) {
        if (! Sys.IsWeChatGame) return
        let self = this
        Com.info('微信小游戏登录')
        self._loginSuccess = successCb
        
        wx.getSetting({
            success (res) {
                Com.info('获取微信配置', res.authSetting)
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
                var authSetting = res.authSetting
                if (! authSetting.hasOwnProperty('scope.userInfo') || authSetting['scope.userInfo'] === false) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success : function (res) {
                            wx.getUserInfo({
                                success : function (res) {
                                    Com.info('登陆成功', res)
                                    self._userWechat = res
                                    if (self._loginSuccess) {
                                        self._userWechat = res
                                        self._loginSuccess()
                                    }
                                }
                            })
                        },
                        fail : function () {
                            wx.exitMiniProgram()
                        }
                    })
                } else {
                    self._wxgameLogin()
                }
                // if (authSetting['scope.userInfo'] === true) {
                //     // 用户已授权，可以直接调用相关 API
                // } else if (authSetting['scope.userInfo'] === false){
                //     // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                // } else {
                //     // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                    
                // }
            }
          })
    }

    /**
     * 微信小游戏直接登录
     */
    _wxgameLogin () {
        let self = this
         wx.login({
            success: function () {
                wx.getUserInfo({
                    fail: function (res) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success : function (res) {
                                if (self._loginSuccess) {
                                    self._userWechat = res
                                    self._loginSuccess()
                                }
                            },
                            fail : function () {
                                wx.exitMiniProgram()
                            }
                        })
                        Com.info('登录失败',res) 
                        // // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                        // if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                        //     // 处理用户拒绝授权的情况
                        //     console.log('拒绝登录',res)
                        // }
                    },
                    success : function (res) {
                        Com.info('登陆成功', res)
                        if (self._loginSuccess) {
                            self._userWechat = res
                            self._loginSuccess()
                        }
                    }
                })
            }
        })
    }

    /**
     * 微信小游戏分享转发
     * @param call 分享成功回调
     */
    WechatGameShare (call) {
        if (! Sys.IsWeChatGame) return
        Com.info('转发')
        wx.shareAppMessage({ 
            title: '闲暇时间玩了这款游戏，深深迷住了，才玩了一会儿，就9999分了。想挑战我就来吧',
            imageUrl : 'https://down.chinafjjdkj.com/game_game/shareImage.png',
            success: function (e) { 
                Com.info('ok')
                Com.info(e)
                if (call) {
                    Com.info('分享回调')
                    call()
                }
            }, 
            fail: function (e) { 
                Com.info(e)
            } 
        })
    }

    /**
     * 发送消息给子域
     * @param data
     * @example WechatCtrl.getInstance().SendMsgToSon({message : xxx})
     */
    SendMsgToSon (data) {
        if (! Sys.IsWeChatGame) return
        //消息加入用户信息
        data['user'] = this._userWechat
        // 发消息给子域
        Com.info('SendMsgToSon->', data)
        wx.postMessage(data)
    }

    /**
     * 获取子域ShareCanvas
     * @param tex texture2D对象
     * @returns texture2D对象
     */
    GetShareCanvas (tex) {
        if (! Sys.IsWeChatGame) return
        let openDataContext = wx.getOpenDataContext()
        let sharedCanvas = openDataContext.canvas
        tex.initWithElement(sharedCanvas)
        tex.handleLoadedTexture()
        return tex
    }

    /**
     * 用于子域监听主域消息--只可放在子域
     */
    onMessage () {
        if (! Sys.IsWeChatGame) return
        wx.onMessage(data => {
            console.log('主域消息--', data)
            switch (data.message) {
                case true:

                    break;
            }
        });
    }

    /**
     * 微信小游戏托管用户数据
     * @param data 要托管的数据 [{ key: 'score', value: score }],
     */
    SetUserCloudStorage (data) {
        if (! Sys.IsWeChatGame) return
        wx.setUserCloudStorage({
            KVDataList: data,
            success: res => {
                Com.info('托管成功', res)
                // // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                // let openDataContext = wx.getOpenDataContext();
                // openDataContext.postMessage({
                //     type: 'updateMaxScore',
                // });
            },
            fail: res => {
                Com.info('托管失败', res)
            }
        });
    }

    /**
     * 拉取当前用户所有同玩好友的托管数据（开放数据域使用）
     */
    GetFriendCloudStorage () {
        if (! Sys.IsWeChatGame) return
        wx.getFriendCloudStorage({
            keyList: ['score', 'maxScore'], // 你要获取的、托管在微信后台都key
            success: res => {
                console.log(res.data);
            }
        });
    }

    /**
     * 监听加速度数据
     */
    onAccelerometerChange () {
        if (! Sys.IsWeChatGame) return
        wx.onAccelerometerChange(function() {
            console.log(res.x)
            console.log(res.y)
            console.log(res.z)
        })
    }

    static _fctor
    static getInstance () {
        if (! this._fctor) {
            this._fctor = new WechatCtrl()
        } return this._fctor
    }
}

module.exports = WechatCtrl

