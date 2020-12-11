import React, { Component } from 'react';
import './movie.css';
const apiServer = "http://" + window.location.hostname;
const apiPort = ":9876";

class Movie extends Component {
    constructor(props){ 
        super(props);
        this.state = {
          showVideoInfo: true
      }
        this.playVideo = this.playVideo.bind(this);
        this.getCookie = this.getCookie.bind(this);
    };
    
    playVideo() {
        this.setState({showVideoInfo: !this.state.showVideoInfo});
    }

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
                {!this.state.showVideoInfo && 
                  <video id="videoPlayer" controls autoPlay>
                    <source src={`${apiServer + apiPort}/getVideo/${this.props.Id}/${this.getCookie("token")}/${this.props.Title}`}
                            type="video/mp4" />
                      Your browser does not support the video tag.
                  </video>
                }
                {this.state.showVideoInfo && 
                  <div>
                    <h1>{this.props.Title}</h1>
                    <img src={this.props.Poster}></img>
                    <img id="playBtn" onClick={this.playVideo} src={'/playBtn.png'}></img>
                    <p>{this.props.Plot}</p>
                    <p>Rating: {this.props.Rating} / 10</p>
                  </div>
                }
            </div>
      );

	}
}
export default Movie;
