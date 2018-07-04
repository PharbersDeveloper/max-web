import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import {
	observer
} from '@ember/object';
export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	queryParams: ['coid', 'coname'],
	checkCompany: observer('coid', function() {
		// console.log('computed has started');
		let companyid = this.get('coid');

		if (companyid) {
			this.queryDeliveryFile(companyid)
		}
	}),

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

	queryDeliveryFile(id) {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": id,
					"module_tag": "delivery"
				}
			}
		};

		this.get('ajax').request('/api/maintenance/module/matchfiles', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error,
			}) => {
				if (status === "ok") {
					// console.log(result);
					this.set('output_tabels', result.match_files);
					this.set('output_model', result.module_title);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// this.set('output_tabels', result.match_files);
				// this.set('output_model', result.module_title);
			}, () => {})
	},

	replaceDeliveryFile(origindes, uuid) {
		// console.log('replaceMaxFile');
		// console.log(this.get('coid'))
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": this.get('coid'),
					"module_tag": "delivery"
				},
				"origin_file": {
					"file_des": origindes,
				},
				"current_file": {
					"file_uuid": uuid,
				}
			}
		};
		// console.log('condition is');
		// console.log(condition);
		this.get('ajax').request('/api/maintenance/matchfile/replace', this.getAjaxOpt(condition))
			.then(({
				status,
				// result,
				error,
			}) => {
				if (status === "ok") {
					// console.log(result);
					let coid = this.get('coid');
					this.queryDeliveryFile(coid);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// let coid = this.get('coid');
				// this.queryDeliveryFile(coid);
			}, () => {})
	},
	init() {
		this._super(...arguments);
	},
	actions: {

		replaceFile(originfile, file) {
			this.set('isShow', true);
			let origindes = originfile.file_des;

			return file.upload('/api/file/upload').then(({
				body: {
					result,
					error,
					status
				}
			}) => {
				if (status === 'ok') {
					this.set('isShow', false);
					let uuid = result;
					this.replaceDeliveryFile(origindes, uuid);
				} else {
					this.set('errorMessage', error.message);
				}
			}, () => {});
		}
	}
});