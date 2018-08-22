
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path')

//解析Excel
function praseExcel(list)
{
    for (var i = 0; i < list.length; i++) 
    {
         var excleData = list[i].data;
         var sheetArray  = [];
         var typeArray =  excleData[1];
         var keyArray =  excleData[2];
         var json = {}
        for (var j = 3; j < excleData.length ; j++)
        {
            var curData = excleData[j];
            json[curData[0]] = curData[2]
        }
    }
    var data = JSON.stringify(json)
    return data
}

function writeFile (filestr, json) {   
    console.log('\r')
    console.log('正在写入游戏配置文件······\r')
	var _path = path.resolve(__dirname, "../").substr(0, path.resolve(__dirname, "../").length - 5)
    var p = _path + "/assets/resources/" + filestr + ".json";
    //异步方法
    fs.writeFile(p, json, function(err){
        if(err) console.log(filestr, '写文件操作失败--', p);
        else console.log(filestr, '写文件操作成功--', p);
        console.log('写入游戏配置文件结束······\r')
        console.log('\r')
    });
}

function readFile (name) {
    //读取文件内容
    var obj = xlsx.parse(__dirname+'/' + name + '.xlsx');//配置excel文件的路径
    // var excelObj=obj[0].data;//excelObj是excel文件里第一个sheet文档的数据，obj[i].data表示excel文件第i+1个sheet文档的全部内容
    // console.log(excelObj);
    //一个sheet文档中的内容包含sheet表头 一个excelObj表示一个二维数组，excelObj[i]表示sheet文档中第i+1行的数据集（一行的数据也是数组形式，访问从索引0开始）

    var json = praseExcel(obj);
    writeFile(name, json)

}
readFile("Config")