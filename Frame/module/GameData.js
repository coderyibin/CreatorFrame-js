var BaseData = require('BaseData')
var Common = require('Common')

var GameData = cc.Class({
    extends : BaseData,

    properties : {
        _audio : null,

    },

    ctor () {
        this._audio = null
    },

    /**
     * 设置声音
     * @param {*} open 是否开启bool值
     */
    SetAudio (open) {
        this._audio = open
        this.SetLocalNormal(Common.LocalKey.Audio, open)
    },

    /**
     * 获取游戏声音状态
     * @return bool 开启状态
     */
    GetAudio () {
        if (this._audio == null) {
            this._audio = this.GetLocalNormal(Common.LocalKey.Audio) || true
        } return this._audio
    },

})