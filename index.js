var express = require('express');
var path = require('path'), fs=require('fs');
var cors = require('cors');
const config = require("./config");
//const movieDB = require('moviedb')('67f5a7ea9444704a937caf4bb96830fe');
var omdbApi = require('omdb-client');
var params = {
  apiKey: 'd9d4c56a',
  query: '',
}
const superagent = require('superagent');

function fromDir(startPath,filter,callback){

    console.log('Starting from dir '+startPath+'/');

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
    console.log('-- found: ',filename);
    paths.push(filename);
});
fromDir(config.movieDir ,/\.mkv$/,function(filename){
    console.log('-- found: ',filename);
    paths.push(filename);
});

var movies = {};



let add_to_map = (res, index) => {
  movies[index] = res;
  //movies[res.Title]["file_path"] = "\\\\192.168.0.4\\storage\\Movies\\Zootopia.mp4";
  movies[index]["movie_id"] = index;
}

let get_correct_name = (name, index) => {
  params.query = name;

  superagent
    .get('http://www.omdbapi.com/')
    .query({ t: name, apiKey: "d9d4c56a"}) // query string
    .end((err, res) => {
      // Do something
      //console.log("asdadasdadad")
      //console.log(res.body)
      if(res.body.Response != 'False') {
        add_to_map(res.body, index)
      }
  });


  let series_array = name.match(/s\d\d e\d\d/g);
  if (series_array != null){
    let sAndE = series_array[0].split(" ")
    name = name.replace("(" + series_array[0] + ")", "")
    name = name.trim()
    console.log(series_array)
    let s = sAndE[0].replace(new RegExp("[^\d]"), '');
    let e = sAndE[1].replace(new RegExp("[^\d]"), '');
    console.log("Name: " + name)
    console.log("SEASON: " + parseInt(s))
    console.log("Episode: " + parseInt(e))
    superagent
    .get('http://www.omdbapi.com/')
    .query({ t: name, Season: parseInt(s), Episode: parseInt(e), apiKey: "d9d4c56a"}) // query string
    .end((err, res) => {
      // Do something
      //console.log("asdadasdadad")
      if(res.body.Response != 'False') {
        console.log("found serie " + res.body.Title)
        add_to_map(res.body, index)
      }
  });
  }
  

  /*omdbApi.search(params, function(err, data) {
    // process response...
    if(data == undefined) {
      console.log("Could not find movie")
    } else {
      add_to_map(data["Search"][0], index)
    }
  });*/
}


let clean_names = () => {
  for (var i = 0; i < paths.length; i++) {
    // fixar till namn
    var n = paths[i].split("\\").slice(-1)[0];
    n = n.replace(/\./g, " ");
    n = n.split("mkv").join("").trim();
    n = n.split("mp4").join("").trim();
    console.log("Clean name = " + JSON.stringify(n))
    get_correct_name(n, i);

  }
}

clean_names();






  
  console.log("Hittade Filmer: " + paths.length);



var app = express();
app.use(cors())


    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).send(movies);
    });


app.get('/getVideo/:id/:accessToken/:movieName', function(req, res) {
      const movieID = req.params.id;
      const accessToken = req.params.accessToken
      console.log(req.params.accessToken)
      let path;
      if(accessToken != "filip") {
        path = "C:\\Users\\Filip\\Documents\\filmflux\\Error.mp4\\"
      } else{
        path = paths[movieID]
      }
      console.log(path);
      const stat = fs.statSync(path)
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
          'Content-Type': 'video/mmkv',
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




    var server = app.listen(config.port,  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Server listening at http://%s:%s', host, port);
});
