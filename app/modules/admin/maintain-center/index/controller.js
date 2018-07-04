import Controller from '@ember/controller';
import {
	later
} from '@ember/runloop';
import {
	inject
} from '@ember/service';
export default Controller.extend({
	isShow: false,
	ajax: inject(),
	cookies: inject(),
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
	querycompanyList() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid')
			},
		}
		this.get('ajax').request('/api/maintenance/companies', this.getAjaxOpt(condition)).
		then(({
			status,
			result,
			error
		}) => {
			if (status === "ok") {
				// console.log(result);
				this.set('isShow', false);
				this.set('model', result.companies);
			} else {
				this.set('errorMessage', error.message);
			}
			// console.log(result);
			// this.set('isShow', false);
			// this.set('model', result.companies);
		}, () => {})
	},
	init() {
		this._super(...arguments);
		this.querycompanyList();
	},
	actions: {
		switch () {
			this.set('isShow', true);
			later(this, () => {
				this.set('isShow', false);
			}, 3000)
		},
	},
	willRender() {
		$getJSON('/drafts').then(data => {
			this.set('drafts', data);
		});
	}
});