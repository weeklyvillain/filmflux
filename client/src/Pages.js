import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';
import Login from './Login';
import Movie from './Movie';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={App} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/:id' component={Movie} />
		</Switch>
	</BrowserRouter>
)

export default Pages;
