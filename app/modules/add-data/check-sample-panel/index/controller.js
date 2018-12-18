import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin';
import styles from '../styles';
export default Controller.extend(XMPPMixin, {
	checkSamplePanelRoute: service('add_data.check_sample_panel_route'),
	checkSamplePanelController: service('add_data.check_sample_panel_controller'),
	styles,
	message: '',
	SampleObject,
	fluResult: observer('message', function () {
		let msg2Json = this.get('message'),
			jobCurrent = localStorage.getItem('job_id'),
			jobXmpp = msg2Json.data.attributes.job_id;

		if (msg2Json.data.attributes.call === 'ymCalc') {
			let ymPercentage = msg2Json.data.attributes.percentage;

			if (ymPercentage > localStorage.getItem('ympercentage')) {
				this.set('ymPercentage', ymPercentage);
				localStorage.setItem('ympercentage', ymPercentage);
				if (jobCurrent === jobXmpp && Number(msg2Json.data.attributes.percentage) === 100) {
					setTimeout(function () {
						SampleObject.set('isShowProgress', false);
					}, 1000);

				}
			}
		} else if (msg2Json.data.attributes.call === 'panel') {
			let panelPercentage = msg2Json.data.attributes.percentage,
				that = this;

			if (panelPercentage > localStorage.getItem('panelpercentage')) {
				this.set('panelPercentage', panelPercentage);
				localStorage.setItem('panelpercentage', panelPercentage);
			}
			// let that = this;

			if (jobCurrent === jobXmpp && Number(msg2Json.data.attributes.percentage) === 100) {
				setTimeout(function () {
					that.transitionToRoute('add-data.generate-sample.sample-finish');
				}, 1000);
			}
		}
	}),
	init() {
		this._super(...arguments);
		this.set('cpafilename', this.get('cookie').read('filecpa'));
		this.xmppCallBack(this);
	},

	actions: {
		startPanel() {
			SampleObject.set('isShowProgress', true);
			SampleObject.set('calcPanelProgress', true);
			localStorage.setItem('panelpercentage', 0);
			let that = this,
				mockPercent = setInterval(() => {
					let panelPercentage = that.get('panelPercentage') || 0;

					if (panelPercentage > localStorage.getItem('panelpercentage')) {
						localStorage.setItem('panelpercentage', panelPercentage);
					}
					if (panelPercentage > 99) {
						clearInterval(mockPercent);
						that.transitionToRoute('add-data.generate-sample.sample-finish');

					} else {
						let newNum = panelPercentage + 10;

						that.set('panelPercentage', newNum);
					}
				}, 600);
		},
		startParsingFile() {
			SampleObject.set('isShowProgress', true);
			localStorage.setItem('ympercentage', 0);
			let cpa = localStorage.getItem('cpa'),
				notArrivalHospFile = localStorage.getItem('not_arrival_hosp_file'),
				jobId = localStorage.getItem('job_id'),
				companyId = localStorage.getItem('company_id'),
				userId = localStorage.getItem('username'),
				req = this.get('checkSamplePanelController').createModel('Phmaxjob', {
					id: this.get('hash').uuid(),
					call: 'ymCalc',
					percentage: 0,
					'job_id': jobId,
					'user_id': userId,
					cpa: cpa,
					'not_arrival_hosp_file': notArrivalHospFile,
					'company_id': companyId
				}),
				result = this.get('checkSamplePanelRoute').object2JsonApi(req, false);

			this.get('checkSamplePanelRoute').queryObject('/api/v1/maxjobsend/0', 'Phmaxjob', result);
		},

		uploadFileAgain(modal) {
			modal.close();
			SampleObject.set('isShowProgress', false);
			SampleObject.set('calcPanelProgress', false);
			this.transitionToRoute('add-data.uploadfiles-panel');
		}
	}
});
