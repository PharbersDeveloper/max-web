import {
	computed
} from '@ember/object';
import Component from '@ember/component';
import {
	later
} from '@ember/runloop';
import {
	inject
} from '@ember/service';
import ResultTrendEchartsOption from '../result-trend-line-and-bar/getOption';
import ResultMapEchartsOption from '../result-map/getOption';
import ResultMirrorEchartsOption from '../result-mirror-bar/getOption';
import $ from 'jquery';

export default Component.extend({
	ajax: inject(),
	cookies: inject(),
	isSave: false,
	saveState: false,
	allMonths: false,
	chooseTrueNums: 0,
	selectedArea: 0,
	// months: [{
	// 		year: '04/2018',
	// 		isChecked: false
	// 	},
	// 	{
	// 		year: '05/2018',
	// 		isChecked: false
	// 	},
	// 	{
	// 		year: '06/2018',
	// 		isChecked: false
	// 	},
	// 	{
	// 		year: '07/2018',
	// 		isChecked: false
	// 	},
	// 	{
	// 		year: '08/2018',
	// 		isChecked: false
	// 	},
	// ],
	marketSumSales: 0,
	marketSumSalesPercentage: 0,
	productSumSales: 0,
	productSumSalesPercentage: 0,
	computeShare: computed('marketSumSales', 'productSumSales', function() {
		let psales = parseFloat(this.get('productSumSales'))
		let msales = parseFloat(this.get('marketSumSales'))
		return ((psales / msales) * 100).toFixed(2);
	}),
	init() {
		this._super(...arguments);
		this.querySelectArg();
		this.months = [{
				year: '04/2018',
				isChecked: false
			},
			{
				year: '05/2018',
				isChecked: false
			},
			{
				year: '06/2018',
				isChecked: false
			},
			{
				year: '07/2018',
				isChecked: false
			},
			{
				year: '08/2018',
				isChecked: false
			},
		];
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
	querySelectArg() {
		let condition = {
			condition: {
				job_id: this.get('cookies').read('job_id')
			}
		}
		this.get('ajax').request('/api/search/check/result/select',
			this.getAjaxOpt(condition)).then(({
			result,
			error,
			status
		}) => {
			if (status === 'ok') {
				this.set('markets', result.markets);
				this.set('years', result.years);
				later(this, () => {
					this.queryContentData()
				}, 500)
			} else {
				this.set('error', true);
				this.set('errorMessage', error.message);
			}

		})
	},
	queryContentData() {
		let market = $('select[name="markets"] :selected').val() || '';
		this.set('selectedMarket', market)
		let year = $('select[name="years"] :selected').val() || '';
		let condition = {
			condition: {
				job_id: this.get('cookies').read('job_id'),
				market: market,
				years: year
			}
		}
		this.get('ajax').request('/api/search/check/result',
			this.getAjaxOpt(condition)).then(({
			result,
			error,
			status
		}) => {
			if (status !== "ok") {
				this.set('errorMessage', error.message);
			}
			let trend = ResultTrendEchartsOption.create()
			let region = ResultMapEchartsOption.create()
			let mirrorProvinces = ResultMirrorEchartsOption.create()
			let mirrorCity = ResultMirrorEchartsOption.create()

			this.set('marketSumSales', result.indicators.marketSumSales.currentNumber)
			this.set('marketSumSalesPercentage', result.indicators.marketSumSales.lastYearPercentage)
			this.set('productSumSales', result.indicators.productSales.currentNumber)
			this.set('productSumSalesPercentage', result.indicators.productSales.lastYearPercentage)

			this.set('trendOption', trend.getOption(result.trend))
			this.set('regionOption', region.getOption(result.region))
			this.set('mirrorProvinceOption', mirrorProvinces.getOption(result.mirror.provinces))
			this.set('mirrorCityOption', mirrorCity.getOption(result.mirror.city))
		})
	},
	actions: {
		saveData() {
			this.set('isSave', true)
		},
		queryAll() {
			this.queryContentData();
		},
		chooseAllMonth() {
			let allMOnthsBool = this.get('allMonths');
			if (allMOnthsBool) {
				this.set('chooseTrueNums', (this.get('months').length))
				this.get('months').forEach((item) => {
					item.set('isChecked', false);
				});
			} else {
				this.set('chooseTrueNums', 0)
				this.get('months').forEach((item) => {
					item.set('isChecked', true);
				});
			}
			this.toggleProperty('allMonths');
		},
		// 检查选择项与全选项
		checkChoose(item) {
			let trueNums = this.get('chooseTrueNums');
			if (!item.isChecked) {
				item.set('isChecked', true);
				trueNums++;
				this.set('chooseTrueNums', trueNums)
				if (trueNums === (this.get('months').length)) {
					this.set('allMonths', true);
				}
			} else {
				item.set('isChecked', false);
				trueNums--;
				this.set('chooseTrueNums', trueNums);
				if (trueNums < (this.get('months').length)) {
					this.set('allMonths', false);
				}
			}
		},
		confirmSave() {
			// let checkedMonth = [];
			this.set('isSave', false);
			this.set('saveState', true);
			later(() => {
				this.set('saveState', false);
			}, 1800);
			// let checkedMonth = this.get('months').filterBy('isChecked', true).
			// map((ele) => {
			// 	return ele.year
			// })
			// console.log(checkedMonth);
		},
	},
});