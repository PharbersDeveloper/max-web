import $ from 'jquery';
import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import {
	later
} from '@ember/runloop';
const {
	keys
} = Object;
export default Controller.extend({
	cookies: inject(),
	ajax: inject(),
	queryUserInfo() {
		let condition = {
			condition: {
				user_id: this.get('cookies').read('uid')
			}
		}
		this.get('ajax').request('/api/user/detail', this.getAjaxOpt(condition)).
		then(({
			status,
			result
		}) => {
			if (status === 'ok') {
				let {
					user: {
						screen_name,
						email
					}
				} = result
				this.set('fullName', screen_name)
				this.set('account', email)
			}
		}, () => {})
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
	init() {
		this._super(...arguments);
		this.queryUserInfo();
	},
	actions: {
		logut() {
			// let cookies = this.get('cookies');
			keys(this.get('cookies').read()).forEach(item => {
				window.console.info(item);
				this.get('cookies').clear(item, {
					path: '/'
				})
			});
			later(this, () => {
				window.location = "/";
			}, 1000)
		},
		search() {
			let market = $('select[name="markets"] :selected').val() || "All"
			let startTime = this.formatDateyyyymm(this.get('startDate'))
			let endTime = this.formatDateyyyymm(this.get('endDate'))
			this.queryData({
				condition: {
					user_id: this.get('cookies').read('uid'),
					market: market,
					startTime: startTime,
					endTime: endTime,
					currentPage: 1,
					pageSize: 10,
					mode: 'search'
				}
			})
		},
	}
});