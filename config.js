var config = {};

config.movieDir = "\\\\192.168.0.4\\storage\\Movies";
//config.movieDir = "/home/filip/filmflux"
config.port = process.env.WEB_PORT || 8080;

module.exports = config;
