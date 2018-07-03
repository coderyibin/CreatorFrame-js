var BaseScene = require('BaseScene')
var Common = require('Common')

var BaseLoading = cc.Class({
    extends : BaseScene,

    properties : {
        manifestUrl : {
            default : null,
            tooltip : "本地的热更新配置文件",
            url : cc.RawAsset
        },
        Progress_Sleep : {
            default : null,
            tooltip : "加载文件进度条",
            type : cc.ProgressBar
        },
    },

    onLoad () {
        this._super()
        //设置是否显示帧率
        cc.director.setDisplayStats(Common.IsShowFPS);
        if (! this._isNative()) {//直接进行网页h5

            this._fLoadRes();  

        } else {//检查更新
            if (Common.IsHotUpdate) this._fCheckUpdate();
        }
    },

    //显示更新弹窗
    showUpdateTip () {
        // RES.loadRes("StartGame/Prefab/Tip_Update", ()=>{
        //     // this.showLayer(MODULE.UPDATE, {cb : this.hotUpdate.bind(this)});
        // });
    },

    _loadResCfgJson (cb) {
        let self = this
        RES.loadJson("resources", (res)=>{
            let r = []
            for (let i in res) {
                r = r.concat(res[i] || [])
            }
            if (r.length == 0) {this._comeInGame(cb);return}
            RES.loadArray(r, function (index, len, res) {
                if (self['progress']) {
                    self.progress(index, len, res);
                } else {
                    Com.warn('该子类未实现progress函数');
                }
            }, function () {
                self._comeInGame(cb);
            });
        });
    },

    _comeInGame (cb) {
        this.setProgressValue('progress', 1)
        this.setLabelValue('jindu', 'JINDUWANCHENG')
        this._runScene(Common.SceneName.SceneLogin)
    },

    //h5 直接加载资源
    _fLoadRes (cb) {
        this._loadResCfgJson(cb);
    },
    //检查更新
    _fCheckUpdate () {
    }
})