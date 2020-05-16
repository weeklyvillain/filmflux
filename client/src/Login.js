import React, { Component } from 'react';
import './login.css'
const apiServer = "http://" + window.location.hostname;
const apiPort = ":9876";

class Login extends Component {
	constructor(props) {
        super(props);
    this.state = {
        username: "",
        password: "",
    }
    
    this.login = this.login.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    };

    componentDidMount(){
        // Get the input field
        var loginForm = document.getElementById("loginForm");

        // Execute a function when the user releases a key on the keyboard
        loginForm.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("loginButton").click();
        }
});
    }
    handleUsername(e) {
        this.setState({username: e.target.value})
    }
    handlePassword(e) {
        this.setState({password: e.target.value})
    }

    login() {
        let endpoint = apiServer + apiPort + "/login"
        console.log(endpoint);

        
        const body = { username: this.state.username, password: this.state.password};
 
        fetch(endpoint, {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if(json['loggedIn'] === true) {
                document.cookie = `token=${json['token']};`;
                window.location.href = `http://${window.location.hostname}:3000`
            }
            console.log(json.error)
            if(json['error'] === "user/password"){
                document.getElementById("errorBox").style.display = "block";
                document.getElementById("error").innerHTML = "Incorrect Username/password"
            }
        });
        return false;
    }

	render() {
		return (
            <div id="loginForm">
            <div id="errorBox">
                <p id="error"></p>
            </div>
            <img id="logo" src="logo.png" alt="Logotype" />
            <form>
                <fieldset id="inputs">
                    <input type="text" required id="username" name="username" placeholder="Username" onChange={this.handleUsername} />
                    <input type="password" required id="password" name="password" placeholder="Password" onChange={this.handlePassword} />
                    <button type="button" id="loginButton" onClick={this.login}><span>Login</span></button>
                </fieldset>
            </form>
            
        </div>
      );

	}
}
export default Login;
