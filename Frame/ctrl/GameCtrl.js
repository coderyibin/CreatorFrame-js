var GameData = require('GameData')
var Common = require('Common')
const i18n = require('LanguageData')

var GameCtrl = cc.Class({
    extends : cc.Class,

    properties : {
        _gameData : null,
    },

    ctor () {
        Com.info('初始化游戏控制器')
        this._gameData = new GameData()
        this.SetAudio(this.GetAudio())
    },

    /**
     * 初始化游戏一些配置
     */
    InitGameConfig () {
        //多语言配置
        if (RES.GetConfig().OPENLANGUAGE == true) {
            Com.info('开启多语言')
            i18n.init(RES.GetConfig().DEFAULTLANGUAGE);
        }
    },

    /**
     * 设置声音状态
     * @param open 是否开启
     */
    SetAudio (open) {
        CusAudio.SetAudioPlay(open)
        this._gameData.SetAudio(open)
    },

    /**
     * 获取声音状态
     */
    GetAudio () {
        return this._gameData.GetAudio()
    },

    statics : {
        _fctor : null,
        getInstance : function () {
            if (! this._fctor) {
                this._fctor = new GameCtrl()
            } return this._fctor
        }
    }
})