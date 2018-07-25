
var AStar = cc.Class({
    extends : cc.Class,

    properties : {
        _wall : null,
        _size : null,
    },

    ctor () {

    },
    /**
     * 开始寻路
     * @param {*} startPos 开始计算的瓦片坐标
     * @param {*} endPos 终点的瓦片坐标
     * @param {*} walls 墙壁或者不可走区域数组瓦片坐标
     * @param {*} size 瓦片地图大小
     */
    Start (startPos, endPos, walls, size) {
        this._wall = walls
        this._size = size
        size = []
        for (let i = 0; i < this._size.width; i ++) {
            size.push(i)
            size[i] = []
            for (let j = 0; j < this._size.height; j ++) {
                size[i].push({x : i, y : j})
            }
        }

        // return this.searchRoad(startPos.x, startPos.y, endPos.x, endPos.y)
        startPos = cc.v2(Math.floor(startPos.x), Math.floor(startPos.y))
        return this.findway(size, startPos, endPos)
    },

    findway(points, start, end) {
        var opens = [];  // 存放可检索的方块(开启列表)
        var closes = [];  // 存放已检索的方块（关闭列表）
        var cur = null;  // 当前指针
        var bFind = true;  // 是否检索  
        // 设置开始点的F、G为0并放入opens列表（F=G+H）
        start.F = 0;
        start.G = 0;
        start.H = 0;   
        // 将起点压入closes数组，并设置cur指向起始点
        closes.push(start);
        cur = start;    
        // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
        if (Math.abs(start.y - end.y) + Math.abs(start.x - end.x) == 1) {
            end.P = start;
            closes.push(end);
            bFind = false;
        }    
        // 计算路径
        while (cur && bFind) {
            //如果当前元素cur不在closes列表中，则将其压入closes列表中
            if (!this.inList(closes, cur)) 
                closes.push(cur);
            // 然后获取当前点四周点
            var rounds = this.getRounds(points, cur);
            // 当四周点不在opens数组中并且可移动并且不是障碍物，设置G、H、F和父级P，并压入opens数组
            for (var i = 0; i < rounds.length; i++) {
                if (rounds[i].val == 1 || this.inList(closes, rounds[i]) || this.inList(opens, rounds[i]) || this._isObsOfPoint(rounds[i])) 
                    continue;
                else if (!this.inList(opens, rounds[i]) && rounds[i].val != 1) {
                    rounds[i].G = cur.G + 1;//不算斜的，只算横竖，设每格距离为1
                    rounds[i].H = Math.abs(rounds[i].x - end.x) + Math.abs(rounds[i].y - end.y);
                    rounds[i].F = rounds[i].G + rounds[i].H;
                    rounds[i].P = cur;//cur为.P的父指针                
                    opens.push(rounds[i]);
                }
            }        
            // 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
            if (!opens.length) {
                cur = null;
                opens = [];
                closes = [];
                break;
            }        
            // 按照F值由小到大将opens数组排序
            opens.sort(function (a, b) {
                return a.F - b.F;
            });        
            // 取出opens数组中F值最小的元素，即opens数组中的第一个元素
            var oMinF = opens[0];
            var aMinF = [];  // 存放opens数组中F值最小的元素集合        
            // 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
            for (var i = 0; i < opens.length; i++) {
                if (opens[i].F == oMinF.F) 
                    aMinF.push(opens[i]);
            }        
            // 如果最小F值有多个元素
            if (aMinF.length > 1) {
                // 计算元素与cur的曼哈顿距离
                for (var i = 0; i < aMinF.length; i++) {
                    aMinF[i].D = Math.abs(aMinF[i].y - cur.y) + Math.abs(aMinF[i].x - cur.x);
                }           
                // 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
                aMinF.sort(function (a, b) {
                    return a.D - b.D;
                });                        
                oMinF = aMinF[0];
            }
            // 将cur指向D值最小的元素
            cur = oMinF;        
            // 将cur压入closes数组
            if (!this.inList(closes, cur)) 
                closes.push(cur);       
            // 将cur从opens数组中删除
            for (var i = 0; i < opens.length; i++) {
                if (opens[i] == cur) {
                    opens.splice(i, 1);//将第i个值删除
                    break;
                }
            }
            // 找到最后一点，并将结束点压入closes数组
            if (cur.H == 1) {
                end.P = cur;
                closes.push(end);
                cur = null;
            }
        }
        if (closes.length) {
            // 从结尾开始往前找
            var dotCur = closes[closes.length - 1];
            var path = [];  // 存放最终路径
            var i=0;
            while (dotCur) {
                path.unshift(dotCur);  // 将当前点压入path数组的头部
                dotCur = dotCur.P;  // 设置当前点指向父级            
                if (!dotCur.P) {
                    dotCur = null;
                }
            }        
            return path;
        } 
        else {
            return false;
        }
    },
    inList(list, current) {
        for (var i = 0, len = list.length; i < len; i++) {
            if ((current.y == list[i].y && current.x == list[i].x) || (current == list[i])) 
                return true;
        }
        return false;
    },
    getRounds(points, current) {
        var u = null;//上
        var l = null;//左
        var d = null;//下
        var r = null;//右    
        var rounds = [];
        // 上
        if (current.y - 1 >= 0) {
            u = points[current.x][current.y - 1];
            rounds.push(u);
        }    
        // 左
        if (current.x - 1 >= 0) {
            l = points[current.x - 1][current.y];
            rounds.push(l);
        }
        // 下
        if (current.y + 1 < points.length) {
            d = points[current.x][current.y + 1];
            rounds.push(d);
        }    
        // 右
        if (current.x + 1 < points[0].length) {
            r = points[current.x + 1][current.y];
            rounds.push(r);
        }    
        return rounds;
    },
    /**
     * 判断点是否是障碍物
     */
    _isObsOfPoint (point) {
        let points = this._wall
        if (points.length == 0) return false 
        for (let i = 0; i < points.length; i ++) {
            let item = points[i]
            for (let j = 0; j < item.length; j ++) {
                let temp = item[j]
                if (temp.x == point.x && temp.y == point.y) {
                    return true
                }
            }
        } return false
    },
    /********************************************************* */
})