import Controller from '@ember/controller';
import styles from './styles';
import {
	inject
} from '@ember/service';
import {
	later
} from '@ember/runloop';
// import rsvp from 'rsvp';
const {
	keys
} = Object;
import $ from 'jquery';

export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	styles,
	title: 'Pharbers 数据平台',
	output: false,
	// startDate: new Date('2018-01'),
	// endDate: new Date(),
	// outputStartData: new Date('2018-01'),
	// outputEndData: new Date(),
	currentPage: 1,
	fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
	account: '',
	// outputType: [],
	outputTypeValue: '',

	formatDateyyyymm(date) {
		return date.getFullYear() + "" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
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

	/**
	 * 查询导出内容格式
	 */
	queryOutputType() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
			}
		}
		this.get('ajax').request('/api/search/getExportType', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error,
			}) => {
				if (status === "ok") {
					this.set('outputType', result.export_data_type);
					this.set('output', true);
				} else {
					this.set('errorMessage', error.message);
				}
				// this.set('outputType', result.export_data_type);
				// this.set('output', true);
			}, () => {})
	},

	/**
	 * save file
	 */
	saveOutputFile(filename) {

		this.get('ajax').request('/api/files/' + filename)
	},

	/**
	 * 导出Max格式
	 */
	exportMax() {
		let market = $('select[name="markets"] :selected').val() || "All"
		let startTime = this.formatDateyyyymm(this.get('startDate'))
		let endTime = this.formatDateyyyymm(this.get('endDate'))
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"market": market,
				"startTime": startTime,
				"endTime": endTime
			}
		}
		this.get('ajax').request('/api/search/exportData', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error,
			}) => {
				if (status === "ok") {
					// console.log(result);
					this.set('loading', false);
					let export_file_name = result.export_file_name;
					if (export_file_name === "") {
						let error = "未找到筛选条件内的数据，请修改“筛选条件” 或点击“添加数据”进行添加。"
						this.set('error', true);
						this.set('errorMessage', error);
					} else {
						window.location =
							// 	'http://192.168.100.174:9000' +
							'/api/files/' +
							export_file_name;
						// this.get('ajax').request('/api/files/' + export_file_name)
						// .then(() => {}, () => {})
					}
				} else {
					// console.log(error);
					this.set('errorMessage', error.message);
				}
			}, () => {})
	},

	/**
	 * 导出公司格式
	 */
	exportOther() {
		let market = $('select[name="markets"] :selected').val() || "All"
		let startTime = this.formatDateyyyymm(this.get('startDate'))
		let endTime = this.formatDateyyyymm(this.get('endDate'))
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"market": market,
				"startTime": startTime,
				"endTime": endTime
			}
		}
		this.get('ajax').request('/api/search/exportDelivery', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error,
			}) => {
				if (status === "ok") {
					// console.log(result);
					this.set('loading', false);
					// this.set('output', false);
					let export_file_name = result.export_file_name;
					if (export_file_name === "") {
						// alert("null");
						let error = "未找到筛选条件内的数据，请修改“筛选条件” 或点击“添加数据”进行添加。"
						this.set('error', true);
						this.set('errorMessage', error);
					} else {
						// this.get('ajax').get('/api/files/' + export_file_name);
						window.location =
							// 	'http://192.168.100.174:9000' +
							'/api/files/' +
							export_file_name;
					}
				} else {
					// console.log(error);
					this.set('errorMessage', error.message);
				}

			}, () => {})
	},

	queryData(parameters) {
		this.set('loading', true);
		this.store.queryMultipleObject('data-center', parameters).
		then((resolve) => {
			this.set('loading', false);
			this.set('model', resolve);
		}, () => {
			this.set('loading', false);
			this.set('model', null);
			this.set('error', true);
			this.set('errorMessage', '查询超时，请重新查询！');
		})
		// this.set('model', this.store.queryMultipleObject('data-center', parameters))
	},

	queryMarkets() {
		let condition = {
			condition: {
				user_id: this.get('cookies').read('uid')
			}
		}

		this.get('ajax').request('/api/search/market/all', this.getAjaxOpt(condition)).then(({
			result,
			error,
			status
		}) => {
			if (status === 'ok') {
				this.set('markets', result.markets)
				this.set('currentPage', 1)
				// let startTime = this.formatDateyyyymm(this.get('startDate'))
				// let endTime = this.formatDateyyyymm(this.get('endDate'))

				// this.queryData({
				//     condition: {
				//         user_id: this.get('cookies').read('uid'),
				//         market: 'All',
				//         startTime: startTime,
				//         endTime: endTime,
				//         currentPage: 1,
				//         pageSize: 10,
				//         mode: 'search'
				//     }
				// })

			} else {
				this.set('error', true);
				this.set('errorMessage', error.message);
			}
		})

	},

	queryUserInfo() {
		let condition = {
			condition: {
				user_id: this.get('cookies').read('uid')
			}
		}
		this.get('ajax').request('/api/user/detail', this.getAjaxOpt(condition)).
		then(({
			status,
			result,
			error
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
			} else {
				this.set('errorMessage', error.message);
			}
		}, () => {})
	},

	init() {
		this._super(...arguments);
		this.set('columns', [{
				propertyName: 'id',
				'className': 'text-center',
				title: '序号',
				useSorting: false
			},
			{
				propertyName: 'date',
				'className': 'text-center',
				title: '日期',
				useSorting: false
			},
			{
				propertyName: 'province',
				'className': 'text-center',
				title: '省份',
				useSorting: false
			},
			{
				propertyName: 'city',
				'className': 'text-center',
				title: '城市',
				useSorting: false
			},
			{
				propertyName: 'market',
				'className': 'text-center',
				title: '市场',
				useSorting: false
			},
			{
				propertyName: 'product',
				'className': 'text-center',
				title: '最小产品单位',
				useSorting: false
			},
			{
				propertyName: 'sales',
				'className': 'text-center',
				title: '销售额',
				useSorting: false
			},
			{
				propertyName: 'units',
				'className': 'text-center',
				title: '销售量',
				useSorting: false
			}
		]);
		this.queryMarkets();
		this.queryUserInfo();
		this.startDate = new Date('2018-01');
		this.endDate = new Date();
		this.outputStartData = new Date('2018-01');
		this.outputEndData = new Date();
		this.outputType = [];
	},

	actions: {
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

		doPageSearch(currentPage, pn) {
			this.set('currentPage', currentPage)
			this.set('modalTablePageObj', pn);
			typeof this.get('modalTablePageObj') === 'undefined' ?
				'' : this.get('modalTablePageObj').gotoCustomPage(currentPage)

			let market = $('select[name="markets"] :selected').val() || "All"
			let startTime = this.formatDateyyyymm(this.get('startDate'))
			let endTime = this.formatDateyyyymm(this.get('endDate'))
			this.queryData({
				condition: {
					user_id: this.get('cookies').read('uid'),
					market: market,
					startTime: startTime,
					endTime: endTime,
					currentPage: currentPage,
					pageSize: 10,
					mode: 'page'
				}
			})
		},

		getType(value) {
			// console.log(`value is ${value}`);
			this.set('outputTypeValue', value);
		},
		outputFile() {
			this.set('output', false);
			// console.log("output file is running");
			// console.log(this.get('outputTypeValue'));
			let type = this.get('outputTypeValue')
			this.set('loading', true);
			if (type === "Max格式" || type === "") {
				// console.log("Max");
				this.exportMax();
			} else {
				// console.log('company formatt');
				this.exportOther();
			}
		},

		outputData() {
			this.queryOutputType();
		},

		changeStartMonth(date) {
			let end_date = this.get('endDate');
			this.set('startDate', date);
			if (date.getFullYear() > end_date.getFullYear()) {
				this.set('endDate', date)
			} else if (date.getFullYear() === end_date.getFullYear()) {
				if (date.getMonth() > end_date.getMonth()) {
					this.set('endDate', date)
				}
			}
			$('input[name="endDate"]').focus(); // 畸形code
		},

		changeEndMonth(date) {
			let start_date = this.get('startDate');
			this.set('endDate', date);
			if (date.getFullYear() === start_date.getFullYear()) {
				if (date.getMonth() < start_date.getMonth()) {
					this.set('startDate', date)
				}
			} else if (date.getFullYear() < start_date.getFullYear()) {
				this.set('startDate', date)
			}
		},

		changeOutputStartMonth(date) {
			let end_date = this.get('outputEndData');
			this.set('outputStartData', date);
			if (date.getFullYear() > end_date.getFullYear()) {
				this.set('outputEndData', date)
			} else if (date.getFullYear() === end_date.getFullYear()) {
				if (date.getMonth() > end_date.getMonth()) {
					this.set('outputEndData', date)
				}
			}
		},

		changeOutputEndMonth(date) {
			let start_date = this.get('outputStartData');
			this.set('outputEndData', date);
			if (date.getFullYear() === start_date.getFullYear()) {
				if (date.getMonth() < start_date.getMonth()) {
					this.set('outputStartData', date)
				}
			} else if (date.getFullYear() < start_date.getFullYear()) {
				this.set('outputStartData', date)
			}
		},

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
		}

	}
});