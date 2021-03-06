var express = require('express');
var path = require('path'), fs=require('fs');
var cors = require('cors');
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var osu = require('node-os-utils')




const config = require("./config");
var database = require("./database");
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

let streamedMovies = 0;

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
  movies[res.title] = res;
  //movies[res.Title]["file_path"] = "\\\\192.168.0.4\\storage\\Movies\\Zootopia.mp4";
  movies[res.title]["movie_id"] = index;
}

let get_correct_name = (name, index) => {
  params.query = name;

  superagent
    .get('https://api.themoviedb.org/3/search/movie?')
    .query({ query: name, api_key: "67f5a7ea9444704a937caf4bb96830fe"}) // query string
    .end((err, res) => {
      // Do something
      console.log("asdadasdadad")
      console.log(res.body['results'][0])
      if(res.body.Response != 'False') {
        add_to_map(res.body['results'][0], index)
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
    var n = paths[i].split("/").slice(-1)[0];
    n = n.replace(/\./g, " ");
    n = n.split("mkv").join("").trim();
    n = n.split("mp4").join("").trim();
    console.log("Clean name = " + JSON.stringify(n))
    get_correct_name(n, i);

  }
}

let nameMatch = (name) => {
  name = name.split("/").slice(-1)[0];
  name = name.split("\\").slice(-1)[0];

  
  let re = new RegExp("([ .\\w'!-]+?)(\\W\\d{4}\\W?.*)", 'gm');
  let matches = re.exec(name)
  if (matches != null && matches.length >= 2) {
      name = matches[1];
      name = name.replace(/\./g, ' ');
      name = name.trim();
  }
  name = name.split(".mkv").join("").trim();
  name = name.split(".mp4").join("").trim();
  return name;
}

for(var i = 0; i < paths.length; i++) {
  let name = nameMatch(paths[i]);
  console.log("NAME IS: " + name)
  get_correct_name(name, i);
}






  
  console.log("Hittade Filmer: " + paths.length);



var app = express();
app.use(cors({
  origin: "*"
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  httpOnly: false,

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


    app.get("/index.html", function (req, res, next){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).send(movies);
    });


app.get('/getVideo/:id/:accessToken/:movieName', function(req, res) {
      streamedMovies += 1;
      const movieID = req.params.id;
      const accessToken = req.params.accessToken;
      const valid = database.isAccessTokenValid(accessToken);
      console.log(req.params.accessToken)
      let path;
      if(!valid) {
        path = "/home/filip/Documents/filmflux/Error.mp4"
      } else{
        path = paths[movieID]
      }
      console.log(movies);
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

    app.post('/login', function(req, res) {
      console.log("/login usrename: " + req.body.username)
      console.log("/login password: " + req.body.password)
      let username = req.body.username;
      let password = req.body.password;
      database.getUser(username, password, (user) => {
          if (user === undefined) {
              console.log('A user tried to login with invalid credentials');
              res.json({error: "user/password", loggedIn: false});
              return;
          }
          let access_token = database.generateAccessToken();
          database.saveAccessToken(access_token, user, () => {
                req.session.access_token = access_token;
                req.session.userid = req.body.username;
                console.log(`User ${req.session.userid} has logged in!`);
              res.json({error: false, loggedIn: true, token: access_token});
          });
      });
    });

    app.post('/isAdmin', function(req, res) {
      let token = req.body.token;
      
      database.isUserAdmin(token, (isAdmin) => {
        console.log("User is admin: " + isAdmin);
        res.json({error: false, isAdmin: isAdmin})
      });
    });

    app.get('/getServerStats', (req, res) => {
      let cpu = osu.cpu;
      let cpuCores = cpu.count();
      let hdd = osu.drive;
      let mem = osu.mem;
      cpu.usage().then(cpuUsage => {
        hdd.info().then(hddInfo => {
          mem.info().then(memInfo =>{
            res.json({cores: cpuCores, cpuUsage: cpuUsage, memInfo: memInfo, hdd: hddInfo, movieCount: paths.length, numStreams: streamedMovies})
          })
        })
      })


    });

     var server = app.listen(config.port, "localhost",  function () {
      var location = server.address();
      var host = location.address;
      var port = location.port;
      console.log('Server listening at http://%s:%s', host, port);
});
