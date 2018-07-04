import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import rsvp from 'rsvp';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage'
import styles from '../styles';

export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	progress: inject('circle-progress-serivce'),
	styles,
	SampleObject,
	init() {
		this._super(...arguments);
		this.set('cpafilename', this.get('cookies').read('filecpa'))
		this.set('gycxfilename', this.get('cookies').read('filegycx'))
	},
	getAjaxOpt(data) {
		return {
			method: 'POST',
			dataType: "json",
			cache: false,
			data: JSON.stringify(data),
			contentType: "application/json,charset=utf-8",
			Accpt: "application/json,charset=utf-8",
		}
	},
	actions: {
		startParsingFile: function() {
			let condition = {
				"condition": {
					"job_id": this.get('cookies').read('job_id'),
					"args": {
						"cpa": this.get('cookies').read('cpahash'),
						"gycx": this.get('cookies').read('gycxhash') || ''
					}
				}
			};
			new rsvp.Promise((resolve, reject) => {
				return this.get('ajax').request('api/max/ymCalc',
					this.getAjaxOpt(condition)).then((response) => {
						window.console.info(response);
						SampleObject.set('isShowProgress', true);
						SampleObject.set('calcYearsProgress', true);
						return resolve({
							resule: response
						});
					},
					() => {
						return reject("Access Error");
					}
				);
			});
		},
		startGenerateSample: function() {
			// TODO : 未添加异常处理
			let years = this.get('SampleObject').yearsArrayData.filterBy('isChecked')
				// .map((elt, i, array) => {
				.map((elt) => {
					return elt.year
				});
			if (years.length === 0) {
				// alert('未选择时间');
				this.set('yearsNullError', true);
			} else {
				let condition = {
					"condition": {
						"job_id": this.get('cookies').read('job_id'),
						"args": {
							"cpa": this.get('cookies').read('cpahash'),
							"gycx": this.get('cookies').read('gycxhash') || '',
							"yms": years.join('#')
						}
					}
				};
				//
				new rsvp.Promise((resolve, reject) => {
					return this.get('ajax').request('api/max/panel',
						this.getAjaxOpt(condition)).then((response) => {
							window.console.info(response);
							SampleObject.set('fileParsingSuccess', false);
							SampleObject.set('calcYearsProgress', false);
							SampleObject.set('calcPanelProgress', true);
							return resolve({
								resule: response
							});
						},
						() => {
							return reject("Access Error");
						}
					);
				});
			}
		},
		// 未显示要计算的月份
		cantFindMonth: function() {
			SampleObject.set('cantFindMonth', true);
		},
		uploadFileAgain(modal) {
			modal.close()
			SampleObject.set('isShowProgress', false);
			SampleObject.set('fileParsingSuccess', false);
			SampleObject.set('calcYearsProgress', false);
			SampleObject.set('calcPanelProgress', false);
			this.transitionToRoute('adddata.uploadfiles')
			// window.location = 'uploadfiles'
		}
	}
});