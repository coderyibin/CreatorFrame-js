var GameData = require('../../Frame/module/GameData')
var Common = require('../../Frame/common/Common')
var CusAudio = require('../common/CusAudio')
var BaseCtrl = require('../ctrl/BaseCtrl')
var CusEvent = require('../ctrl/CusEvent')
var Sys = require('../common/Sys')
var Http = require('../common/Http')

/****************不同游戏的控制器****************************/
/****************不同游戏的控制器****************************/


const i18n = require('LanguageData')

class GameCtrl extends BaseCtrl {

    _gameData = new GameData

    constructor () {
        super('GameCtrl')
        
        this._gameData = new GameData()
        this.SetAudio(this.GetAudio())
        this._nRoundScore = null
        //登录成功跳转的场景
        this._sLoginScene = ''
        // //获取ip
        // this.GetIP()

        //http数据的链接地址
        this._sHttp = ''

        //winSize
        this._sizeWinSize = null
        //framwSize
        this._sizeFrameSize = null

        this.InitGameBeforeConfig()
    }

    /**
     * 初始化游戏一些配置,进入游戏
     */
    InitGameConfig () {
        Com.info('After the start of a game some initialization')
        this.initGameCtrl()

        //初始化各个控制器
        /*********这边根据不同的游戏进行更改*****************/
        /*********这边根据不同的游戏进行更改*****************/

        //重设设备id
        let sign = this.GetDeviceInfo()
        if (sign)
        {
            GamePlatform.getInstance().SetDeviceSign(sign)
        }

        //输出分辨率信息
        this._sizeWinSize = cc.director.getWinSizeInPixels()
        this._sizeFrameSize = cc.view.getFrameSize()
        Com.info('可视区域大小 FrameSize：', this._sizeFrameSize)
        Com.info('视图大小 WinSize：', this._sizeWinSize)
    }

    /**
     * 获取WinSize 分辨率大小-像素
     */
    GetWinSize () {
        return this._sizeWinSize
    }

    /**
     * 获取FrameSize 实际物理大小
     */
    GetFrameSize () {
        return this._sizeFrameSize
    }

    /**
     * 进入游戏之前的一些配置
     */
    InitGameBeforeConfig () {
        Com.info('Some of the initialization before the start of the game')
        //多语言配置
        if (Common.OpenLanguage == true) {
            Com.warn('开启多语言')
            i18n.init('Chinese');
        }

        this._logTargetPlatform()
    }

    /**
     * 输出目标平台信息
     */
    _logTargetPlatform () {
        if (Sys.IsWeChatGame) {
            Com.info('cur platform is WechatGame')
            return
        }
        //输出目标平台信息
        switch (Sys.Platform.OS) {
            case Sys.Platform.ANDROID :
            Com.info('cur platform is Android')
            break
            case Sys.Platform.IOS :
            Com.info('cur platform is iOS')
            break
            case Sys.Platform.WECHATGAME :
            Com.info('cur platform is WechatGame')
            break
            case Sys.Platform.WINDOWS :
            Com.info('cur platform is Windows')
            break
            default : 
            Com.info('other platform')
            break
        }
    }

    /**
     * 设置http服务器的链接地址
     * @param link 地址
     */
    SetHttpAddress (link) {
        this._sHttp = link
    }

    /**
     * 获取Http服务器链接地址
     */
    GetHttpAddress () {
        return this._sHttp
    }

    /**
     * 获取本机IP
     */
    GetIP () {
        new Http().Get('http://2019.ip138.com/ic.asp', function (res) {
            Com.info(res)
        })
    }

    /**
     * 设置语言
     */
    SetLanguage (key) {
        Common.DefaultLanguage = key
        i18n.init(Common.DefaultLanguage);
        this._gameData.SetLanguage(key)
    }

    /**
     * 设置声音状态
     * @param open 是否开启
     */
    SetAudio (open) {
        CusAudio.SetAudioPlay(open)
        this._gameData.SetAudio(open)
    }

    /**
     * 获取声音状态
     */
    GetAudio () {
        return this._gameData.GetAudio()
    }

    /**
     * 获取设备注册情况
     */
    GetDeviceInfo () {
        return this._gameData.GetDeviceSign()
    }

