import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';
import Login from './Login';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={App} />
			<Route exact path='/login' component={Login} />
		</Switch>
	</BrowserRouter>
)

export default Pages;
