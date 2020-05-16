import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, Card, CardBody, CardImg,
  CardHeader} from 'reactstrap';

const axios = require('axios');
console.log(window.location.hostname)
const apiServer = "http://127.0.0.1";
const apiPort = ":9876";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
        searchedMovies: [],
        movies: [],
        root_class: "root-dark",
        card_class: "dark",
        nav_class: "nav-dark",
        themeBtn: "Light Theme"
		}
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getMovie = this.getMovie.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.search = this.search.bind(this);
    this.createMovieList = this.createMovieList.bind(this);
    this.logout = this.logout.bind(this);
    this.getCookie = this.getCookie.bind(this);
	};

	getMovies(){
    console.log(apiServer + apiPort)
		axios.get(apiServer + apiPort)
		.then(res => {
      let movie_list = []
      for(var val of Object.values(res.data)) {
        movie_list.push(val);
      }
      movie_list.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
      
			this.setState({movies: movie_list, searchedMovies: movie_list});
      console.table(movie_list);
			}
		);
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
    
    isAuthenticated(){
      let token = this.getCookie('token')
        if(token === ""){
            window.location.href = "http://localhost:3000/login"
        }
    }

    logout(){
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    getMovie(id){
        axios.get(apiServer + apiPort + "/getVideo",{params: {movieID: id}})
		.then(res => {
			return res.data
		});
    }

	componentWillMount() {
    this.isAuthenticated();
		this.getMovies();
  }

  toggleTheme() {
		if(this.state.themeBtn === "Dark Theme") {
      this.setState({root_class: "root-dark", card_class: "card-dark", nav_class: "nav-dark",themeBtn: "Light Theme"});
    } else {
      this.setState({root_class: "", card_class: "", nav_class: "", themeBtn: "Dark Theme"})
    }
  }

  search(e) {
    console.log(e.target.value)
    if (e.target.value === "") {
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
      <a key={obj.Title} href={`filmflux://${apiServer + apiPort}/getVideo/${obj.movie_id}/${this.getCookie("token")}/${obj.Title}`} rel="noopener noreferrer">
        <Card className={"movie-frame " + this.state.card_class} id={obj.Title}>
            <CardBody>
              <CardImg top width="100%" src={obj.Poster} alt="Sorry No Poster Found" />
            </CardBody>
          {false && <CardHeader>{obj.Title}</CardHeader>}
          </Card>
        </a>)
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
        {this.createMovieList()}
      </div>

    </div>
      );

	}
}
export default App;
