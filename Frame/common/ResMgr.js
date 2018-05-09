var Global = require("Global")

var Res = cc.Class({
    extends : cc.Class,

    properties : {
        _global : null,
    },

    ctor () {
        this._global = {}
    },

    /**
     * 加载全局资源组
     * @param 资源数组名称
     * @param 加载单个回调-每加载成功一个资源会回调一次
     * @param 加载资源组完成后回调
     */
    loadArray (file, progress, complete) {
        let len = file.length;
        let index = 0;
        if (len == 0) {
            complete()
            return
        }
        for (let i in file) {
            RES.loadResToGlobal(file[i], (res)=>{
                index ++;
                if (index == len) {
                    complete();
                } else {
                    progress(index, len, res);
                }
            });
        }
    },
    loadJson (file, cb) {
        cc.loader.loadRes(file, (err, res) => {
            if (err) {
                cc.warn("json资源读取出错", err);
                return;
            }
            if (cb) cb(res);
        });
    },
    loadResToGlobal (file, cb, target) {
        let sName = cc.director.getScene().name;
        let func = (res, target) => {
            let fileName = Global.GetFileName(file);
            //场景名称-文件名称
            this._global[fileName] = res;
            cb(res, target);
        };
        this._loadRes(file, func, target);
    },

    _loadRes (file, cb, target) {
        if (file.indexOf('atlas_') > 0) cc.loader.loadRes(file, cc.SpriteAtlas, (err, res) => {//合图的读取方式
            if (err) {
                cc.warn("资源读取出错", err);
                return;
            }
            cb(res, target);
        });
        else cc.loader.loadRes(file, (err, res) => {//res 图片的话为texture2d对象
            if (err) {
                cc.warn("资源读取出错", err);
                return;
            }
            if (res instanceof cc.Texture2D) {
                let frame = new cc.SpriteFrame();
                frame.setTexture(res);
                res = frame;
            }
            cb(res, target);
        });
    },
    /**
     * 获取资源
     * @param file 资源名称 
     */
    GetRes (file) {
        let g_Arr = this._global
        for (let i in g_Arr) {//优先遍历全局资源
            if (file == i) {
                let res = g_Arr[i];
                return res instanceof cc.Prefab ? cc.instantiate(res) : res;
            }
        }
        let sName = cc.director.getScene().name;
        let arr = RES.Res[sName];
        for (let i in arr) {//遍历场景资源
            if (file == i) {
                let res = arr[i];
                return res instanceof cc.Prefab ? cc.instantiate(res.data) : res;
            }
        }
        cc.warn("未找到该资源", file);
        return null;
    },
    /**
     * 释放资源
     * @param type 资源类型
     * @param resName 资源名称--如果类型为模块资源，则resName默认为场景名称
     */
    ReleaseRes (type, resName) {
        if (type == RES_TYPE.SINGLE) {
            
        } else if (type == RES_TYPE.MODULE) {
            if (! resName) {
                let scene = cc.director.getScene();
                let sName = scene.name;
                console.log(`将要移除的资源组${sName}`);
                let list = RES.Res[sName];
                for (let i in list) {
                    cc.loader.release(list[i]);
                }
            }
        } else {
            
        }
    },
})

window['RES'] = new Res()