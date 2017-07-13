import React, { Component } from 'react';
import Card from '../components/Card';
import Load from '../components/Load';
import Feedback from '../components/Feedback';
import API from '../services/API';

class Import extends Component {
	constructor() {
		super();

		this.fileStyle = {
			border: '1px solid rgba(0,0,0,.2)',
			boxShadow: '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)',
			cursor: 'pointer',
			padding: '1em',
			width: '100%'
		};

		this.state = {msg: null, load: false};
	};

	_handleSubmit(e) {
		e.preventDefault();
		let formData = new FormData();
		formData.append(this.file.name, this.file.files[0]);

		this.setState({load: true});

		API.upload(formData)
			.then(() => {
				this.file.value = '';

				return API.sync();
			})
			.then(() => {
				this.setState({msg: {type: 'success', text:'File uploaded and synced!'}, load: false});
			})
			.catch(error => {
				this.setState({msg: {type: 'success', text:`Cannot upload the file ${error}`}, load: false});
			});
	};

	render() {
		return (
			<div className="col-md-12">
				<Load load={this.state.load} />
				<Card background="purple" title="Import Sheet">
					<Feedback msg={this.state.msg} />
					<form action="#" method="post" onSubmit={this._handleSubmit.bind(this)}>
						<input type="file" name="sheet" id="sheet" required accept=".xls, .xlsx" style={this.fileStyle} ref={input => this.file = input} />
						<button type="submit" className="btn btn-primary pull-right"><i className="glyphicon glyphicon-cloud-upload"></i> Upload</button>
					</form>
				</Card>
			</div>
		);
	}
}

export default Import;
