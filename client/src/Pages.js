import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';
import Login from './Login';
import AdminDash from './AdminDash';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={App} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/admin_dashboard' component={AdminDash} />
		</Switch>
	</BrowserRouter>
)

export default Pages;
