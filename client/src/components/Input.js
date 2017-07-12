import React, { Component } from 'react';

class Input extends Component {
	render() {
		return (
			<div className="form-group label-floating is-empty">
				<input {...this.props} className="form-control"/>
				<span className="material-input"></span>
			</div>
		);
	}
}

export default Input;