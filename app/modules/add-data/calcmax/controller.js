import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';
import XMPPMixin from '../../common/xmpp-message-object/XMPPMixin';

export default Controller.extend(XMPPMixin, {
	calcmaxRoute: service('add_data.calcmax_route'),
	calcmaxController: service('add_data.calcmax_controller'),
	message: '',

	init() {
		this._super(...arguments);
		this.set('cpafilename', this.get('cookie').read('filecpa'));
		this.set('gycxfilename', this.get('cookie').read('filegycx'));
		this.xmppCallBack(this);
	},
	'fluResult': observer('message', function () {
		let msg2Json = this.get('message');

		if (msg2Json.data.attributes.call === 'calc') {

			let jobCurrent = localStorage.getItem('job_id'),
				jobXmpp = msg2Json.data.attributes.job_id,
				maxPercentage = msg2Json.data.attributes.percentage;

			if (maxPercentage > localStorage.getItem('maxpercentage')) {
				this.set('maxPercentage', maxPercentage);
				localStorage.setItem('maxpercentage', maxPercentage);
			}
			this.get('logger').log('this is in max controller');
			this.get('logger').log(maxPercentage);

			// TODO: msg2Json.data.attributes.percentage 读取出来的是Number吗？如果不是请变成

			if (jobCurrent === jobXmpp && msg2Json.data.attributes.percentage === 100) {
				setTimeout(function () {
					MaxCalculateObject.set('calcHasDone', true);
				}, 1000);
			}
		}

	}),
	actions: {
		startCalcMAX() {
			this.get('logger').log('this is calcmax');

			MaxCalculateObject.set('isShowCalcProgress', true);
			localStorage.setItem('maxpercentage', 0);

			this.get('calcmaxController').queryModelByAll('Phmaxjob').lastObject.set('call', 'max');

			let req = this.get('calcmaxController').queryModelByAll('Phmaxjob').lastObject,
				result = this.get('calcmaxRoute').object2JsonApi(req, false);

			this.get('calcmaxRoute').queryObject('api/v1/maxjobsend/0', 'Phmaxjob', result);
		},
		viewresults() {
			this.transitionToRoute('add-data.viewresults');
		}
	}
});
