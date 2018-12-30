import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import styles from './styles';
import $ from 'jquery';
import rsvp from 'rsvp';
const { keys } = Object;

export default Controller.extend({
	dataCenterRoute: service('data_center_route'),
	dataCenterController: service('data_center_controller'),
	i18n: service(),
	styles,
	output: false,
	currentPage: 1,
	fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
	account: '',
	outputTypeValue: '',
	market: 'INF',
	markets: A(['麻醉市场', 'INF']),

	init() {
		this._super(...arguments);
		this.startDate = new Date('2018-01');
		this.endDate = new Date();
		this.outputStartData = new Date('2018-01');
		this.outputEndData = new Date();
		this.outputType = [];
	},

	formatDateyyyymm(date) {
		return String(date.getFullYear()) + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
	},

	queryData(parameters) {
		this.set('loading', true);
		this.get('dataCenterRoute').queryMultipleObject('data-center', parameters).
			then((resolve) => {
				this.set('loading', false);
				this.set('model', resolve);
			}, () => {
				this.set('loading', false);
				this.set('model', null);
				this.set('error', true);
				this.set('errorMessage', '查询超时，请重新查询！');
			});
	},

	actions: {
		confirmHint() {
			this.set('hint', {
				hintModal: false,
				hintImg: true,
				title: '',
				content: '',
				showCancel: false,
				hintBtn: true,
				backdropClose: true
			});
		},
		addData() {
			let company = this.get('cookie').read('process') - 0,
				hint = null;

			if (company === 1) {
				this.transitionToRoute('add-data.uploadfiles-panel');
			} else if (company === 0) {
				this.transitionToRoute('add-data.uploadfiles');
			} else {
				hint = {
					hintModal: true,
					hintImg: true,
					title: '发生未知错误',
					content: '请退出重新登录',
					showCancel: false,
					hintBtn: true,
					backdropClose: true
				};
				this.set('hint', hint);
			}
		},
		search() {
			let market = this.get('market'),
				startTime = this.formatDateyyyymm(this.get('startDate')),
				endTime = this.formatDateyyyymm(this.get('endDate'));

			this.queryData({
				condition: {
					'user_id': this.get('cookie').read('uid'),
					market: market,
					startTime: startTime,
					endTime: endTime,
					currentPage: 1,
					pageSize: 10,
					mode: 'search'
				}
			});
		},

		// originalFile() {
		// 	this.toggleProperty('chooseAddData');
		// 	this.transitionToRoute('add-data.uploadfiles');
		// },

		// panelFile() {
		// 	this.toggleProperty('chooseAddData');
		// 	this.transitionToRoute('add-data.uploadfiles-panel');
		// },

		// doPageSearch(currentPage, pn) {
		// 	this.set('currentPage', currentPage);
		// 	this.set('modalTablePageObj', pn);
		// 	if (typeof this.get('modalTablePageObj') !== 'undefined') {
		// 		this.get('modalTablePageObj').gotoCustomPage(currentPage);
		// 	}

		// 	let market = this.get('market'),
		// 		startTime = this.formatDateyyyymm(this.get('startDate')),
		// 		endTime = this.formatDateyyyymm(this.get('endDate'));

		// 	this.queryData({
		// 		condition: {
		// 			'user_id': this.get('cookie').read('uid'),
		// 			market: market,
		// 			startTime: startTime,
		// 			endTime: endTime,
		// 			currentPage: currentPage,
		// 			pageSize: 10,
		// 			mode: 'page'
		// 		}
		// 	});
		// },

		outputFile() {
			this.set('output', false);
			let type = this.get('outputTypeValue');

			this.set('loading', true);
			if (type === 'Max格式' || type === '') {
				this.exportMax();
			} else {
				this.exportOther();
			}
		},

		outputData() {
			// this.queryOutputType();
		},

		changeStartMonth(date) {
			let endDate = this.get('endDate');

			this.set('startDate', date);
			if (date.getFullYear() > endDate.getFullYear()) {
				this.set('endDate', date);
			} else if (date.getFullYear() === endDate.getFullYear()) {
				if (date.getMonth() > endDate.getMonth()) {
					this.set('endDate', date);
				}
			}
			$('input[name="endDate"]').focus(); // 畸形code
		},

		changeEndMonth(date) {
			let startDate = this.get('startDate');

			this.set('endDate', date);
			if (date.getFullYear() === startDate.getFullYear()) {
				if (date.getMonth() < startDate.getMonth()) {
					this.set('startDate', date);
				}
			} else if (date.getFullYear() < startDate.getFullYear()) {
				this.set('startDate', date);
			}
		},

		changeOutputStartMonth(date) {
			let endDate = this.get('outputEndData');

			this.set('outputStartData', date);
			if (date.getFullYear() > endDate.getFullYear()) {
				this.set('outputEndData', date);
			} else if (date.getFullYear() === endDate.getFullYear()) {
				if (date.getMonth() > endDate.getMonth()) {
					this.set('outputEndData', date);
				}
			}
		},

		changeOutputEndMonth(date) {
			let startDate = this.get('outputStartData');

			this.set('outputEndData', date);
			if (date.getFullYear() === startDate.getFullYear()) {
				if (date.getMonth() < startDate.getMonth()) {
					this.set('outputStartData', date);
				}
			} else if (date.getFullYear() < startDate.getFullYear()) {
				this.set('outputStartData', date);
			}
		},
		signOut() {
			let cookie = this.get('cookie');

			new rsvp.Promise((resolve) => {
				keys(cookie.read()).forEach(item => {
					cookie.cleans(item)({ path: '/' });
				});
				localStorage.clear();
				return resolve(true);
			}).then(() => {
				window.location = '/';
			});
		}
	}
});
