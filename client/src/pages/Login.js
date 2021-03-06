import React, { Component } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Feedback from '../components/Feedback';
import API from '../services/API';
import { Redirect } from 'react-router-dom';

class Login extends Component {
	constructor() {
		super();

		this.state = {user: '', password: '', msg: null, redirect: false};
	};

	componentDidMount() {
		if(localStorage.getItem('auth-token')) {
			this.setState({redirect: true});
		}
	}

	_handleChange(e) {
		let obj = {};

		obj[e.target.name] = e.target.value;
		this.setState(obj);
	};

	_handleSubmit(e) {
		e.preventDefault();

		let authData = {user: this.state.user, password: this.state.password};

		API.login(authData)
			.then(response => {
				this.setState({user:'', password: '', msg: '', redirect: true});
			})
			.catch(error => {
				this.setState({msg: {type:'warning', text: `Não foi possível efetuar o login ${error}`}});
			});
	};

	render() {
		if(this.state.redirect) {
			return (
				<Redirect to='/'/>
			);
		}

		return (
			<div className="container">
				<div className="col-md-12">
					<Card background="purple" title="Login" category="Enter Username and Pass">
						<Feedback msg={this.state.msg} />
						<form action="#" method="post" onSubmit={this._handleSubmit.bind(this)}>
							<Input type="text" name="user" id="user" placeholder="Login" required value={this.state.user} onChange={this._handleChange.bind(this)} />
							<Input type="password" name="password" id="password" placeholder="Password" required value={this.state.password} onChange={this._handleChange.bind(this)} />
							<button type="submit" className="btn btn-primary pull-right">Enter<div className="ripple-container"></div></button>
						</form>
					</Card>
				</div>
			</div>
		);
	}
}

export default Login;
