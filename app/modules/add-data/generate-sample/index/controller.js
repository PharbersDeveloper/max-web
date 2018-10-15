import Controller from '@ember/controller';
import { inject } from '@ember/service';
import rsvp from 'rsvp';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';
import MaxCalculateObject from '../../../common/xmpp-message-object/MaxCalculateMessage';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin'
import { isEmpty } from '@ember/utils';
import styles from '../styles';
import conf from '../../../../config/environment';

export default Controller.extend(XMPPMixin,{
	cookies: inject(),
	styles,
	message: '',
	SampleObject,
	fluResult: observer('message', function() {
		let msg2Json = this.get('message');
		console.log("this is in generate controller")
		if (msg2Json.data.attributes.call === 'ymCalc') {
			let job_current = localStorage.getItem('job_id');
			let job_xmpp = msg2Json.data.attributes.job_id;
			let ymPercentage = msg2Json.data.attributes.percentage;
			this.set('ymPercentage',ymPercentage);

			if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
				setTimeout(function(){
					SampleObject.set('fileParsingSuccess',true);
					SampleObject.set('isShowProgress',false);
					SampleObject.set('calcYearsProgress',false);
				},1000)

			}
        } else if (msg2Json.data.attributes.call === 'panel') {
				let job_current = localStorage.getItem('job_id');
				let job_xmpp = msg2Json.data.attributes.job_id;
				let panelPercentage = msg2Json.data.attributes.percentage;
				this.set('panelPercentage',panelPercentage);
				let that = this;
			   if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
				   setTimeout(function(){
					   that.transitionToRoute('add-data.generate-sample.sample-finish');
				   },1000)
			   }
        }
	}),
	ymList: computed('message', function() {
		let message = this.get('message');
		if(!isEmpty(message)) {
			// let ym = JSON.parse(message);
			let ym = message;
			console.log("-----this is message and it is not empty----");
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
			return ['no yms'];
		}

	}),
	init() {
		this._super(...arguments);
		this.set('cpafilename', this.get('cookies').read('filecpa'))
		this.set('gycxfilename', this.get('cookies').read('filegycx'))
		this.xmppCallBack(this);
	},

	actions: {
		startParsingFile() {
			SampleObject.set('isShowProgress',true);
			SampleObject.set('calcYearsProgress',true);
			// let req = this.store.peekAll('phmaxjob').lastObject;
			let cpa = localStorage.getItem('cpa');
			let gycx = localStorage.getItem('gycx');
			let not_arrival_hosp_file = localStorage.getItem('not_arrival_hosp_file');
			console.log("this is in index")
			console.log(not_arrival_hosp_file);
			let job_id = localStorage.getItem('job_id');
			let company_id = localStorage.getItem('company_id');
			let user_id = localStorage.getItem('username');
			let req = this.store.createRecord('phmaxjob',{
				call: "ymCalc",
				percentage: 0,
				job_id: job_id,
				user_id: user_id,
				cpa: cpa,
				gycx: gycx,
				not_arrival_hosp_file: not_arrival_hosp_file,
				company_id: company_id
			})
			console.log("this is ymCalc");
			let result = this.store.object2JsonApi('phmaxjob', req, false);
			console.log(result);
			this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp.not_arrival_hosp_file);
				// SampleObject.set('isShowProgress',true);
				// SampleObject.set('calcYearsProgress',true);
            })
		},
		startGenerateSample () {
			SampleObject.set('calcYearsProgress',false);
			SampleObject.set('isShowProgress',true);
			SampleObject.set('calcPanelProgress',true);
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
					SampleObject.set('calcYearsProgress', false);
					SampleObject.set('calcPanelProgress', true);
				} else {
					console.log("解析文件失败");
					SampleObject.set('fileParsingError',false);
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
