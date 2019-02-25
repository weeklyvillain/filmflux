import React, { Component } from 'react';
import { Button, Navbar, NavbarBrand, NavItem, NavLink, Nav, Card, CardBody, CardImg, CardText, CardLink,
  CardHeader, Row, Col} from 'reactstrap';
const axios = require('axios');

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
    this.state = {
      Movie: "http://127.0.0.1:8080/getVideo?videoName=" + this.props.match.url.substring(1)
		}


    this.getMovie = this.getMovie.bind(this);
	};
componentWillMount(){
  console.log(this.props.match.url.substring(1));

}
getMovie(name){
        axios.get("http://127.0.0.1:8080/getVideo1",{params: {videoName: name}})
		.then(res => {
			return res.data
		});

}

render() {
		return (
        <div>
        <link href="https://vjs.zencdn.net/7.4.1/video-js.css" rel="stylesheet" />

  <script src="https://vjs.zencdn.net/ie8/ie8-version/videojs-ie8.min.js"></script>
            <Navbar color="light" expand="md">
                <NavbarBrand href="/">FilmFlux</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/" onClick={this.logout}>Logout!</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
      <video id='my_video_1' class='video-js vjs-default-skin' controls preload='auto' width='1080p' height='720p'
          poster='MY_VIDEO_POSTER.jpg' data-setup='{}'>
          <source src={this.state.Movie} type='video/mp4' />
          <p class='vjs-no-js'>
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          <a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>
          </p>
      </video>
      <script src='https://vjs.zencdn.net/7.4.1/video.js'></script>
    </div>
      );

	}
}
export default VideoPlayer;
