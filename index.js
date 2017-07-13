require('dotenv').config();

const express = require('express'),
	app = express(),
	server = require('http').Server(app),
	basicAuth = require('express-basic-auth'),
	api = express.Router(),
	xlsx = require('node-xlsx'),
	axios = require('axios'),
	cors = require('cors'),
	multer  = require('multer'),
	storage = multer.diskStorage({
		destination: './upload/',
		filename: function ( req, file, cb ) {
			cb( null, 'apuracao.xlsx' );
		}
	}),
	upload = multer({ storage: storage }),
	io = require('socket.io')(server);

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

api.route('/upload')
	.put(upload.single('sheet'), (req, res) => {
		res.json({message:'File Uploaded!'});
		return;
	});

api.route('/list')
	.get((req, res) => {
		let xlsFile = xlsx.parse(`${__dirname}/upload/apuracao.xlsx`);

		xlsFile = xlsFile[0].data.filter(value => (value[0] === "true" && value[5] > 0 && /\d+/.test(value[1])))
								.sort((a, b) => b[5]-a[5])
								.map((value, index) => {
									return {
										id: value[1],
										email: value[2],
										indicados: value[3],
										indicaram: value[4],
										moedas: value[5],
										ranking: ++index
									}
								});

		res.json(xlsFile);
	})

api.route('/sync')
	.get((req, res) => {
		let xlsFile = xlsx.parse(`${__dirname}/upload/apuracao.xlsx`);

		xlsFile = xlsFile[0].data.filter(value => (value[0] === "true" && value[5] > 0 && /\d+/.test(value[1])))
								.sort((a, b) => b[5]-a[5])
								.map((value, index) => {
									return {
										id: value[1],
										email: value[2],
										indicados: value[3],
										indicaram: value[4],
										moedas: value[5],
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
			}, 100);
		};

		let requests = xlsFile.map(value => {
			return new Promise(resolve => {
				apiCall(value, resolve);
			});
		});

		Promise.all(requests)
				.then(() => {
					res.json({msg: 'data sync!'});
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

server.listen(process.env.PORT || 3000, () => {
	console.log(`running on ${process.env.PORT || 3000}`);
});

