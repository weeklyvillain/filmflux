var express = require('express');
var dir = require("node-dir");

// match only filenames with a .txt extension and that don't start with a `.´
dir.files(__dirname, {
    match: /.txt$/,
    exclude: /^\./
    }, function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:',files);
    });

var app = express();

const path = '/home/filip/Desktop/Ready Player One (2018) [WEBRip] [1080p] [YTS.AM]'
const stat = fs.statSync(path)
const fileSize = stat.size
const range = req.headers.range

if (range) {
  const parts = range.replace(/bytes=/, "").split("-")
  const start = parseInt(parts[0], 10)
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : fileSize-1
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
  fs.createReadStream(path).pipe(res)
}
});

    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).sendFile(__dirname + "/lib/index.html")
    });

    app.delete("*", function(req, res){
        res.send("Fuck off!");
    });

    app.get('/getall', function(req, res, next){
      get_all(req, res, next);
    });

    app.get('/flag', function(req, res, next){
      flag(req, res, next);
    });
    app.get('/save', function(req, res, next){
      save(req, res, next);
    });

    var server = app.listen(3000, "127.0.0.1",  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Example app listening at http://%s:%s', host, port);
});
