import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

export default Controller.extend({
	uploadfilesPanelRoute: service('add_data.uploadfiles_panel_route'),
	uploadfilesPanelController: service('add_data.uploadfiles_panel_controller'),

	init() {
		this._super(...arguments);
		this.set('marketAndTime', false);
		this.set('years', ['2018', '2017', '2016', '2015', '2014']);
		this.set('months', ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
		this.set('year', '2018');
		this.set('month', '01');
		this.set('showLoading', false);
	},
	yearMonth: computed('year', 'month', function () {
		return this.get('year') + this.get('month');
	}),
	actions: {
		next(panel) {
			this.set('panel', panel);
			let companyId = localStorage.getItem('company_id'),
				jobId = localStorage.getItem('job_id'),
				req = this.get('uploadfilesPanelController').createModel('SampleCheckSelecter', {
					id: this.get('hash').uuid(),
					'company_id': companyId,
					'job_id': jobId
				});

			this.get('uploadfilesPanelRoute').queryObject('api/v1/marketselecter/0', 'SampleCheckSelecter', this.get('uploadfilesPanelRoute').object2JsonApi(req))
				.then((res) => {
					if (res !== '') {

						this.set('markets', res.mkt_list);
						this.set('market', isEmpty(res.mkt_list) ? '' : res.mkt_list[0]);

						this.set('marketAndTime', true);
					} else {
						this.set('sampleCheckError', true);
						this.set('errorMessage', 'error');
					}
				});
		},
		nextStep() {
			this.set('marketAndTime', false);
			this.set('showLoading', true);
			let panel = this.get('panel'),
				market = this.get('market'),
				yearMonth = this.get('yearMonth'),
				req = null,
				result = null;

			/**
			 * 原逻辑 这样写绝逼会出现问题，不过先不改，等第一波通过后重构逻辑
			 */
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('panel', panel);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('panel_mkt', market);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('yms', yearMonth);
			this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject.set('call', 'ymCalc');

			req = this.get('uploadfilesPanelController').queryModelByAll('Phmaxjob').lastObject;
			result = this.get('uploadfilesPanelRoute').object2JsonApi(req, false);

			this.get('uploadfilesPanelRoute').queryObject('api/v1/maxjobpushpanel/0', 'Phmaxjob', result)
				.then((resp) => {
					this.set('panelMarket', '');
					this.set('showLoading', false);

					localStorage.setItem('panel', resp.panel);
					// this.transitionToRoute('add-data.check-sample-panel');
					this.transitionToRoute('add-data.calcmax');

				});

		}
	}
});
