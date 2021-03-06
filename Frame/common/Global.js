module.exports = {
    /**
     * 数字格式化，逗号隔开
     * @param number 数字
     * @example 10000 => 10,000
     */
    NumberGeShi (number) {
        return (number || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },

    /**
     * 判断字符串是否只是数字
     * @param str 要判断的字符串
     */
    StrIsNumber (str) {
        var reg = /^[0-9]+.?[0-9]*$/
        if (reg.test(str)) {
          return true;
        }
        return false;
    },

    /**
     * 数组打乱
     * @param arr 要打乱的数组
     */
    ArrayUpset (arr) {
        Array.prototype.sort.call(arr,function(a,b){ return Math.random()>.5 ? -1 : 1;});
        return arr;
    }, 
    
    /**
     * 获取数组打乱的结果
     * @param {*} arr 
     */
    GetArrayUpset (arr) {
        Array.prototype.sort.call(arr,function(a,b){ return Math.random()>.5 ? -1 : 1;});
        return arr;
    },

    /**
     * 数组倒序
     * @param arr 要倒序的数组
     */
    ArrayReverse (arr) {
        return arr.reverse()
    },

    /**
     * 获取数组最小值
     */
    GetArrayMin (array) {
        return array.sort(function(a,b){return a-b;})[0]
    },

    /**
     * 获取数组最大值
     */
    GetArrayMax (array) {
        return array.sort(function(a,b){return b-a;})[0]
    },

    /**
     * 数组拼接
     * @param 拼接的数组
     */
    GetArrayConcat (...array) {
        let arr = array[0]
        for (let i = 1; i < array.length; i ++) {
            arr = arr.concat(array[i])
        }
        return arr
    },

    /**
     * 获取指定范围内的随机数
     * @param 最小值 number
     * @param 最大值 number 包含
     */
    GetRandom (min, max) {
        // let num : number = Math.floor(Math.random() * max + min);
        let num = Math.floor(Math.random() * (max - min + 1) + min);
        return num;
    },
    /**
     * 获取当前脚本对象名称
     * @param 脚本对象
     * @return 脚本对象名称
     */
    GetObjectName (Comp) {
        let name = Comp.name;
        let index = name.indexOf("<");
        name = name.slice(index + 1, name.length - 1);
        return name;
    },
    /**
     * 获取当前时间戳
     */
    GetTimeString () {
        return (new Date()).valueOf() + '';
    },
    //时间转换-时间戳转时间
    GetTime (time) {
        time = time + ''
        if (time.length < 12) time = parseInt(time) * 1000
        time = parseInt(time)
        var date = new Date(time)
        var y = date.getFullYear();    
        var m = date.getMonth() + 1;    
        m = m < 10 ? ('0' + m) : m;    
        var d = date.getDate();    
        d = d < 10 ? ('0' + d) : d;    
        var h = date.getHours();  
        h = h < 10 ? ('0' + h) : h;  
        var minute = date.getMinutes();  
        var second = date.getSeconds();  
        minute = minute < 10 ? ('0' + minute) : minute;    
        second = second < 10 ? ('0' + second) : second;   
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; 
    },
    /**
     * 时间戳转秒
     * @param time 时间戳
     */
    GetTimeToSecond (time) {
        let seconds = (time % (1000 * 60)) / 1000;
        return seconds
    },
    //获取数据组第一条数据
    GetJsonFirst (json) {
        for (let i in json) {
            return json[i]
        }
    },
    /** 
     * 获取json数据的长度
     * */
    GetJsonLength (json) {
        if (! json || ! (json instanceof Object)) return;
        let len = 0;
        for (let i in json) {
            len ++;
        }
        return len;
    },
    //克隆json
    CloneJSON (jsonData) {
        return JSON.parse(JSON.stringify(jsonData));
    },
    //兼容
    CloneJson (jsonData) {
        return JSON.parse(JSON.stringify(jsonData));
    },
    //克隆数组
    CloneArray (arr) {
        return arr.slice(0);
    },
    /**
     * 克隆节点
     */
    CloneNode (node) {
        if (node) {
            return cc.instantiate(node)
        }
    },
    //json转字符串
    JSONToStr (json) {
        return JSON.stringify(json)
    },
    //字符串转json
    StrToJSON (str) {
        if (str == '') return {} 
        return JSON.parse(str)
    },
    //字符串替换
    StrReplace (str, ...values) {
        for (let i in values) {
            str = str.replace('%s', value[i])
        }
        return str
    },

    /**
     * 字符串转数组
     * @param {*} str 要转换的字符串
     * @param {*} key 转换的标记
     * @example Global.StrToArray('1-2', '-')
     * @example [1, 2]
     */
    StrToArray (str, key) {
        let array = str.split(key)
        return array
    },

    /**
     * 数组转字符串
     * @param {*} array 要转换的数组 
     * @param {*} key 转换的标记
     */
    ArrayToStr (array, key) {
        let str = array.join(key)
        return str
    },

    /**
     * 判断字符串是否包含某些字符
     */
    StringHasStr (str) {
        if (str.indexOf("*" || "_" || "-" || "/" || "\"" || " ") >= 0) {
            return true;
        }
        return false;
    },
    /**
     * 冒泡排序-降序
     */
    BubbleSortDown (arr) {
        for(var j = 0; j < arr.length - 1; j ++){
            //两两比较，如果前一个比后一个大，则交换位置。
               for(var i = 0; i < arr.length - 1 - j;i ++){
                    if(arr[i] < arr[i + 1]){
                        var temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                }
            } 
        }
        return arr;
    },
    /**
     * 字符串截取
     * @param 开始截取的位置
     * @param 截取的长度
     */
    GetStrLen (str, start, len) {
        return str.substr(start, len)
    },

    /**
     * 字符串截取-新接口
     * @param str 要操作的字符串
     * @param start 开始截取的位置
     * @param len 截取的长度
     */
    GetSubStr (str, start, len) {
        return str.substr(start, len)
    },

    /**
     * 字符串去掉非数字字符
     * @param str 要操作的字符串
     */
    GetStrDelNotNumber (str) {
        return str.replace(/[^0-9]/ig,"")
    },

    /**
     * 字符串去掉数字字符
     * @param str 要操作的字符串
     */
    GetStrDelNumber (str) {
        return str.replace(/[0-9]/ig,"")
    },

    /**
     * 数组删除元素
     * @param 要操作的数组
     * @param 数组下标
     * @param 要删除的个数
     * @returns 返回被删除的元素
     */
    DelArray (array, index, count=1) {
        return array.splice(index, count)
    },
    /**
     * 获取资源文件名称
     * @param 文件路径
     */
    GetFileName (path) {
        while (true) {
            let index = path.indexOf("/"); 
            if (index != -1) {
                path = path.substr(index + 1, path.length);
            } else {
                return path;
            }
        }
    },
    
    //获取可视视图大小
    GetVisibleSize () {
        return cc.director.getVisibleSize()
    },

    //求向量的夹角
    GetVectorRadians(x1, y1, x2, y2) {
	    return Math.acos((x1 * x2 + y1 * y2) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)));
    },
    
    /**
     * OpenGL坐标转成格子坐标
     * @param 像素坐标
     * @param tiledMap 地图
     * @returns 格子坐标
     * */
    GetTileCoordForPosition(position, tiledMap) {
        let mapSize = tiledMap.getMapSize(); 
        let tileSize = tiledMap.getTileSize();
        let x = position.x / tileSize.width;
        let y = (mapSize.height * tileSize.height - position.y) / tileSize.height;
        return cc.v2(x, y);
    },
    /**
     * tile坐标转成瓦片格子中心的OpenGL坐标
     * @param 地图坐标
     * @param 地图对象
     * @returns 像素坐标
     * */
    GetPositionForTileCoord(tileCoord, tiledMap) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = tileCoord.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - tileCoord.y) * tileSize.height - tileSize.height / 2;
        return cc.v2(x, y);
    },

    /**
     * 45 度交错地图 OpenGL坐标转成格子坐标
     * @param 像素坐标
     * @param tiledMap 地图
     * @returns 格子坐标
     * */
    GetStaggeredCoordForPosition(position, tiledMap) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let y = mapSize.height - 2 - ((2 * position.y) / tileSize.height);
        let x = position.x / tileSize.width - (y % 2) / 2.0;
        return cc.v2(x, y);
    },

    /**
     * 45 度交错地图 tile坐标转成瓦片格子中心的OpenGL坐标
     * @param 地图坐标
     * @param 地图对象
     * @returns 像素坐标
     * */
    GetPositionForStaggeredCoord(tileCoord, tiledMap) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = tileCoord.x * tileSize.width + (tileCoord.y % 2) * tileSize.width / 2;
        let y = (mapSize.height - (tileCoord.y + 1)) * tileSize.height / 2 - tileSize.height / 2;
        return cc.v2(x, y);
    },

    /**
     * 保留小数
     * @param number 数字
     * @param count 小数位数
     */
    GetDecimals (number, count) {
        return number.toFixed(count)
    },

}