    /**
     * 更新设备注册情况
     */
    SetDeviceInfo (info) {
        this._gameData.UpdateDeviceSign(info)
    }

    /**
     * 设置设备信息
     */
    SetDeviceSign (sign) {
        GamePlatform.getInstance().SetDeviceSign(sign)
        this.SetDeviceInfo(true)
    }

    /**
     * 获取设备信息
     */
    GetDeviceSign () {
        return this._gameData.GetDeviceIdSign()
    }

    /**
     * 游戏登陆
     * @param {*} data 
     * @param {*} cb 
     */
    Login (data, cb) {
        // this._sLoginScene = data.scene || ''
        if (cb) {
            this._sLoginScene = cb
        } else {
            Com.error('登录回调函数不能是空')
            return
        }
        this._account = data.account
        this._password = data.password
        switch (data.type) {
            case 'account' :
                this.AccountLogin(data.account, data.password)
            break;
            default :
                Com.error('登陆方式错误')
            break
        }
    }

    AccountLogin (account, password) {
        let self = this
        let login = function (info) {
            let _d = {
                account : account,
                password : password
            }
            Pomelo.Request(Common.Routes.Login, _d, self.Success.bind(self))
        }
        Pomelo.InitPomelo(login.bind(self))
    }

    Register (data, cb) {
        let self = this
        self._account = data.account
        self._password = data.password
        let register = function (info) {
            Pomelo.Request(Common.Routes.Register, data, self.Success.bind(self))
        }
        Pomelo.InitPomelo(register.bind(self))
    }

    //登陆/注册成功
    Success (data) {
        // UserCtrl.getInstance().LoginData(this._account, this._password)
        UserCtrl.getInstance().InitUser(data)
        this._gameData.SetLogin({account : this._account, password : this._password})
        //关闭断线连接提示框
        this._event.emit('NetClose')
        // this._event.emit('runScene', {scene : this._sLoginScene})
        if (this._sLoginScene) this._sLoginScene()
    }

    //初始化游戏控制器
    initGameCtrl () {
        Com.info('----------开始初始化游戏控制器--------')
        let self = this
        self._event.on('sockieClose', function () {
            self._event.emit('onMsg', {content : 'NETCLOSE', select : 'NONE', node : 'NetClose'})
            let data = {
                account : self._account,
                password : self._password,
                type : 'account'
            }
            self.Login(data)
        })

        //初始化音效
        CusAudio.InitAudio(RES.GetConfig().BGMUSIC)
    }

    /***************其他游戏的一些函数******************************/
    /**
     * 获取玩家存档名称
     */
    GetArchiveName () {
        return this._gameData.GetArchiveName()
    }

    /**
     * 设置玩家存档名称
     */
    SetArchiveName (name) {
        this._gameData.SetArchiveName(name)
    }
	
	/**
     * 设置玩家本局分数
     * @param score 分数
     */
    SetRoundScore (score) {
        this._nRoundScore = score
    }

    /**
     * 获取本局分数
     */
    GetRoundScore () {
        return this._nRoundScore
    }

    /**
     * 获取玩家最高分
     */
    GetMaxScore () {
        let score = this._gameData.GetMaxScore()
        return Number(score)
    }

    /**
     * 更新玩家最高分
     * @param score 分数
     */
    SetMaxScore (score) {
        let _score = this.GetMaxScore()
        if (score > _score) {
            this._gameData.SetMaxScore(score)
        }
    }

    /**
     * 获取是否已经选择默认语言标志
     */
    GetDefaultLanguage () {
        return this._gameData.GetDefaultLanguage()
    }

    /**
     * 更新是否已经选择默认语言标志
     * @param bool 是否选择
     */
    SetDefaultLanguage (bool) {
        this._gameData.SetDefaultLanguage(bool)
    }
    /***************其他游戏的一些函数******************************/

    /**
     * 清理游戏所有数据
     */
    Clear () {
        // this._gameData.ClearLocalKey()
        // cc.game.restart()
        Com.warn('清理游戏数据')
        CusEvent.getInstance().unAll()
    }

    static _fctor

    static getInstance () {
        if (! this._fctor) {
            this._fctor = new GameCtrl()
        } return this._fctor
    }
}

module.exports = GameCtrl