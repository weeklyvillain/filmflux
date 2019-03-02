var express = require('express');
var path = require('path'), fs=require('fs');
var cors = require('cors');
const config = require("./config");
const movieDB = require('moviedb')('67f5a7ea9444704a937caf4bb96830fe');


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
fromDir(config.movieDir ,/\.mp4$/,function(filename){
    //console.log('-- found: ',filename);
    paths.push(filename);
});
fromDir(config.movieDir ,/\.mkv$/,function(filename){
    //console.log('-- found: ',filename);
    paths.push(filename);
});

var movies = {};

for (var i = 0; i < paths.length; i++) {
    // fixar till namn
    var n = paths[i].split("\\").slice(-1)[0];
    n = n.replace(/\./g, " ");
    n = n.split("mp4").join("").trim();
    console.log(JSON.stringify(n))
    //movies[n] = paths[i]
    var counter = i;
    movieDB.searchMovie({ query: n }, (err, res) => {
        //console.log(res.results[0]);
        if(res.results[0] !== undefined) {

          movies[res.results[0].title] = res.results[0];
          movies[res.results[0].title]["file_path"] = paths[counter];
        } else {
          //movieLib[item]
        }
})
}
console.table(movies);
console.log("Hittade Filmer: " + paths.length);

var app = express();
app.use(cors())


    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).send(movies);
    });


app.get('/getVideo', function(req, res) {
      console.log(req.query.videoName)
      const name = req.query.videoName;
      const path = movies[req.query.videoName].file_path
      console.log(path);
      const stat = fs.statSync(paths[0])
      const fileSize = stat.size
      const range = req.headers.range
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(paths[0]).pipe(res)
      }
    });




    var server = app.listen(config.port, "127.0.0.1",  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Server listening at http://%s:%s', host, port);
});
