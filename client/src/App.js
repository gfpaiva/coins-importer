import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Header from './components/Header';
import Import from './pages/Import';
import List from './pages/List';
import NotFound from './pages/NotFound';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<div className="container">
						<Switch>
							<Route exact path="/" component={Import} />
							<Route path="/list" component={List} />
							<Route component={NotFound} />
						</Switch>
				</div>
			</div>
		);
	}
}

export default App;
