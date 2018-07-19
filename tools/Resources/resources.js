
var fs = require('fs');
var path = require('path');
var async = require('async');
var walk = require('walk')


//解析需要遍历的文件夹，我这以E盘根目录为例
var fpath = path.resolve(__dirname, '../../assets/resources/')
console.log('cus run path:', fpath)
var filePath = fpath//path.resolve(__dirname);
var dataFile = {}

// //调用文件遍历方法
// fileDisplay(filePath);

// /**
//  * 文件遍历方法
//  * @param filePath 需要遍历的文件路径
//  */
// function fileDisplay(filePath){
//     //根据文件路径读取文件，返回文件列表
//     fs.readdir(filePath,function(err,files){
//         if(err){
//             console.warn(err)
//         }else{
//             //遍历读取到的文件列表
//             files.forEach(function(filename){
//                 //获取当前文件的绝对路径
//                 var filedir = path.join(filePath,filename);
//                 //根据文件路径获取文件信息，返回一个fs.Stats对象
//                 fs.stat(filedir,function(eror,stats){
//                     if(eror){
//                         console.warn('获取文件stats失败');
//                     }else{
//                         if (filename.indexOf('.meta') < 0 && filename.indexOf('resources.json') < 0 &&
//                         filename.indexOf('i18n') < 0) {
//                             var isFile = stats.isFile();//是文件
//                             var isDir = stats.isDirectory();//是文件夹
//                             if(isFile){
//                                 console.log(filedir);
//                                 classify(filedir)
//                             }
//                             if(isDir){
//                                 fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
//                             }
//                         }
//                     }
//                 })
//             });
//         }
//     });
// }

var files = [],dirs = []
getFileList(filePath)
function getFileList(path){
	var walker  = walk.walk(path, { followLinks: false });
 
	walker.on('file', function(roots, stat, next) {
        files.push(roots + '/' + stat.name);
        next();
	});
 
	// walker.on('directory', function(roots, stat, next) {
	//     dirs.push(roots + '/' + stat.name);
	//     next();
	// });
	walker.on('end', function() {
	    // console.log("files "+files);
        // console.log("dirs "+dirs);
        for (var i = 0; i < files.length; i ++) {
            var f = files[i]
            if (f.indexOf(".meta") < 0 && f.indexOf("resources.json") < 0) {
                classify(files[i])
            }
        }
        writeFile(JSON.stringify(dataFile))
	});
}

function classify (filedir) {
    filedir = filedir.split(fpath).join('')
    filedir = filedir.substring(1, filedir.length)
    // filedir = filedir.replace(/\\/, '/')
    if (filedir.indexOf('.prefab') >= 0) {
        isPrefab(filedir.replace('.prefab', ''))
    } else if (filedir.indexOf('.wav') >= 0 || filedir.indexOf('.mp3') >= 0) {
        isAudio(filedir.replace(/(.wav|.mp3)/, ''))
    } else if (filedir.indexOf('.json') >= 0) {
        isJson(filedir.replace('.json', ''))
    } else if (filedir.indexOf('.png') >= 0 || filedir.indexOf('.jpg') >= 0 || filedir.indexOf('.jpeg') >= 0) {
        isImage(filedir.replace(/(.png|.jpg|jpeg)/, ''))
    }
    // console.log(JSON.stringify(dataFile))
}
function isAudio (filedir) {
    if (! dataFile['mp3']) {
        dataFile['mp3'] = []
    }
    filedir = filedir.replace(/\\/,"/")
    dataFile['mp3'].push(filedir)
}
function isJson (filedir) {
    if (! dataFile['config']) {
        dataFile['config'] = []
    }
    filedir = filedir.replace(/\\/,"/")
    dataFile['config'].push(filedir)
}
function isImage (filedir) {
    if (! dataFile['common']) {
        dataFile['common'] = []
    }
    filedir = filedir.replace(/\\/,"/")
    dataFile['common'].push(filedir)
}
function isPrefab (filedir) {
    if (! dataFile['common']) {
        dataFile['common'] = []
    }
    filedir = filedir.replace(/\\/,"/")
    dataFile['common'].push(filedir)
}

function writeFile (str) {   
    var p = "resources.json";
    //异步方法
    fs.writeFile(p, str, function(err){
        if(err) console.log('写文件操作失败--', p);
        else console.log('写文件操作成功--', p);
    });
}