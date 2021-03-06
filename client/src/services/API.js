import axios from 'axios';

class API {
	constructor() {
		this.base = `/api`;
		this.auth = localStorage.getItem('auth-token');
	}

	list() {
		return axios({
					url: `${this.base}/list`,
					method: 'get',
					headers: {
						'Authorization': `Basic ${this.auth}`
					}
				});
	};

	upload(formData) {
		return axios({
					url: `${this.base}/upload`,
					method: 'put',
					headers: {
						'Authorization': `Basic ${this.auth}`
					},
					data: formData,
					onUploadProgress: function(progressEvent) {
						console.log('here', Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
					}
				});
	};

	sync() {
		return axios({
					url: `${this.base}/sync`,
					method: 'get',
					headers: {
						'Authorization': `Basic ${this.auth}`
					}
				});
	};

	login(authData) {
		return axios({
					url: `${this.base}/login`,
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: authData
				})
				.then(response => {
					if(response.status === 200 && response.data.access) {
						this.auth = btoa(`${authData.user}:${authData.password}`);
						localStorage.setItem('auth-token', this.auth);

						return response;
					}
				});
	}

};

export default new API();