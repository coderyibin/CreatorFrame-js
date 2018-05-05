var Common = {
    /**
     * 是否调试模式
     */
    IsDebug : true,
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
    fGetRandom (min, max) {
        // let num : number = Math.floor(Math.random() * max + min);
        let num = Math.floor(Math.random() * (max - min + 1) + min);
        return num;
    },
    /**
     * 获取当前脚本对象名称
     * @param 脚本对象
     * @return 脚本对象名称
     */
    fGetObjectName (Comp) {
        let name = Comp.name;
        let index = name.indexOf("<");
        name = name.slice(index + 1, name.length - 1);
        return name;
    }
}

module.exports = Common