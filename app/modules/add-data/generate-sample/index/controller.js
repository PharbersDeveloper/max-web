import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import rsvp from 'rsvp';
import { computed } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage'
import styles from '../styles';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin'
import { isEmpty } from '@ember/utils';
export default Controller.extend(XMPPMixin,{
	ajax: inject(),
	cookies: inject(),
	xmpp: inject(),
	// progress: inject('circle-proTgress-serivce'),
	styles,
	SampleObject,
	ymList: computed('message', function() {
		console.log(this.get('message'));
		let message = this.get('message');
		if(!isEmpty(message)) {
			let ym = JSON.parse(message);
			console.log(ym);
			let ymArray = ym.data.attributes.message.split('#');
			console.log(ymArray);
			return ymArray;
		} else {
			return ['none'];
		}

	}),
	init() {
		this._super(...arguments);
		this.set('cpafilename', this.get('cookies').read('filecpa'))
		this.set('gycxfilename', this.get('cookies').read('filegycx'))
		this.xmppCallBack(this);
	},

	message: "",
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
			// let condition = {
			// 	"condition": {
			// 		"job_id": this.get('cookies').read('job_id'),
			// 		"args": {
			// 			"cpa": this.get('cookies').read('cpahash'),
			// 			"gycx": this.get('cookies').read('gycxhash') || ''
			// 		}
			// 	}
			// };
			// let req = this.store.createRecord('request', {
			// 	res: 'phmaxjobresult',
			// });
			// let eqValues = [
			// 	// {type: 'eqcond', key: 'username', val: username, category: 'home'},
			// 	// {type: 'eqcond', key: 'password', val: pwd}
			// 	{type:'eqcode',key:'message', val: message},
			// ]
			//
			// eqValues.forEach((elem, index) => {
			// 	req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
			// 		key: elem.key,
			// 		val: elem.val,
			// 		category: elem.category || null
			// 	}))
			// })
			//
			// let result = this.store.object2JsonApi('request', req);
			// this.store.queryObject('/api/v1/maxlogin/0','phauth', result ).then((result) => {
			// 	if(result.token !== '') {
			// 		this.get('cookies').write('token', result.token, {path: '/'});
			// 		this.transitionTo('data-center')
			// 	}
			// })
			new rsvp.Promise((resolve, reject) => {
				// window.console.info(response);
				SampleObject.set('isShowProgress', true);
				SampleObject.set('fileParsingSuccess',true);
				window.console.info(SampleObject.isShowProgress);
				window.console.info(SampleObject.fileParsingSuccess);

				// SampleObject.set('calcYearsProgress', true);

				// return this.get('ajax').request('api/max/ymCalc',
				// 	this.getAjaxOpt(condition)).then((response) => {
				// 		window.console.info(response);
				// 		SampleObject.set('isShowProgress', true);
				// 		SampleObject.set('calcYearsProgress', true);
				// 		return resolve({
				// 			resule: response
				// 		});
				// 	},
				// 	() => {
				// 		return reject("Access Error");
				// 	}
				// );
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
			this.transitionToRoute('add-data.uploadfiles')
			// window.location = 'uploadfiles'
		}
	}
});
