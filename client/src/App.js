import React, { Component } from 'react';
import { Button, Navbar, NavbarBrand, NavItem, NavLink, Nav, Card, CardBody, CardImg, CardText, CardLink,
  CardTitle} from 'reactstrap';
import "video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';
const axios = require('axios');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
				movies: {},
                tmpMovieLink: ""
		}
		this.getMovies = this.getMovies.bind(this);
        this.getMovie = this.getMovie.bind(this);
	};

	getMovies(){
		axios.get("http://127.0.0.1:8080/")
		.then(res => {
				this.setState({movies: res.data});
                console.table(this.state.movies);
			}
		);
    }

    getMovie(name){
        axios.get("http://127.0.0.1:8080/getVideo",{params: {videoName: name}})
		.then(res => {
			return res.data
		});
    }

	componentWillMount() {
		this.getMovies();
	}


	render() {
		return (
        <div>
        <link href="https://vjs.zencdn.net/7.2.3/video-js.css" rel="stylesheet" />
        <script src="https://vjs.zencdn.net/7.2.3/video.js"></script>
            <Navbar color="light" expand="md">
                <NavbarBrand href="/">witter</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Back</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/" onClick={this.logout}>Logout!</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
      <div id="movieFeed">
            {Object.keys(this.state.movies).map((name) =>

                <Card nameclass="movie" id={name} key={name}>
                    <CardBody>
                        <CardTitle>{name}</CardTitle>
                            <CardImg alt="Sorry No Poster Found"></CardImg>
                            <Player src={"http://127.0.0.1:8080/getVideo?videoName=" + name} />
                    </CardBody>
                </Card>
            )}
      </div>
    </div>
      );

	}
}
export default App;
