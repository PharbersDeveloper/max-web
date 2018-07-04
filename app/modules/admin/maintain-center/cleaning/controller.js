import Controller from '@ember/controller';
// import { later } from '@ember/runloop';
import {
	inject
} from '@ember/service';
import {
	observer
} from '@ember/object';

export default Controller.extend({
	queryParams: ['coid', 'coname'],
	coid: null,
	isShow: false,
	ajax: inject(),
	cookies: inject(),
	checkCompany: observer('coid', function() {
		// console.log('computed has started');
		let companyid = this.get('coid');

		if (companyid) {
			this.queryCleanFiles(companyid)
		} else {
			// return articles;
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

	queryCleanFiles(id) {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": id,
					"module_tag": "clean"
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
					this.set('match_tabels', result.match_files);
					this.set('clean_method', result.module_title);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// this.set('match_tabels', result.match_files);
				// this.set('clean_method', result.module_title);
			}, () => {})
	},

	replaceCleanFile(origindes, uuid) {
		// console.log('replaceCleanFile');
		// console.log(this.get('coid'))
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"maintenance": {
					"company_id": this.get('coid'),
					"module_tag": "clean",
				},
				"origin_file": {
					"file_des": origindes
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
					// console.log('from cleaning / controller.js/ line 96')
					// console.log(result);
					let coid = this.get('coid');
					this.queryCleanFiles(coid);
				} else {
					this.set('errorMessage', error.message);
				}
				// console.log(result);
				// let coid = this.get('coid');
				// this.queryCleanFiles(coid);
				// result:{"file_key":"","file_name":""}
			}, () => {})
	},
	init() {
		this._super(...arguments);
	},

	actions: {
		replaceFile(originfile, file) {
			this.set('isShow', true);
			// console.log(originfile);
			// console.log('replaceFile');
			let origindes = originfile.file_des;

			return file.upload('/api/file/upload').then(({
				body: {
					status,
					result,
					error,
				}
			}) => {
				if (status === 'ok') {
					this.set('isShow', false);
					let uuid = result;
					// console.log(file);
					// let fname = file.get('name');
					this.replaceCleanFile(origindes, uuid);
					// console.log(result); // file_uuid
					// this.set('filecpa', file.get('name'));
					// this.set('isDisabled', false);
					// let success = {
					// 	cpa: result,
					// 	status
					// }
					// this.get('cookies').write('filecpa', this.get('filecpa'), {path:'/'});
				} else {
					this.set('errorMessage', error.message);
					// this.set('uploadError', true);
					// this.set('errorMessage', error.message);
				}
			}, () => {});
		}
	}

});