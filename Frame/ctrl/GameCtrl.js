var GameData = require('GameData')
var Common = require('Common')

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