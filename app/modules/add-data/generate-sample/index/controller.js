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
			let checkArray = ymArray.map((item)=>{
				return {
					isChecked: false,
					value: item,
					id: item,
				}
			});
			return checkArray;
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
		startParsingFile() {
			let req = this.store.peekAll('phmaxjob').lastObject;
			console.log("this is ymCalc");
			let result = this.store.object2JsonApi('phmaxjob', req, false);
			console.log(result);
			this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp.not_arrival_hosp_file);

				// SampleObject.set('fileParsingSuccess',true);
            })
            // SampleObject.set('fileParsingSuccess',true);
		},
		startGenerateSample () {
			let ymList = this.get('ymList');
			let message = this.get('message');
			// let years = ymList.filterBy('isChecked',true).join('#');
			let years = ymList.filterBy('isChecked',true);
			let year = [];
			years.forEach((k) => {
				year.push(k.value)
			});
			let yearsString = year.join('#');
			console.log(yearsString);

			this.store.peekAll('phmaxjob').lastObject.set('yms',yearsString);
			this.store.peekAll('phmaxjob').lastObject.set('call','panel');
			let req = this.store.peekAll('phmaxjob').lastObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
			this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp);
                console.log(resp.call);
				if(resp.call === 'panel') {
					SampleObject.set('fileParsingSuccess',false);
				} else {
					console.log('years error');
				}
            })
		},
			// TODO : 未添加异常处理
			// let years = this.get('SampleObject').ymArray.filterBy('isChecked')
			// 	// .map((elt, i, array) => {
			// 	.map((elt) => {
			// 		console.log(elt);
			// 		return elt.year
			// 	});
			// if (years.length === 0) {
			// 	// alert('未选择时间');
			// 	this.set('yearsNullError', true);
			// } else {
			//
			// 	// let condition = {
			// 	// 	"condition": {
			// 	// 		"job_id": this.get('cookies').read('job_id'),
			// 	// 		"args": {
			// 	// 			"cpa": this.get('cookies').read('cpahash'),
			// 	// 			"gycx": this.get('cookies').read('gycxhash') || '',
			// 	// 			"yms": years.join('#')
			// 	// 		}
			// 	// 	}
			// 	// };
			// 	// //
			// 	// new rsvp.Promise((resolve, reject) => {
			// 	// 	return this.get('ajax').request('api/max/panel',
			// 	// 		this.getAjaxOpt(condition)).then((response) => {
			// 	// 			window.console.info(response);
			// 	// 			SampleObject.set('fileParsingSuccess', false);
			// 	// 			SampleObject.set('calcYearsProgress', false);
			// 	// 			SampleObject.set('calcPanelProgress', true);
			// 	// 			return resolve({
			// 	// 				resule: response
			// 	// 			});
			// 	// 		},
			// 	// 		() => {
			// 	// 			return reject("Access Error");
			// 	// 		}
			// 	// 	);
			// 	// });
			// }

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
