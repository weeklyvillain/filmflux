import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={App} />
		</Switch>
	</BrowserRouter>
)

export default Pages;
