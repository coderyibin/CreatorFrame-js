/**
 * 额外小封装的音频类
 */
var CusAudio = cc.Class({
    extends : cc.Class,

    properties : {
        _audio : null,
        _backgroundMusic : null,
        _isPlay : null,//是否播放声音
        _volume : {
            type : cc.Integer,
            default : 1
        },
    },

    ctor () {
        this._audio = cc.audioEngine
        this._isPlay = true
    },

    /**
     * 当前音效是否打开
     */
    GetPlay () {
        return this._isPlay
    },

    /**
     * 设置是否开启音效
     */
    SetAudioPlay (open) {
        this._isPlay = open

        if (! open) {
            this.PauseAll()
        } else {
            this.ResumeAll()
        }
    },

    /**
     * 获取当前音量值
     * @return 音量值
     */
    GetVolume () {
        return this._audio.getVolume()
    },

    /**
     * 设置音量
     * @param {*} value 声音值
     */
    SetVolume (value) {
        this._volume = value
    },

    /**
     * 播放指定音频文件
     * @param 音频文件名称
     * @param 是否循环，默认false
     * @return 返回一个音频对象id
     */
    Play (name, loop=false) {
        if (! this._isPlay)  return
        return this._audio.play(name, loop, this._volume)
    },

    /**
     * 按钮音效
     * @param {*} name 默认寻找button名称的音效资源
     */
    PlayButton (name=RES.GetConfig().BUTTONMUSIC) {
        if (! this._isPlay)  return
        let res = RES.Get(name)
        if (res) {
            this._audio.play(res, false, this._volume)
        }
    },

    /**
     * 播放背景音乐
     * @param {*} name 文件名称 
     * @param {*} loop 是否循环
     */
    PlayMusic (name, loop=true) {
        if (! this._isPlay)  return
        if (this._backgroundMusic) {
            this.StopMusic()
        }
        this._backgroundMusic = this._audio.play(RES.Get(name), loop, this._volume)
    },

    /**
     * 停止播放背景音乐
     */
    StopMusic () {
        this._audio.stop(this._backgroundMusic)
    },

    /**
     * 停止所有音效音乐
     */
    StopAll () {
        this._audio.stopAll()
    },

    /**
     * 继续某个音效
     */
    Resume (audioId) {
        this._audio.resume(audioId)
    },

    /**
     * 继续所有音效
     */
    ResumeAll () {
        this._audio.resumeAll()
    },

    /**
     * 暂停某个音效
     * @param audioId 音效音乐id
     */
    Pause (audioId) {
        this._audio.pause(audioId)
    },

    /**
     * 暂停所有音效
     */ 
    PauseAll () {
        this._audio.pauseAll()
    }

    // statics : {
    //     _fctor : null,
    //     getInstance : function () {
    //         if (! this._fctor) {
    //             this._fctor = new Audio()
    //         } return this._fctor
    //     }
    // },
})

window['CusAudio'] = new CusAudio()