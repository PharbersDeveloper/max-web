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
	isShow: false,
	queryParams: ['coid', 'coname'],
	checkCompany: observer('coid', function() {
		let companyid = this.get('coid');
		if (companyid) {
			this.queryMaxFiles(companyid)
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

	queryMaxFiles(id) {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": id,
					"module_tag": "max"
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
					this.set('max_tabels', result.match_files);
					this.set('max_model', result.module_title);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// this.set('max_tabels', result.match_files);
				// this.set('max_model', result.module_title);
			}, () => {})
	},

	replaceMaxFile(origindes, uuid) {
		// console.log('replaceMaxFile');
		// console.log(this.get('coid'))
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": this.get('coid'),
					"module_tag": "max",
				},
				"origin_file": {
					"file_des": origindes,
				},
				"current_file": {
					"file_uuid": uuid,
				}
			}
		}
		// console.log('condition is');
		// console.log(condition);
		this.get('ajax').request('/api/maintenance/matchfile/replace', this.getAjaxOpt(condition))
			.then(({
				status,
				// result,
				error,
			}) => {
				if (status === "ok") {
					// console.log(" from enlarge / controller.js / line 89");
					// console.log(result);
					let coid = this.get('coid');
					this.queryMaxFiles(coid);
				} else {
					this.set('errorMessage', error.message);
				}
				// let coid = this.get('coid');
				// this.queryMaxFiles(coid);
			}, () => {})
	},

	init() {
		this._super(...arguments);
	},

	actions: {

		replaceFile(originfile, file) {
			this.set('isShow', true);
			let origindes = originfile.file_des

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
					this.replaceMaxFile(origindes, uuid);
				} else {
					this.set('errorMessage', error.message);
				}
			}, () => {});
		}
	}
});