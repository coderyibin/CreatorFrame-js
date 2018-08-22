
var fs = require('fs');
var path = require('path');
var async = require('async');
var walk = require('walk')

//写入的路径
var wpath = path.resolve(__dirname, '../../assets/resources/')
//解析需要遍历的文件夹，我这以E盘根目录为例
var fpath = path.resolve(__dirname, '../../assets/resources/')
console.log('cus run path:', fpath)
var filePath = fpath
var dataFile = {}
dataFile['config'] = []
dataFile['mp3'] = []
dataFile['common'] = []
dataFile['tmx'] = []

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
    } else if (filedir.indexOf('.tmx') >= 0) {
        isTmx(filedir.replace(/(.tmx)/, ''))
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
function isTmx (filedir) {
    if (! dataFile['tmx']) {
        dataFile['tmx'] = []
    }
    filedir = filedir.replace(/\\/,"/")
    dataFile['tmx'].push(filedir)
}

function writeFile (str) {   
    console.log('正在写入资源配置······')
    console.log('\r')
    var p = wpath + '\\' + "resources.json";
    //异步方法
    fs.writeFile(p, str, function(err){
        if(err) console.log('写文件操作失败--', p);
        else console.log('写文件操作成功--', p);

        console.log('写入资源配置结束······')
        console.log('\r')     
    });
}