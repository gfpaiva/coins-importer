import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		localStorage.getItem('auth-token') ? (
			<Component {...props}/>
		) : (
			<Redirect to='/login'/>
		)
	)}/>
);

export default AuthenticatedRoute;