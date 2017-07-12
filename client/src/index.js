import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './css/material-dashboard.css';
import App from './App';
import Login from './pages/Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AuthenticatedRoute from './services/AuthenticatedRoute';

ReactDOM.render(
	<Router>
		<Switch>
			<AuthenticatedRoute exact path="/" component={App} />
			<Route path="/login" component={Login} />
		</Switch>
	</Router>,
	document.getElementById('root'));
