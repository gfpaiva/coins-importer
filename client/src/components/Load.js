import React, { Component } from 'react';
import loader from '../images/loader.gif';

class Load extends Component {
	constructor() {
		super();

		this.loaderStyle = {
			background: 'rgba(0,0,0,.75)',
			display: 'flex',
			height: '100%',
			left: '0',
			position: 'fixed',
			top: '0',
			width: '100%',
			zIndex: '999'
		}

		this.textStyle = {
			alignSelf: 'center',
			color: 'white',
			fontSize: '22px',
			textAlign: 'center',
			width: '100%'
		}
	}
	render() {
		if(!this.props.load) {
			return null;
		}

		return (
			<div style={this.loaderStyle}>
				<span style={this.textStyle}><img src={loader} /> Loading</span>
			</div>
		);
	}
}

export default Load;
