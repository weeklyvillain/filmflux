import React, { Component } from 'react';
import './movie.css';
const apiServer = "http://" + window.location.hostname;
const apiPort = ":9876";

class AdminDash extends Component {
    constructor(props){ 
        super(props);
        this.state = {
          
        }
        this.getCookie = this.getCookie.bind(this);
        this.isUserAdmin = this.isUserAdmin.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    };

    isAuthenticated(){
      let token = this.getCookie('token')
        if(token === ""){
            window.location.href = "http://localhost:3000/login"
        }
    }

    isUserAdmin() {
      let endpoint = apiServer + apiPort + "/isAdmin";
      const body = { token: this.getCookie('token') };
        fetch(endpoint, {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            console.log(json['isAdmin']['isAdmin']);
            if(!json['isAdmin']['isAdmin']) {
              window.location.href = "http://localhost:3000"
            }
          });
    }

    componentWillMount() {
      this.isAuthenticated();
      this.isUserAdmin();
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
            <div>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>This is the admin Dashboard! this shit is under construction</h1>
            </div>
      );

	}
}
export default AdminDash;
