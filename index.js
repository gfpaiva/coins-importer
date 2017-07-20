require('dotenv').config();

const express = require('express'),
	app = express(),
	server = require('http').Server(app),
	basicAuth = require('express-basic-auth'),
	api = express.Router(),
	path = require('path'),
	xlsx = require('node-xlsx'),
	axios = require('axios'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	timeout = require('connect-timeout'),
	multer  = require('multer'),
	storage = multer.diskStorage({
		destination: './upload/',
		filename: function ( req, file, cb ) {
			cb( null, 'apuracao.xlsx' );
		}
	}),
	upload = multer({ storage: storage });
	/*io = require('socket.io')(server);*/

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(bodyParser.json());
app.use(cors());

let authUser = {};
authUser[process.env.APP_AUTH_USER] = process.env.APP_AUTH_PASS;

const auth = basicAuth({
	users: authUser,
	challenge: true,
	realm: 'jussi',
	unauthorizedResponse: function(req){ return 'Login failure!' }
});

api.route('/login')
	.post((req, res) => {
		if( req.body.user === process.env.APP_AUTH_USER
			&& req.body.password === process.env.APP_AUTH_PASS ) {
				res.json({access: true});
				return;
		}

		res.status(401).json({access: false});
		return;
	});

api.route('/upload')
	.put(auth, upload.single('sheet'), (req, res) => {
		res.json({message:'File Uploaded!'});
		return;
	});

api.route('/list')
	.get(auth, (req, res) => {
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
		return;
	})

api.route('/sync')
	.get(auth, timeout('150s'), (req, res) => {
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

		const apiCall = (value, rs, rj) => {
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
					rs();
				})
				.catch(error => {
					rj();
			});
		};

		let requests = xlsFile.map(value => {
				return new Promise((resolve, reject) => {
					setImmediate(() => {
						apiCall(value, resolve, reject);
					});
				});
		});

		Promise.all(requests)
				.then(() => {
					requests = xlsFile = [];
					res.json({msg: 'sync done!'});
				})
				.catch(() => {
					requests = xlsFile = [];
					res.status(501).json({msg: 'sync error!'});
				});

		return;
	});

app.use('/api', api);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
	return;
})

server.listen(process.env.PORT || 3000, () => {
	console.log(`running on ${process.env.PORT || 3000}`);
});

