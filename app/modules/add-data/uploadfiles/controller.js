import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	uploadfilesRoute: service('add_data.uploadfiles_route'),
	uploadfilesController: service('add_data.uploadfiles_controller'),
	getData() {
		/**
		 * TODO userId === userName ?
		*/
		let companyId = localStorage.getItem('company_id'),
			userId = localStorage.getItem('username'),
			req = this.get('uploadfilesController').createModel('Phmaxjob', {
				id: this.get('hash').uuid(),
				'user_id': userId,
				'company_id': companyId
			}),
			result = this.get('uploadfilesRoute').object2JsonApi(req);

		this.get('uploadfilesRoute').queryObject('api/v1/maxjobgenerate/0', 'Phmaxjob', result)
			.then((res) => {
				localStorage.setItem('job_id', res.job_id);
				localStorage.setItem('company_id', res.company_id);
			});

	},
	init() {
		this._super(...arguments);
		this.getData();
	},
	actions: {
		next(cpa, gycx) {
			let req = this.get('uploadfilesController').queryModelByAll('Phmaxjob').lastObject,
				result = null;

			req.set('cpa', cpa);
			req.set('gycx', cpa);
			req.set('call', 'ymCalc');
			result = this.get('uploadfilesRoute').object2JsonApi(req, false);

			this.get('uploadfilesRoute').queryObject('api/v1/maxjobpush/0', 'Phmaxjob', result)
				.then((resp) => {
					if (!isEmpty(resp.not_arrival_hosp_file)) {
						localStorage.setItem('not_arrival_hosp_file', resp.not_arrival_hosp_file);
						localStorage.setItem('cpa', resp.cpa);
						localStorage.setItem('gycx', resp.gycx);
						this.transitionToRoute('add-data.generate-sample');
					} else {
						window.console.log('error route!!!!!');
					}
				});
		}
	}
});
