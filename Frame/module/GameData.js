var BaseData = require('../module/BaseData')
var Common = require('../common/Common')

class GameData extends BaseData {

    constructor () {
        super()

        this._audio = null
    }

    /**
     * 设置声音
     * @param {*} open 是否开启bool值
     */
    SetAudio (open) {
        this._audio = open
        this.SetLocalNormal(Common.LocalKey.Audio, open)
    }

    /**
     * 获取游戏声音状态
     * @return bool 开启状态
     */
    GetAudio () {
        if (this._audio == null) {
            this._audio = this.GetLocalNormal(Common.LocalKey.Audio) || true
            if (typeof this._audio == 'string' && this._audio.constructor == String) {
                if (this._audio == 'false') {
                    this._audio = false
                } else {
                    this._audio = true                    
                }
            }
        } return this._audio
    }

    Clear () {
        this.ClearLocalKey()
    }
}

module.exports = GameData