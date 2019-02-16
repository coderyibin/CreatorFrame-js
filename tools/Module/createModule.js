var fs = require('fs');
var path = require('path');
const readline = require('readline');
var modules = require('./Module')

//写入的路径
var wpath = path.resolve(__dirname, '../../assets/Script/Game/')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var fileName = ''

function writeFile (filestr, str) {   
    var p = wpath + '/' + filestr + ".js";
    //异步方法
    fs.writeFile(p, str, function(err){
        if(err) console.log(filestr, '写文件操作失败--', p);
        else console.log(filestr, '写文件操作成功--', p);
    });
}
function StrReplace (str, ...values) {
    for (let i in values) {
        str = str.replace('%s', values[i])
    }
    return str
}
rl.question('Please input js name: (eg:scene: input : Scene_Name or layer: input : Layer_Name)', (answer) => {
    fileName = answer
    if (fileName.indexOf('Layer') >= 0) writeFile(fileName, StrReplace(modules.layer, fileName))
    else if (fileName.indexOf('Loading') >= 0) writeFile(fileName, modules.loading)
    else if (fileName.indexOf('Scene') >= 0) writeFile(fileName, modules.scene)
    else if (fileName.indexOf('Unit') >= 0) writeFile(fileName, modules.unit)
    else if (fileName.indexOf('Ctrl') >= 0) writeFile(fileName, StrReplace(modules.ctrl, fileName, fileName, fileName, fileName))
    else if (fileName.indexOf('Data') >= 0) writeFile(fileName, StrReplace(modules.data, fileName, fileName, fileName))
    else if (fileName.indexOf('Tip') >= 0) writeFile(fileName, modules.tip)
    else if (fileName.indexOf('Msg') >= 0) writeFile(fileName, modules.msg)
    else console.log('input error, so create file faild!')
    rl.close();
});