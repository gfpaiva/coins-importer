import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

class Header extends Component {
	constructor() {
		super();

		this.fontStyle = {
			fontSize: '22px'
		};
	};

	render() {
		return (
			<nav className="navbar">
				<div className="container-fluid">
					<div className="navbar-header">
						<p className="navbar-brand">Campanha MGM</p>
					</div>
					<div className="collapse navbar-collapse">
						<ul className="nav navbar-nav navbar-right">
							<li>
								<NavLink exact activeStyle={{color: 'purple'}} to="/" title="Import" style={this.fontStyle}>
									<i className="glyphicon glyphicon-cloud-upload"></i>
								</NavLink>
							</li>
							<li>
								<NavLink exact activeStyle={{color: 'purple'}} to="/list" title="List" style={this.fontStyle}>
									<i className="glyphicon glyphicon-th-list"></i>
								</NavLink>
							</li>
							<li>
								<Link to="/logout" title="Logout" style={this.fontStyle}>
									<i className="glyphicon glyphicon-off"></i>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Header;
