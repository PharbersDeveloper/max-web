import Controller from '@ember/controller';
import { computed } from '@ember/object';
import $ from 'jquery';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

export default Controller.extend({
	viewresultsRoute: service('add_data.viewresults_route'),
	viewresultsController: service('add_data.viewresults_controller'),
	markets: '',
	market: '',
	years: '',
	year: '',
	isSave: false,
	saveState: false,
	allMonths: false,
	chooseTrueNums: 0,
	selectedArea: 0,
	selectedMapArea: 'a',
	marketSumSales: 0,
	marketSumSalesPercentage: 0,
	productSumSales: 0,
	productSumSalesPercentage: 0,
	panelflow: false,
	computeShare: computed('marketSumSales', 'productSumSales', function () {
		let psales = parseFloat(this.get('productSumSales')),
			msales = parseFloat(this.get('marketSumSales'));

		return (psales / msales * 100).toFixed(2);
	}),
	init() {
		this._super(...arguments);
		// this.querySelectArg();
	},

	querySelectArg() {
		let companyId = localStorage.getItem('company_id'),
			jobId = localStorage.getItem('job_id'),
			req = this.get('viewresultsController').createModel('SampleCheckSelecter', {
				id: this.get('hash').uuid(),
				res: 'phselecter',
				'company_id': companyId,
				'job_id': jobId
			});

		this.get('viewresultsRoute').queryObject('api/v1/samplecheckselecter/0', 'SampleCheckSelecter', this.get('viewresultsRoute').object2JsonApi(req))
			.then((res) => {
				if (res !== '') {
					this.set('markets', res.mkt_list);
					this.set('years', res.ym_list); // 下拉窗数据
					this.set('market', res.mkt_list[0]);
					this.set('year', res.ym_list[0]);
					this.queryContentData(res.mkt_list[0], res.ym_list[0]);
				} else {
					this.set('sampleCheckError', true);
					this.set('errorMessage', 'error');
				}
			});
	},

	queryContentData(market, year) {
		this.set('selectedMarket', market);

		let companyId = localStorage.getItem('company_id'),
			jobId = localStorage.getItem('job_id'),
			userId = localStorage.getItem('username'),

			req = this.get('viewresultsController').createModel('ResultCheck', {
				id: this.get('hash').uuid(),
				res: 'resultCheck',
				'user_id': userId,
				'job_id': jobId,
				'company_id': companyId,
				ym: year,
				market: market
			});

		this.get('viewresultsRoute').queryObject('api/v1/resultcheck/0', 'ResultCheck', this.get('viewresultsRoute').object2JsonApi(req))
			.then((res) => {
				if (res !== '') {
					let noValueList = [],
						valueList = [],
						provCurrentData = [],
						provLastData = [],
						cityCurrentData = [],
						cityLastData = [];

					this.set('marketSumSales', typeof res.indicators.marketSumSales === 'undefined' ? 0 : res.indicators.marketSumSales.currentNumber);
					this.set('marketSumSalesPercentage', typeof res.indicators.marketSumSales === 'undefined' ? 0 : res.indicators.marketSumSales.lastYearPercentage.toFixed(2));
					this.set('productSumSales', typeof res.indicators.productSales === 'undefined' ? 0 : res.indicators.productSales.currentNumber);
					this.set('productSumSalesPercentage', typeof res.indicators.productSales === 'undefined' ? 0 : res.indicators.productSales.lastYearPercentage.toFixed(2));

					this.set('trend', res.trend === null ? false : res.trend);
					//折线图数据
					if (!isEmpty(res.region)) {
						res.region.forEach(function (i) {
							if (i.value === 0) {
								noValueList.push(i.name);
							} else {
								valueList.push(EmberObject.create(
									{
										name: i.name,
										marketSales: i.value,
										productSales: i.productSales,
										percentage: i.percentage
									}));
							}
						});
					}


					this.set('noValueList', noValueList);
					this.set('valueList', valueList);
					// 地图数据
					if (typeof res.mirror.provinces !== 'undefined') {
						provCurrentData = typeof res.mirror.provinces === 'undefined' ? 0 : res.mirror.provinces.current;
						provLastData = typeof res.mirror.provinces === 'undefined' ? 0 : res.mirror.provinces.lastyear;
						this.set('provData', { current: provCurrentData, last: provLastData });
						this.set('hasProvData', true);
						cityCurrentData = typeof res.mirror.city === 'undefined' ? 0 : res.mirror.city.current;
						cityLastData = typeof res.mirror.city === 'undefined' ? 0 : res.mirror.city.lastyear;
						this.set('cityData', { current: cityCurrentData, last: cityLastData });
						this.set('hasCityData', true);
					} else {
						this.set('hasProvData', false);
						this.set('hasCityData', false);

					}
					// provCurrentData = typeof res.mirror.provinces === 'undefined' ? 0 : res.mirror.provinces.current;
					// provLastData = typeof res.mirror.provinces === 'undefined' ? 0 : res.mirror.provinces.lastyear;
					// this.set('provData', { current: provCurrentData, last: provLastData });
					// cityCurrentData = typeof res.mirror.city === 'undefined' ? 0 : res.mirror.city.current;
					// cityLastData = typeof res.mirror.city === 'undefined' ? 0 : res.mirror.city.lastyear;
					// this.set('cityData', { current: cityCurrentData, last: cityLastData });

					// lastYear.forEach((a) => {
					// 	lastYear.forEach((b) => {
					// 		if (a.area === b.areaLast) {
					// 			a.keyLast = b.key;
					// 		}
					// 	});
					// });

					// this.set('lastYear', lastYear);

				} else {
					this.set('sampleCheckError', true);
					this.set('errorMessage', 'error');
				}
			});
	},
	actions: {
		changeMarket(value) {
			this.set('market', value);
			let year = this.get('year');

			this.queryContentData(value, year);
		},
		changeMonth(value) {
			this.set('year', value);
			let market = this.get('market');

			this.queryContentData(market, value);
		},
		saveData() {
			this.toggleProperty('isSave');
		},
		queryAll(mAndY) {
			this.queryContentData(mAndY.market, mAndY.year);
		},
		exportFiles() {
			let market = this.get('market') || localStorage.getItem('market'),
				ym = this.get('year') || localStorage.getItem('year'),
				req = this.get('viewresultsController').createModel('ExportMaxResult', {
					id: this.get('hash').uuid(),
					'company_id': localStorage.getItem('company_id'),
					'job_id': localStorage.getItem('job_id'),
					market: market,
					ym: ym
				}),
				result = this.get('viewresultsRoute').object2JsonApi(req);

			this.get('viewresultsRoute').queryObject('api/v1/exportmaxresult/0', 'ExportMaxResult', result)
				.then((res) => {
					if (res.result_path !== '') {
						let resultPath = res.result_path,
							url = '/download/' + resultPath,
							xhr = new XMLHttpRequest();

						xhr.open('GET', url, true); // 也可以使用POST方式，根据接口
						xhr.responseType = 'blob'; // 返回类型blob
						// 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
						xhr.onload = function (response) {
							// 请求完成
							if (this.status === 200) {
								// 返回200
								let a = document.createElement('a');

								a.download = resultPath;
								a.href = response.currentTarget.responseURL;
								$('body').append(a); // 修复firefox中无法触发click
								a.click();
								$(a).remove();
							}
						};
						xhr.send();
					}
				});
		}
	}
});
