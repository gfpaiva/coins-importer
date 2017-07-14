import React, { Component } from 'react';
import Card from '../components/Card';
import Load from '../components/Load';
import Feedback from '../components/Feedback';
import API from '../services/API';


class Import extends Component {
	constructor() {
		super();

		this.state = {list: [], load: true, msg: ''};
	};

	_sync(e) {
		e.preventDefault();

		this.setState({load: true});

		API.sync()
			.then(() => {
				this.setState({msg: {type:'success', text: `Dados Sincronizados`}, load: false});
			})
			.catch(error => {
				this.setState({msg: {type:'warning', text: `Não foi possível sincronizar os dados ${error}`}, load: false});
			});
	};

	componentDidMount() {
		API.list()
			.then(response => {
				this.setState({list: response.data, load: false, total: response.data.length, done: 0});
			})
			.catch(error => {
				this.setState({msg: {type:'warning', text: `Não foi possível carregar os dados ${error}`}, load: false});
			});
	};

	componentWillUnmount() {
		this.socket = null;
	}

	render() {
		return (
			<div className="col-md-12">
				<Load load={this.state.load} />
				<button className="btn btn-primary pull-right" onClick={this._sync.bind(this)}><i className="glyphicon glyphicon-refresh"></i> Sync this list in VTEX</button>
				<Card background="purple" title="Current List XLSX">
					<Feedback msg={this.state.msg} />
					<table className="table">
						<thead className="text-primary">
							<tr>
								<th>Document</th>
								<th>Email</th>
								<th>Indicados</th>
								<th>Indicaram</th>
								<th>Moedas</th>
								<th>Ranking</th>
							</tr>
						</thead>
						<tbody>
							{this.state.list.map(colab => {
								return (
									<tr key={colab.id}>
										<td>{colab.id}</td>
										<td>{colab.email}</td>
										<td>{colab.indicados}</td>
										<td>{colab.indicaram}</td>
										<td>{colab.moedas}</td>
										<td className="text-primary">{colab.ranking}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</Card>
			</div>
		);
	}
}

export default Import;
