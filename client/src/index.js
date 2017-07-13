import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './css/material-dashboard.css';
import App from './App';
import Login from './pages/Login';
import Logout from './pages/Logout';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AuthenticatedRoute from './services/AuthenticatedRoute';

ReactDOM.render(
	<Router>
		<div>
			<AuthenticatedRoute component={App} />
			<Route path="/login" component={Login} />
			<Route path="/logout" component={Logout} />
		</div>
	</Router>,
	document.getElementById('root'));
