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
     * 获取全局加载的资源包括配置文件与资源文件
     */
    getGlobal () {
        return this._global
    },

    /**
     * 获取配置文件，这里的json格式文件由框架的tools文件夹下的Data文件夹下的xlsx表格文件生成
     * 请查看框架说明
     * @param 文件名称 默认获取Config配置文件
     * @returns 配置数据
     */
    GetConfig (file='Config') {
        return this.getGlobal()[file] || null
    }, 

    GetCfg (file='Config') {
        return this.GetConfig(file)
    },

    /**
     * 兼容旧项目
     */
    getConfig (file='Config') {
        return this.getGlobal()[file]
    },

    /**
     * 添加全局资源
     * @param name 获取资源的key
     * @param res 资源
     */
    JoinRes (name, res) {
        if (this._global.hasOwnProperty(name)) {
            Com.error('已经存在当前资源key-->', name)
            return
        }
        this._global[name] = res
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
        if (file.indexOf('atlas_') >= 0) {
                cc.loader.loadRes(file, cc.SpriteAtlas, (err, res) => {//合图的读取方式
                if (err) {
                    cc.warn("合图资源读取出错", err);
                    return;
                }
                cb(res, target);
            });
        } else {
            cc.loader.loadRes(file, (err, res) => {//res 图片的话为texture2d对象
                if (err) {
                    cc.warn("其他资源读取出错", err);
                    return;
                }
                if (res instanceof cc.Texture2D) {
                    let frame = new cc.SpriteFrame();
                    frame.setTexture(res);
                    res = frame;
                }
                cb(res, target);
            });
        }
    },

    loadRes (fileName, cb) {
        this._loadRes(fileName, cb)
    },

    /**
     * 获取资源
     * @param file 资源名称 
     */
    GetRes (file) {
        let g_Arr = this._global
        // for (let i in g_Arr) {//优先遍历全局资源
        //     if (file == i) {
        //         let res = g_Arr[i];
        //         return res instanceof cc.Prefab ? cc.instantiate(res) : res;
        //     }
        // }
        if (g_Arr[file]) {
            let res = g_Arr[file]
            return res instanceof cc.Prefab ? Tools.Clone(res) : res;
        }
        // let sName = cc.director.getScene().name;
        // let arr = RES.Res[sName];
        // for (let i in arr) {//遍历场景资源
        //     if (file == i) {
        //         let res = arr[i];
        //         return res instanceof cc.Prefab ? cc.instantiate(res.data) : res;
        //     }
        // }
        cc.error("resources文件夹下未找到该资源", file);
        return null;
    },

    /**
     * 获取图集资源
     * @param name 资源名称
     * @param atals 所在图集名称
     * @return frame 返回一个 frame 对象
     */
    GetAtlas (name, atals) {
        let res = this.GetRes(atals)
        if (! res) {
            return null
        }
        let frame = res.getSpriteFrame(name)
        return frame
    },

    /**
     * 获取资源-新版接口
     * @param {*} file 资源名称 
     */
    Get (file) {
        return this.GetRes(file)
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

    GetNetRes (url, cb) {
        cc.loader.load({url : url, type : 'png'}, function (err, texture) {
            if (err) {
                return
            }
            var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
            cb(spriteFrame)
        });
    },
})

window['RES'] = new Res()