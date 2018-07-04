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
			this.querySampleFile(companyid)
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

	querySampleFile(id) {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": id,
					"module_tag": "panel"
				}
			}
		};

		this.get('ajax').request('/api/maintenance/module/matchfiles', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error
			}) => {
				if (status === 'ok') {
					// console.log("sample");
					// console.log(result);
					this.set('sample_sheets', result.match_files);
					this.set('gen_model', result.module_title);
					// this.set('sample_universe', result.universe_files);
				} else {
					this.set('errorMessage', error.message);
				}
			}, () => {})
	},

	replaceSampleFile(origindes, uuid) {
		// console.log('replaceSampleFile');
		// console.log(this.get('coid'));
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": this.get('coid'),
					"module_tag": "panel"
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
					let coid = this.get('coid');
					this.querySampleFile(coid);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// let coid = this.get('coid');
				// this.querySampleFile(coid);
			}, () => {})
	},

	init() {
		this._super(...arguments);
		// this.querySampleFile();
	},

	actions: {
		replaceFile(originfile, file) {
			this.set('isShow', true);
			// console.log(originfile);
			// let originname = originfile.file_name;
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
					// console.log(file);
					let uuid = result;
					// let fname = file.get('name');
					this.replaceSampleFile(origindes, uuid);
					// console.log(result); // file_uuid
				} else {
					this.set('errorMessage', error.message);
				}
			}, () => {});
		}
	}

});