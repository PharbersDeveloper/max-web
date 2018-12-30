import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin';
import styles from '../styles';

export default Controller.extend(XMPPMixin, {
	generateSampleRoute: service('add_data.generate_sample_route'),
	generateSampleController: service('add_data.generate_sample_controller'),
	styles,
	message: '',
	SampleObject,
	panelPercentage: 0,
	ymPercentage: 0,
	fluResult: observer('message', function () {
		// this.get('logger').log('this is in generate controller');
		let msg2Json = this.get('message'),
			hint = {};

		// this.get('logger').log(msg2Json);
		if (typeof msg2Json.errors !== 'undefined') {
			/**
			 * 出现错误的处理
			 */
			SampleObject.set('isShowProgress', false);
			SampleObject.set('calcYearsProgress', false);
			localStorage.setItem('ympercentage', 0);
			hint = {
				hintModal: true,
				hintImg: true,
				title: '发生未知错误',
				content: '请重新计算',
				showCancel: false,
				hintBtn: true,
				backdropClose: false
			};
			this.set('hint', hint);
		} else if (msg2Json.data.attributes.call === 'ymCalc') {
			let jobCurrent = localStorage.getItem('job_id'),
				jobXmpp = msg2Json.data.attributes.job_id,
				ymPercentage = msg2Json.data.attributes.percentage;

			if (ymPercentage > localStorage.getItem('ympercentage')) {
				this.set('ymPercentage', ymPercentage);

				localStorage.setItem('ympercentage', ymPercentage);

				if (jobCurrent === jobXmpp && Number(msg2Json.data.attributes.percentage) === 100) {
					let ymArray = msg2Json.data.attributes.message.split('#'),
						checkArray = ymArray.map((item) => {
							return {
								isChecked: false,
								value: item,
								id: item
							};
						});

					this.set('ymList', checkArray);

					setTimeout(function () {
						SampleObject.set('fileParsingSuccess', true);
						SampleObject.set('isShowProgress', false);
						SampleObject.set('calcYearsProgress', false);
					}, 1000);

				}
			}
		} else if (msg2Json.data.attributes.call === 'panel') {
			let jobCurrent = localStorage.getItem('job_id'),
				jobXmpp = msg2Json.data.attributes.job_id,
				panelPercentage = msg2Json.data.attributes.percentage,
				that = this;

			if (panelPercentage > localStorage.getItem('panelpercentage')) {
				this.set('panelPercentage', panelPercentage);
				localStorage.setItem('panelpercentage', panelPercentage);
			}

			if (jobCurrent === jobXmpp && Number(msg2Json.data.attributes.percentage) === 100) {
				setTimeout(function () {
					SampleObject.set('isShowProgress', false);
					SampleObject.set('fileParsingSuccess', false);
					SampleObject.set('calcYearsProgress', false);
					SampleObject.set('calcPanelProgress', false);
					localStorage.removeItem('panelpercentage');
					localStorage.removeItem('ympercentage');
					that.set('panelPercentage', 0);

					that.unregisterLast();
					that.transitionToRoute('add-data.generate-sample.sample-finish');
				}, 1000);
			}
		}
	}),

	init() {
		this._super(...arguments);
		// this.set('cpafilename', this.get('cookie').read('filecpa'));
		// this.set('gycxfilename', this.get('cookie').read('filegycx'));
		// this.set('SampleObject.isShowProgress', false);
	},

	actions: {
		startParsingFile() {
			let cpa = localStorage.getItem('cpa'),
				gycx = localStorage.getItem('gycx'),
				notArrivalHospFile = localStorage.getItem('not_arrival_hosp_file'),
				jobId = localStorage.getItem('job_id'),
				companyId = localStorage.getItem('company_id'),
				userId = localStorage.getItem('username'),
				req = this.get('generateSampleController').createModel('Phmaxjob', {
					id: this.get('hash').uuid(),
					call: 'ymCalc',
					percentage: 0,
					'job_id': jobId,
					'user_id': userId,
					cpa: cpa,
					gycx: gycx,
					'not_arrival_hosp_file': notArrivalHospFile,
					'company_id': companyId
				});

			SampleObject.set('isShowProgress', true);
			SampleObject.set('calcYearsProgress', true);
			localStorage.setItem('ympercentage', 0);

			this.get('generateSampleRoute').queryObject('api/v1/maxjobsend/0', 'Phmaxjob', this.get('generateSampleRoute').object2JsonApi(req, false));
		},
		startGenerateSample() {
			this.set('ymPercentage', 0);
			localStorage.setItem('ympercentage', 0);
			SampleObject.set('calcYearsProgress', false);
			SampleObject.set('isShowProgress', true);
			SampleObject.set('calcPanelProgress', true);
			localStorage.setItem('panelpercentage', 0);
			let ymList = this.get('ymList'),
				years = ymList.filterBy('isChecked', true),
				year = [];

			years.forEach((k) => {
				year.push(k.value);
			});
			if (year.length === 0) {
				this.set('yearsNullError', true);
			} else {
				let yearsString = year.join('#'),
					req = this.get('generateSampleController').queryModelByAll('Phmaxjob').lastObject,
					result = null;

				this.get('generateSampleController').queryModelByAll('Phmaxjob').lastObject.set('yms', yearsString);
				this.get('generateSampleController').queryModelByAll('Phmaxjob').lastObject.set('call', 'panel');
				result = this.get('generateSampleRoute').object2JsonApi(req, false);
				this.get('generateSampleRoute').queryObject('api/v1/maxjobsend/0', 'Phmaxjob', result)
					.then((resp) => {
						if (resp.call === 'panel') {
							SampleObject.set('fileParsingSuccess', false);
							SampleObject.set('calcYearsProgress', false);
							SampleObject.set('calcPanelProgress', true);
						} else {
							// this.get('logger').log('解析文件失败');
							SampleObject.set('fileParsingError', false);
						}
					});
			}
		},

		// 未显示要计算的月份
		cantFindMonth: function () {
			SampleObject.set('fileParsingSuccess', false);
			SampleObject.set('cantFindMonth', true);
		},
		backChooseMonth() {
			SampleObject.set('cantFindMonth', false);
			SampleObject.set('fileParsingSuccess', true);

		},
		uploadFileAgain(modal) {
			modal.close();
			SampleObject.set('isShowProgress', false);
			SampleObject.set('fileParsingSuccess', false);
			SampleObject.set('calcYearsProgress', false);
			SampleObject.set('calcPanelProgress', false);
			localStorage.removeItem('panelpercentage');
			localStorage.removeItem('ympercentage');
			this.transitionToRoute('add-data.uploadfiles');
		},
		reStart() {
			SampleObject.set('isShowCalcProgress', false);

			this.set('hint', {
				hintModal: false,
				title: '',
				content: ''
			});
			this.transitionToRoute('data-center');
		}
	}
});
