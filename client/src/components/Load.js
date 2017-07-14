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
		};

		this.textStyle = {
			alignSelf: 'center',
			color: 'white',
			fontSize: '22px',
			textAlign: 'center',
			width: '100%'
		};

		this.imageStyle = {
			width: 'auto'
		};

	}
	render() {
		if(!this.props.load) {
			return null;
		}

		return (
			<div style={this.loaderStyle}>
				<span style={this.textStyle}>
					<img src={loader} width="30" height="30" style={this.imageStyle} /> Loading
				</span>
			</div>
		);
	}
}

export default Load;
