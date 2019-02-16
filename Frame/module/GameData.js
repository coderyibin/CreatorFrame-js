var BaseData = require('../module/BaseData')
var Common = require('../common/Common')

class GameData extends BaseData {
    _languageKey = this._projectName + '_Language'
    _registerDeviceKey = this._projectName + '_Device'
    _playNameKey = this._projectName + '_SaveName'
    _audioKey = this._projectName + '_Audio'
    _loginKey = this._projectName + '_Login'
    _selectDefaultLanguageKey = this._projectName + '_SelectDefaultLanguage'

    constructor () {
        super()

        this._audio = null
        this._language = ''
        this._isDeviceSign = false
        this._archiveName = null
        this._deviceSign = null
        this._playerLoginData = null
        this._selectDefaultLanguage = null

        this._initLanguage()
        this._initDeviceInfo()
        this._initArchiveName()
        this._initLoginData()
        this._initSelectDefaultLanguage()
    }

    /**
     * 初始化多语言
     */
    _initLanguage () {
        let l = this.GetLocalNormal(this._languageKey)
        if (! l) {
            this._language = Common.DefaultLanguage
            return 
        }
        this._language = Common.DefaultLanguage = l
    }

    /**
     * 是否已经选择默认语言
     */
    _initSelectDefaultLanguage () {
        let l = this.GetLocalNormal(this._selectDefaultLanguageKey)
        if (! l) {
            this._selectDefaultLanguage = false
            return 
        }
        this._selectDefaultLanguage = l == 'true' ? true : false
    }

    /**
     * 初始化设备注册信息
     */
    _initDeviceInfo () {
        let is = this.GetLocalNormal(this._registerDeviceKey)
        if (! is) {
            // this.UpdateDeviceSign(false)
            return
        }
        this.UpdateDeviceSign(is)
        this._deviceSign = is
    }

    /**
     * 初始化用户存档名称
     * @param {*} key 
     */
    _initArchiveName () {
        let is = this.GetLocalNormal(this._playNameKey)
        if (! is) {
            this._archiveName = null
            return
        }
        this._archiveName = is
    }

    /**
     * 初始化登录数据
     */
    _initLoginData () {
        let data = this.getLocalData(this._loginKey)
        if (! data || data == undefined) {
            data = {}
            this.setLocalData(this._loginKey, data)
        }
        this._playerLoginData = data
    }

    /**
     * 设置多语言
     */
    SetLanguage (key) {
        this._language = key
        this.SetLocalNormal(this._languageKey, this._language)
    }

    /**
     * 设置声音
     * @param {*} open 是否开启bool值
     */
    SetAudio (open) {
        this._audio = open
        this.SetLocalNormal(this._audioKey, open)
    }

    /**
     * 获取游戏声音状态
     * @return bool 开启状态
     */
    GetAudio () {
        if (this._audio == null) {
            this._audio = this.GetLocalNormal(this._audioKey) || true
            if (typeof this._audio == 'string' && this._audio.constructor == String) {
                if (this._audio == 'false') {
                    this._audio = false
                } else {
                    this._audio = true                    
                }
            }
        } return this._audio
    }

    /**
     * 获取设备是否注册信息
     */
    GetDeviceSign () {
        return this._isDeviceSign
    }

    /**
     * 更新设备注册信息
     * @param bool 是否注册
     */
    UpdateDeviceSign (bool) {
        this._isDeviceSign = bool
    }

    /**
     * 设置设备信息
     */
    SetDeviceSign (sign) {
        this._deviceSign = sign
        this.SetLocalNormal(this._registerDeviceKey, sign)
    }

    /**
     * 获取设备信息
     */
    GetDeviceIdSign () {
        return this._deviceSign
    }

    /**
     * 获取用户存档名称
     */
    GetArchiveName () {
        return this._archiveName
    }

    /**
     * 更新用户存档名称
     */
    SetArchiveName (name) {
        this.SetLocalNormal(this._playNameKey, name)
        this._archiveName = name
    }

    /**
     * 保存玩家登录数据
     * @param data 登录数据
     */
    SetLogin (data) {
        this._playerLoginData = data
        this.setLocalData(this._loginKey, data)
    }

    /**
     * 获取玩家登录数据
     */
    GetLogin () {
        return this._clone(this._playerLoginData)
    }

    /**
     * 获取是否已经选择默认语言标志
     */
    GetDefaultLanguage () {
        return this._selectDefaultLanguage
    }

    /**
     * 更新是否已经选择默认语言标志
     * @param bool 是否选择
     */
    SetDefaultLanguage (bool) {
        this._selectDefaultLanguage = bool
        this.SetLocalNormal(this._selectDefaultLanguageKey, bool)
    }

    Clear () {
        this.ClearLocalKey()
    }
}

module.exports = GameData