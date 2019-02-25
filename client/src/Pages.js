import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';
import VideoPlayer from './VideoPlayer';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={App} />
			<Route path='/:id' component={VideoPlayer} />
		</Switch>
	</BrowserRouter>
)

export default Pages;
