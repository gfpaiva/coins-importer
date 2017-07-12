import React, { Component } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends Component {
	constructor() {
		super();

		this.state = {user: '', password: '', msg: '', redirect: false};
	};

	_handleChange(e) {
		let obj = {};

		obj[e.target.name] = e.target.value;
		this.setState(obj);
	};

	_handleSubmit(e) {
		e.preventDefault();

		let authData = btoa(`${this.state.user}:${this.state.password}`);

		axios({
			url: `http://localhost:3001/api/login`,
			method: 'get',
			headers: {
				'Authorization': `Basic ${authData}`
			}
		})
		.then(response => {
			if(response.status === 200 && response.data.access) {
				this.setState({user:'', password: '', msg: '', redirect: true});
				localStorage.setItem('auth-token', authData);
			}
		})
		.catch(error => {
			this.setState({msg: `Não foi possível efetuar o login ${error}`});
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
						{(this.state.msg) ? <div className="alert alert-warning"><span>{this.state.msg}</span></div> : null }
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
