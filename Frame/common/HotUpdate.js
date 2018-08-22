var HotUpdate = cc.Class({
    extends : cc.Class,

    properties : {
        _storagePath : null,
        _versionCompareHandle : null,
        _am : null,
        _checkListener : null,
        _canRetry : null,
        _manifestUrl : null,
        _updating : null,
        _updateListener : null,
        _progress : null,
        _updatePanel : null,
        _updateOk: null,
    },

    /**
     * 设置热更新回调函数
     * @param {*} panel 热更新信息面板
     * @param {*} progress 热更新进度回调函数
     * @param {*} ok 热更新完成回调函数
     */
    SetCallBack (panel, progress, ok) {
        this._setUpdatePanel(panel)
        this._setProgress(progress)
        this._setUpdateOk(ok)
    },

    /**
     * 设置进度条回调函数
     */
    _setProgress (progress) {
        this._progress = progress
    },

    /**
     * 新更新面板显示
     */
    _setUpdatePanel (panel) {
        this._updatePanel = panel
    },

    /**
     * 更新完成回调函数
     */
    _setUpdateOk (updateOk) {
        this._updateOk = updateOk
    },

    /**
     * 热更新对比文件
     */
    _setUpdateManifestUrl (manifestUrl) {
        this._manifestUrl = manifestUrl
    },

    /**
     * 开始检查更新
     */
    _fCheck () {
        // Hot update is only available in Native build
        if (! cc.sys.isNative) {
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
                if (this._progress) {
                    this._progress(event.getDownloadedBytes(), event.getTotalBytes())
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                failed = true;
                console.log("Already up to date with the latest remote version.");
                if (this._updateOk) this._updateOk()
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

            this.Destroy()
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
                console.log("Already up to date with the latest remote version.");
                if (this._updateOk) this._updateOk()
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                if (this._updatePanel) this._updatePanel() 
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

    Destroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
})