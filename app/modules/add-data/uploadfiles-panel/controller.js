import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	uploadfilesPanelRoute: service('add_data.uploadfiles_panel_route'),
	uploadfilesPanelController: service('add_data.uploadfiles_panel_controller'),

	init() {
		this._super(...arguments);
		this.getData();
		this.set('marketAndTime', false);
	},
	getData() {
		let userId = localStorage.getItem('company_id'),
			companyId = localStorage.getItem('username'),
			req = this.get('uploadfilesPanelController').createModel('Phmaxjob', {
				id: this.get('hash').uuid(),
				'user_id': userId,
				'company_id': companyId
			}),
			result = null;

		result = this.get('uploadfilesPanelRoute').object2JsonApi(req);

		this.get('uploadfilesPanelRoute').queryObject('api/v1/maxjobgenerate/0', 'Phmaxjob', result)
			.then((res) => {
				localStorage.setItem('job_id', res.job_id);
				localStorage.setItem('company_id', res.company_id);
			});
	},
	actions: {
		next(panel) {
			this.set('panel', panel);
			this.set('marketAndTime', true);
		},
		nextStep() {
			let panel = this.get('panel'),
				market = this.get('panelMarket'),
				month = this.get('panelMonth'),
				req = null,
				result = null;

			/**
			 * 原逻辑 这样写绝逼会出现问题，不过先不改，等第一波通过后重构逻辑
			 */
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('panel', panel);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('panelMkt', market);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('yms', month);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('call', 'ymCalc');

			req = this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject;
			result = this.get('uploadfilesPanelRoute').object2JsonApi(req, false);

			this.get('uploadfilesPanelRoute').queryObject('api/v1/maxjobpushpanel/0', 'Phmaxjob', result)
				.then((resp) => {
					this.get('logger').log(resp);
					this.get('logger').log(resp.panel);
					this.get('logger').log(resp.panelfime);
					localStorage.setItem('panel', resp.panel);
					this.transitionToRoute('add-data.check-sample-panel');
				});

		}
	}
});
