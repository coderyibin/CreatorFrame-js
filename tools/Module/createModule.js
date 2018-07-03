var fs = require('fs');
const readline = require('readline');
var modules = require('./Module')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var fileName = ''

function writeFile (filestr, str) {   
    var p = filestr + ".js";
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
    else if (fileName.indexOf('Scene') >= 0) writeFile(fileName, modules.scene)
    else if (fileName.indexOf('Unit') >= 0) writeFile(fileName, modules.unit)
    else console.log('input error, so create file faild!')
    rl.close();
});