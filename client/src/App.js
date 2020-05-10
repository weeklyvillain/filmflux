import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, Card, CardBody, CardImg,
  CardHeader, Row, Col} from 'reactstrap';
import "video-react/dist/video-react.css"; // import css
const axios = require('axios');

const apiServer = "http://localhost";
const apiPort = ":9876";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
        searchedMovies: [],
        movies: [],
        root_class: "",
        card_class: "",
        nav_class: "",
        themeBtn: "Dark Theme"
		}
		this.getMovies = this.getMovies.bind(this);
    this.getMovie = this.getMovie.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.search = this.search.bind(this);
    this.createMovieList = this.createMovieList.bind(this);
	};

	getMovies(){
		axios.get(apiServer + apiPort)
		.then(res => {
      let movie_list = []
      for(var [key, val] of Object.entries(res.data)) {
        movie_list.push(val);
      }
      movie_list.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
      
			this.setState({movies: movie_list, searchedMovies: movie_list});
      console.table(movie_list);
			}
		);
    }

    getMovie(id){
        axios.get(apiServer + apiPort + "/getVideo",{params: {movieID: id}})
		.then(res => {
			return res.data
		});
    }

	componentWillMount() {
		this.getMovies();
  }

  toggleTheme() {
		if(this.state.themeBtn == "Dark Theme") {
      this.setState({root_class: "root-dark", card_class: "card-dark", nav_class: "nav-dark",themeBtn: "Light Theme"});
    } else {
      this.setState({root_class: "", card_class: "", nav_class: "", themeBtn: "Dark Theme"})
    }
  }

  search(e) {
    console.log(e.target.value)
    if (e.target.value == "") {
      this.setState({searchedMovies: this.state.movies})
    } else {
      let search_list = []
      console.log(this.state.movies)
      for(let id in this.state.movies) {
        
        if(this.state.movies[id].Title.toLowerCase().includes(e.target.value.toLowerCase())){
          search_list.push(this.state.movies[id])
        }
      }
      this.setState({searchedMovies: search_list})
    }
  }

  createMovieList() {
    let movie_list = []
    this.state.searchedMovies.map((obj, index) =>
      movie_list.push(
      <Col xs="auto" key={obj.Title}>
      <a href={"filmflux://" + apiServer + apiPort + "/getVideo/" + obj.movie_id + "/filip/" + obj.Title} rel="noopener noreferrer">
        <Card className={"movie-frame " + this.state.card_class} id={obj.Title}>
            <CardBody>
              <CardImg top width="100%" src={obj.Poster} alt="Sorry No Poster Found" />
            </CardBody>
          <CardHeader>{obj.Title}</CardHeader>
          </Card>
        </a>
      </Col>)
   )
   return movie_list
  }

	render() {
		return (
        <div className={this.state.root_class}>


        <link href="https://vjs.zencdn.net/7.2.3/video-js.css" rel="stylesheet" />
        <script src="https://vjs.zencdn.net/7.2.3/video.js"></script>
            <Navbar className={this.state.nav_class + " fixed-top"} color="light" expand="md">
                <NavbarBrand href="/">FilmFlux</NavbarBrand>
          <Nav className="ml-auto" navbar>
                <form className="form-inline">
                  <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={this.search}></input>
                </form>
              <NavItem>
                <NavLink href="#" onClick={this.toggleTheme}>{this.state.themeBtn}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/" onClick={this.logout}>Logout!</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
      <div id="movieFeed">
      <Row>
            {this.createMovieList()}
            </Row>
      </div>

    </div>
      );

	}
}
export default App;
