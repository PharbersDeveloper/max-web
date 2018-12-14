import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.getData();
		this.set('marketAndTime', false);
	},
	getData() {
		let company_id = localStorage.getItem('company_id');
		let user_id = localStorage.getItem('username');
		let req = this.store.createRecord('phmaxjob', {
			user_id: user_id,
			company_id: company_id,
		})
		let result = this.store.object2JsonApi('phmaxjob', req);

		this.store.queryObject('/api/v1/maxjobgenerate/0', 'phmaxjob', result).then((res) => {
			localStorage.setItem('job_id', res.job_id)
			localStorage.setItem('company_id', res.company_id)
		});
	},
	actions: {
		next(panel) {
			this.set('panel', panel);
			this.set('marketAndTime', true);
			console.log('marketAndTime');
		},
		nextStep() {
			let panel = this.get('panel');
            /**
             * 原逻辑
             */
			this.store.peekAll('phmaxjob').lastObject.set('panel', panel);
			this.store.peekAll('phmaxjob').lastObject.set('panelfime', panel);

			this.store.peekAll('phmaxjob').lastObject.set('call', 'ymCalc');
			let req = this.store.peekAll('phmaxjob').lastObject;
			let result = this.store.object2JsonApi('phmaxjob', req, false);
			// let result = this.store.object2JsonApi('phmaxjob', req, false);

			// TODO：Alex这块儿可能有问题
			this.store.peekAll('phmaxjob').lastObject.set('panel', '');
			this.store.peekAll('phmaxjob').lastObject.set('panelfime', '');

			this.store.queryObject('/api/v1/maxjobpushpanel/0', 'phmaxjob', result).then((resp) => {
				// if (!isEmpty(resp.data.attrubutes.panel)) {
				// localStorage.setItem('not_arrival_hosp_file', resp.not_arrival_hosp_file);
				console.log(resp);
				console.log(resp.panel);
				console.log(resp.panelfime);
				localStorage.setItem('panel', resp.panel);
				this.transitionToRoute('/add-data/check-sample-panel');
			})

		}
	},

});
