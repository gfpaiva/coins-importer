import React, { Component } from 'react';

class Feedback extends Component {
	render() {
		if(!this.props.msg) {
			return null;
		}

		return (
			<div className={`alert alert-${this.props.msg.type}`}><span>{this.props.msg.text}</span></div>
		);
	}
}

export default Feedback;
