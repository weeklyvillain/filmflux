var express = require('express');
var path = require('path'), fs=require('fs');

function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        }
        else if (filter.test(filename)) callback(filename);
    };
};

fromDir("\\\\192.168.0.104\\external2\\moviesss" ,/\.mp4$/,function(filename){
    console.log('-- found: ',filename);
});
var app = express();

// const path = '/home/filip/Desktop/Ready Player One (2018) [WEBRip] [1080p] [YTS.AM]'
// const stat = fs.statSync(path)
// const fileSize = stat.size
// const range = req.headers.range
//
// if (range) {
//   const parts = range.replace(/bytes=/, "").split("-")
//   const start = parseInt(parts[0], 10)
//   const end = parts[1]
//     ? parseInt(parts[1], 10)
//     : fileSize-1
//   const chunksize = (end-start)+1
//   const file = fs.createReadStream(path, {start, end})
//   const head = {
//     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//     'Accept-Ranges': 'bytes',
//     'Content-Length': chunksize,
//     'Content-Type': 'video/mp4',
//   }
//
//   res.writeHead(206, head);
//   file.pipe(res);
// } else {
//   const head = {
//     'Content-Length': fileSize,
//     'Content-Type': 'video/mp4',
//   }
//   res.writeHead(200, head)
//   fs.createReadStream(path).pipe(res)
// }
// });

    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).sendFile(__dirname + "/lib/index.html")
    });

    var server = app.listen(3000, "127.0.0.1",  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Example app listening at http://%s:%s', host, port);
});
