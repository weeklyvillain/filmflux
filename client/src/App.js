import React, { Component } from 'react';
import { Button, Navbar, NavbarBrand, NavItem, NavLink, Nav, Card, CardBody, CardImg, CardText, CardLink,
  CardHeader, Row, Col} from 'reactstrap';
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
                <NavbarBrand href="/">FilmFlux</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/" onClick={this.logout}>Logout!</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
      <div id="movieFeed">
      <Row>
            {Object.keys(this.state.movies).map((name) =>
<<<<<<< HEAD
                    <Col xs="auto" key={name}>
                    <a  href={"/" + name}>
                      <Card class="movie-frame" id={name}>
                        <CardHeader>{name}</CardHeader>
                          <CardBody>
                            <CardImg top width="100%" src="antman.jpg" alt="Sorry No Poster Found" />
                          </CardBody>
                        </Card>
                      </a>
                    </Col>
=======

                <Card nameclass="movie" id={name} key={name}>
                    <CardBody>
                        <CardTitle>{name}</CardTitle>
                            <CardImg alt="Sorry No Poster Found"></CardImg>
                            <Player src={"http://127.0.0.1:8080/getVideo?videoName=" + name} />
                    </CardBody>
                </Card>
>>>>>>> 5132c2a2c29f778edffb7e82541f573ba24a680e
            )}
            </Row>
      </div>

    </div>
      );

	}
}
export default App;
