var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path')
//读取文件内容
var obj = xlsx.parse(__dirname+'/Language.xlsx');//配置excel文件的路径
var excelObj=obj[0].data;//excelObj是excel文件里第一个sheet文档的数据，obj[i].data表示excel文件第i+1个sheet文档的全部内容
// console.log(excelObj);
//一个sheet文档中的内容包含sheet表头 一个excelObj表示一个二维数组，excelObj[i]表示sheet文档中第i+1行的数据集（一行的数据也是数组形式，访问从索引0开始）

var data = [];
var t = 0;
var _file = [];
var json = {};
for(var i in excelObj){
    t ++;
    if (t < 2) continue
    var value=excelObj[i];
    if (t == 2) {
        for(var tj = 0; tj < value.length; tj ++){
            _file.push(value[tj]);
        }
        continue;
    }
    if (t == 3) {
        continue
    }
    for (var j = 1; j < value.length; j ++) {
        json[_file[j] + "_" + value[0]] = value[j];
    }
}

//维护下面这个即可
English = {};
Chinese = {};
ChineseChara = {};
for (var i in json) {
    var num = i.indexOf("_");
    var key = i.substr(0, num);
    var tempk = i.substr(num + 1);
    if (key.indexOf("English") >= 0) {
        English[tempk] = json[i]
    } else if (key == "Chinese") {
        Chinese[tempk] = json[i]
    } else if (key == "ChineseChara") {
        ChineseChara[tempk] = json[i]
    }
}
// console.log(English);
// console.log(Chinese);
// console.log(ChineseChara);

function str (str, json) {
    var filestr = "'use strict';if (!window.i18n) {window.i18n = {};}if (!window.i18n.languages) {window.i18n.languages = {};}window.i18n.languages['%c'] = %s;"
    filestr = filestr.replace(/%s/, JSON.stringify(json))
    filestr = filestr.replace(/%c/, str)
    return filestr
}

function writeFile (filestr, json) {   
	var _path = path.resolve(__dirname, "../").substr(0, path.resolve(__dirname, "../").length - 5)
    var p = _path + "/assets/resources/i18n/" + filestr + ".js";
    //异步方法
    fs.writeFile(p, str(filestr, json), function(err){
        if(err) console.log(filestr, '写文件操作失败--', p);
        else console.log(filestr, '写文件操作成功--', p);
    });
}

console.log('\r')
console.log('正在写入多语言配置文件······')
writeFile("English", English);
writeFile("Chinese", Chinese);
writeFile("ChineseChara", ChineseChara);
//有其他语言，下面继续添加调用
console.log('写入多语言配置文件结束······')
console.log('\r')
