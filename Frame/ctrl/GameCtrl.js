var GameData = require('../../Frame/module/GameData')
var Common = require('../../Frame/common/Common')
var BaseCtrl = require('../ctrl/BaseCtrl')
var ItemCtrl = require('../../Game/Ctrl/ItemCtrl')
var EquipmentCtrl = require('../../Game/Ctrl/EquipmentCtrl')
var HeroCtrl = require('../../Game/Ctrl/HeroCtrl')
var PackCtrl = require('.././../Game/Ctrl/PackCtrl')

const i18n = require('LanguageData')

class GameCtrl extends BaseCtrl {

    _gameData = new GameData

    constructor () {
        super('GameCtrl')
        
        this._gameData = new GameData()
        this.SetAudio(this.GetAudio())
    }

    /**
     * 初始化游戏一些配置,进入游戏
     */
    InitGameConfig () {
        Com.info('After the start of a game some initialization')
        this.initGameCtrl()

        //道具初始化
        ItemCtrl.getInstance()
        //装备初始化
        EquipmentCtrl.getInstance()
        //初始化玩家英雄
        HeroCtrl.getInstance()
        //初始化玩家背包
        PackCtrl.getInstance()
    }

    /**
     * 进入游戏之前的一些配置
     */
    InitGameBeforeConfig () {
        Com.info('Some of the initialization before the start of the game')
        //多语言配置
        if (Common.OpenLanguage == true) {
            Com.warn('开启多语言')
            i18n.init(Common.DefaultLanguage);
        }
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
     * 游戏登陆
     * @param {*} data 
     * @param {*} cb 
     */
    Login (data, cb) {
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
        this._event.emit('runScene', {scene : Common.SceneName.SceneGame})
        UserCtrl.getInstance().LoginData(this._account, this._password)
        UserCtrl.getInstance().InitUser(data)
        //关闭断线连接提示框
        this._event.getInstance().emit('NetClose')
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
    }

    /**
     * 清理游戏所有数据
     */
    Clear () {
        // this._gameData.ClearLocalKey()
        // cc.game.restart()
    }

    static _fctor

    static getInstance () {
        if (! this._fctor) {
            this._fctor = new GameCtrl()
        } return this._fctor
    }
}

module.exports = GameCtrl