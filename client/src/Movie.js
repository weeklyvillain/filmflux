import React, { Component } from 'react';
import './movie.css';
const apiServer = "http://" + window.location.hostname;
const apiPort = ":9876";

class Movie extends Component {
    constructor(props){ 
        super(props);
        this.getCookie = this.getCookie.bind(this);
    };
    
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

	render() {
		return (
            <div id="movieInfo">
                <h1>{this.props.Title}</h1>
                <img src={this.props.Poster}></img>
                <a href={`${apiServer + apiPort}/getVideo/${this.props.Id}/${this.getCookie("token")}/${this.props.Title}`} rel="noopener noreferrer">
                    <img src={'/playBtn.png'}></img>
                </a>
                <p>{this.props.Plot}</p>
                <p>Rating: {this.props.Rating} / 10</p>
            </div>
      );

	}
}
export default Movie;
