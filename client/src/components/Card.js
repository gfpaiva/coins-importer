import React, { Component } from 'react';

class Card extends Component {
	render() {
		return (
			<div className="card">
				<div className="card-header text-center" data-background-color={this.props.background}>
					<h4 className="title">{this.props.title}</h4>
					{(this.props.category ? <p className="category">{this.props.category}</p> : '' )}
				</div>
				<div className="card-content table-responsive">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Card;
