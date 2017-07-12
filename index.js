require('dotenv').config();

const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const api = express.Router();
const xlsx = require('node-xlsx');
const axios = require('axios');
const cors = require('cors');

app.use(cors());

app.use(basicAuth({
	users: {'whirlpool':'1234'},
	challenge: true,
	realm: 'jussi',
	unauthorizedResponse: function(req){ return 'Login failure!' }
}));

api.route('/login')
	.get((req, res) => {
		res.json({user: req.auth.user, password: req.auth.password, access: true});
		return;
	});

api.route('/sync')
	.get((req, res) => {
		let xlsFile = xlsx.parse(`${__dirname}/upload/Apuracao-alterado.xls`);

		xlsFile = xlsFile[0].data.filter(value => value[4] > 0)
								.sort((a, b) => b[4]-a[4])
								.map((value, index) => {
									return {
										id: value[0],
										email: value[1],
										indicados: value[2],
										indicaram: value[3],
										moedas: value[4],
										ranking: ++index
									}
								});

		let apiCall = (value, cb) => {
			setTimeout(() => {
				return axios({
							method: 'PATCH',
							url: `http://api.vtex.com/${process.env.VTEX_ACCOUNTNAME}/dataentities/MC/documents`,
							headers: {
								'Content-Type': 'application/json',
								'Cache-Control': 'no-cache',
								'x-vtex-api-appKey': process.env.VTEX_AUTH_USER,
								'x-vtex-api-appToken': process.env.VTEX_AUTH_PASS,
								'Accept': 'application/vnd.vtex.ds.v10+json'
							},
							data: JSON.stringify(value)
						})
						.then(() => {
							cb();
							return true;
						})
						.catch(() => false);
			}, 500);
		};

		let requests = xlsFile.map(value => {
			return new Promise(resolve => {
				apiCall(value, resolve);
			});
		})

		Promise.all(requests)
				.then(() => {
					res.json({msg: 'import!'});
				})
				.catch(() => {
					res.json({msg: 'cannot import!'});
				});

		return;
	});

app.use('/api', api);

app.get('*', (req, res) => {
	res.status(404).json({error: 'Not found!'});
	return;
})

app.listen(process.env.PORT || 3000, () => {
	console.log(`running on ${process.env.PORT || 3000}`);
});

