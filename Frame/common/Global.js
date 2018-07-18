var Global = {
    /**
     * 数组打乱
     * @param arr 要打乱的数组
     */
    ArrayUpset (arr) {
        Array.prototype.sort.call(arr,function(a,b){ return Math.random()>.5 ? -1 : 1;});
        return arr;
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
    //获取数据组第一条数据
    GetJsonFirst (json) {
        for (let i in json) {
            return json[i]
        }
    },
    //获取json数据的长度
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
    CloneJson (jsonData) {
        return CloneJSON(jsonData)
    },
    //克隆数组
    CloneArray (arr) {
        return arr.slice(0);
    },
    //json转字符串
    JSONToStr (json) {
        return JSON.stringify(json)
    },
    //字符串转json
    StrToJSON (str) {
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
     * 判断字符串是否包含某些字符
     */
    StringHasStr (str) {
        if (str.indexOf("*" || "_" || "-" || "/" || "\"") >= 0) {
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
}
module.exports = Global