var BaseScene = require('BaseScene')
var Common = require('Common')
var GameCtrl = require('GameCtrl')

var BaseLoading = cc.Class({
    extends : BaseScene,

    properties : {
        manifestUrl : {
            default : null,
            tooltip : "本地的热更新配置文件",
            url : cc.RawAsset
        },
        HotUpdate : {
            default : null,
            tooltip : "热更新资源弹窗",
            type : cc.Prefab
        },
        _hotUpdateComp : null,//热更新弹窗脚本
        _gameScene : '',
        _gameCtrl : null,
        _storagePath : '',
        _checkListener : null,
        _updating : null,
        _canRetry : null,
        _updateListener : null,
        _am : null,
        _versionCompareHandle : null,
    },

    onLoad () {
        this._super()
        // this.manifestUrl = null
        //设置是否显示帧率
        cc.director.setDisplayStats(Common.IsShowFPS);
        this._gameScene = Common.SceneName.SceneLogin
        
        //初始化热更新弹窗，如果有的话
        if (this.HotUpdate) {
            let hot = cc.instantiate(this.HotUpdate)
            this.HotUpdate = hot
            this._hotUpdateComp = hot.getComponent(hot.name)
        }

        this.OnInit()
        if (! this._isNative()) {//直接进行网页h5

            this._fLoadRes();  

        } else {//检查更新
            if (Common.IsHotUpdate) this._fCheckUpdate();
            else this._loadResCfgJson()
        }
    },

    /**
     * 初始化一些数据。在start之前执行
     */
    OnInit () { },

    //显示更新弹窗
    showUpdateTip () {
        // RES.loadRes("StartGame/Prefab/Tip_Update", ()=>{
        //     // this.showLayer(MODULE.UPDATE, {cb : this.hotUpdate.bind(this)});
        // });
        Com.info('显示热更新弹窗')
    },

    _loadResCfgJson (cb) {
        let self = this
        Com.info('开始加载资源')
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

    /**
     * 资源加载完成 进入游戏
     * @param {*} cb 
     */
    _comeInGame (cb) {
        this.setProgressValue('progress', 1)
        this.setLabelValue('jindu', 'JINDUWANCHENG')
        this._runScene(this._gameScene)
        GameCtrl.getInstance().InitGameConfig()
    },

    //h5 直接加载资源
    _fLoadRes (cb) {
        this._loadResCfgJson(cb);
    },
    //检查更新
    _fCheckUpdate () {
        let self = this
        //版本热更新文件加载方式修改为请求文件加载
        // RES.loadJson('project', function (res) {
        //     self.manifestUrl = res
        //     self._fCheck()
        // })
    },

    /**
     * 开始检查更新
     */
    _fCheck () {
        // Hot update is only available in Native build
        if (! this._isNative()) {
            Com.info('不是原生')
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._versionCompareHandle = function (versionA, versionB) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this._versionCompareHandle);
        if (! cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }
        this._am.setVerifyCallback(function (path, asset) {
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            if (compressed) {
                return true;
            }
            else {
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }
        this.checkUpdate();
    },

    updateCb (event) {
        var needRestart = false;
        var failed = false;
        Com.info('updateCb Code : ' + event.getEventCode())
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var msg = event.getMessage();
                if (msg) {
                    console.log('Updated file: ' + msg);
                }
                // this._node_HotUpdate.setProgressLength(event.getDownloadedBytes(), event.getTotalBytes());
                if (this['_hotUpdateProgress']) {
                    this['_hotUpdateProgress'](event.getDownloadedBytes(), event.getTotalBytes())
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                failed = true;
                Com.info('开始进入游戏1')
                console.log("Already up to date with the latest remote version.");
                this._loadResCfgJson()
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                needRestart = true;
                console.log('Update finished. ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths); 
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    //检查更新
    checkUpdate: function () {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl)
            // Resolve md5 url
            /**********官方文档中的nativeUrl字段，在配置文件中是不存在的，导致会找不到本地的对比文件，坑******************* */
            // var url = this.manifestUrl.nativeUrl;
            // if (cc.loader.md5Pipe) {
            //     url = cc.loader.md5Pipe.transformURL(url);
            // }
            // this._am.loadLocalManifest(url);
            /**********官方文档中的nativeUrl字段，在配置文件中是不存在的，导致会找不到本地的对比文件，坑******************* */
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            // this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        /***********这个函数已经弃用，坑**************/
        // this._am.setEventCallback(this.checkCb.bind(this));
        /***********这个函数已经弃用，坑**************/
        //函数改成这个
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    /**
     * 开始热更新
     */
    startHotUpate: function () {
        if (this._am && !this._updating) {
            // this._am.setEventCallback(this.updateCb.bind(this));

            // if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            //     // Resolve md5 url
            //     var url = this.manifestUrl.nativeUrl;
            //     if (cc.loader.md5Pipe) {
            //         url = cc.loader.md5Pipe.transformURL(url);
            //     }
            //     this._am.loadLocalManifest(url);
            // }

            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this))
            cc.eventManager.addListener(this._updateListener, 1)

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl)
            }

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    checkCb (event) {
        console.log('checkCb Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");//备注处理
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                Com.info('开始进入游戏2')
                console.log("Already up to date with the latest remote version.");
                this._loadResCfgJson()
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.showUpdateTip();
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },
    
    retry () {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
        
            console.log("Retry failed Assets...");
            this._am.downloadFailedAssets();
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
})
