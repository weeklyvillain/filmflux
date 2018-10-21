var express = require('express');
var path = require('path'), fs=require('fs');
var cors = require('cors');
const config = require("./config");


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

// exempel path
// \\192.168.0.104\external2\moviesss\Movies\Catch.Me.If.You.Can.2002.1080p.BluRay.x264.AC3-ETRG\Catch.Me.If.You.Can.2002.1080p.BluRay.x264.AC3-ETRG.mp4
var paths = [];
fromDir(config.moiveDir ,/\.mp4$/,function(filename){
    //console.log('-- found: ',filename);
    paths.push(filename);
});
fromDir(config.moiveDir ,/\.mkv$/,function(filename){
    //console.log('-- found: ',filename);
    paths.push(filename);
});

var movies = {};

for (var i = 0; i < paths.length; i++) {
    var n = paths[i].split("\\").slice(-1)[0];
    n = n.replace(/\./g, " ");
    movies[n] = {
            autoplay: false,
            controls: true,
            sources: [{
                src: paths[i],
                type: 'video/mp4'
            }]
        }
}



// for(item in movies){
//     console.log("\n");
//     console.log(item + ": \n");
//     console.log(movies[item]);
// }
console.table(movies);
console.log(paths.length);

var app = express();
app.use(cors())


    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).send(movies);
    });

    var server = app.listen(config.port, "127.0.0.1",  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Example app listening at http://%s:%s', host, port);
});
