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
        RES.loadJson("resources", (res)=>{
            let r = res.common;
            r = r.concat(res.config);
            r = r.concat(res.mp3);
            if (r.length == 0) this._comeInGame(cb);
            RES.loadArray(r, (index, len, res)=>{
                if (this['progress']) {
                    this.progress(index, len, res);
                } else {
                    console.warn('该子类未实现progress函数');
                }
            }, ()=>{
                // this._runScene(SCENE_NAME.LOGIN_SCENE);
                this._comeInGame(cb);
            });
        });
    },

    _comeInGame (cb) {
        this.Progress_Sleep.progress = 1;
        if (this['load_cb']) this['load_cb']()
    },

    //h5 直接加载资源
    _fLoadRes (cb) {
        this._loadResCfgJson(cb);
    },
    //检查更新
    _fCheckUpdate () {
    }

    // OnInitValue () {

    // },

    // OnInitUi () {

    // },
})