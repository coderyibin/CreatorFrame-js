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
var files = []

getFileList(filePath)
function getFileList(path){
	var walker  = walk.walk(path, { followLinks: false });
 
	walker.on('file', function(roots, stat, next) {
        files.push(roots + '/' + stat.name);
        next();
	});

	walker.on('end', function() {
	    // console.log("files "+files);
        // console.log("dirs "+dirs);
        for (var i = 0; i < files.length; i ++) {
            var f = files[i]
            if (f.indexOf(".meta") < 0 && f.indexOf(".plist") >= 0) {
                console.log(f)
                // var data = fs.readFileSync(f,'utf-8');
                fs.readFile(f,'utf8',(err, data) => {
                    if(err){
                        me.readFils(index+1);
                        return false;
                    }
                    let result = [];
                    while( result = me.regs.exec(data))
                    {
                        me.outPathObj[result[0]] = result[0];
                    }
                    me.readFils(index+1);
                });
            }
        }
	});
}
