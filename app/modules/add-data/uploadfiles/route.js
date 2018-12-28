import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	uploadfilesRoute: service('add_data.uploadfiles_route'),
	uploadfilesController: service('add_data.uploadfiles_controller'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	model() {
		// 你的逻辑

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
	actions: {
		// 你的动作
	}
});
