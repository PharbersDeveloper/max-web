import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	uploadfilesRoute: service('add_data.uploadfiles_route'),
	uploadfilesController: service('add_data.uploadfiles_controller'),
	showLoading: false,
	actions: {
		next(cpa, gycx) {
			this.set('showLoading', true);
			let req = this.get('uploadfilesController').queryModelByAll('Phmaxjob').lastObject,
				result = null;

			req.set('cpa', cpa);
			req.set('gycx', gycx);
			req.set('call', 'ymCalc');
			result = this.get('uploadfilesRoute').object2JsonApi(req, false);

			this.get('uploadfilesRoute').queryObject('api/v1/maxjobpush/0', 'Phmaxjob', result)
				.then((resp) => {

					if (!isEmpty(resp.not_arrival_hosp_file)) {
						this.set('showLoading', false);

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
