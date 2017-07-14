import io from 'socket.io-client';

class Socket {
	constructor(cb) {
		this.socket = io('http://localhost:3001');

		this.socket.on('connect', () => {
			console.log('conect');
		});

		this.socket.on('sync.single', data => {
			console.log('single', data);
			cb.single();
		});

		this.socket.on('sync.end', data => {
			console.log('end', data);
			cb.end();
		});
	}
};

export default Socket;