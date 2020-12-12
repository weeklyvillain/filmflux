import React, { Component } from 'react';
import './adminDash.css';

const axios = require('axios');
const apiServer = "http://" + window.location.hostname;
const apiPort = ":9876";

class AdminDash extends Component {
    constructor(props){ 
        super(props);
        this.state = {
          cpuInfo: '0%',
          memInfo: '0mb',
          driveInfo: '0mb'
        }
        this.getCookie = this.getCookie.bind(this);
        this.isUserAdmin = this.isUserAdmin.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getServerStats = this.getServerStats.bind(this);
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

    getServerStats() {
    axios.get(apiServer + apiPort + '/getServerStats')
      .then(res => {
        console.log(res)
        this.setState({cpuInfo: {usage: res.data.cpuUsage, cores: res.data.cores}, memInfo: res.data.memInfo, driveInfo: res.data.hdd});
        }
      );
    }

    componentWillMount() {
      this.isAuthenticated();
      this.isUserAdmin();
      this.getServerStats();
    }

    componentDidMount() {
      this.getServerStats();
      this.interval = setInterval(() => {
        this.getServerStats();
      }, 2000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
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
            <div id="adminDashWrapper">
                <h1>This is the admin Dashboard! this shit is under construction</h1>
                <h1>-----------------------------------------------------------------------------------------------</h1>
                <h1>Cpu Cores: {this.state.cpuInfo.cores}</h1>
                <h1>Cpu Usage: {Math.round(this.state.cpuInfo.usage)}%</h1>
                <h1>Total Memory: {this.state.memInfo.totalMemMb}MB</h1>
                <h1>Memory Usage: {Math.round(100 - this.state.memInfo.freeMemPercentage)}%</h1>
                <h1>Total Hdd Space: {this.state.driveInfo.totalGb}GB</h1>
                <h1>Used Hdd Space: {this.state.driveInfo.usedGb}GB</h1>
                <h1>-----------------------------------------------------------------------------------------------</h1>
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
