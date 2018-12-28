import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	viewresultsRoute: service('add_data.viewresults_route'),
	viewresultsController: service('add_data.viewresults_controller'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	model() {
		let companyId = localStorage.getItem('company_id'),
			jobId = localStorage.getItem('job_id'),
			req = this.get('viewresultsController').createModel('SampleCheckSelecter', {
				id: this.get('hash').uuid(),
				res: 'phselecter',
				'company_id': companyId,
				'job_id': jobId
			});

		this.get('viewresultsRoute').queryObject('api/v1/samplecheckselecter/0', 'SampleCheckSelecter', this.get('viewresultsRoute').object2JsonApi(req))
			.then((res) => {
				if (res !== '') {
					this.controller.set('markets', res.mkt_list);
					this.controller.set('years', res.ym_list); // 下拉窗数据
					this.controller.set('market', res.mkt_list[0]);
					this.controller.set('year', res.ym_list[0]);
					this.controller.queryContentData(res.mkt_list[0], res.ym_list[0]);
				} else {
					this.controller.set('sampleCheckError', true);
					this.controller.set('errorMessage', 'error');
				}
			});
		// 你的逻辑
	},
	actions: {
		// 你的动作
	}
});
