import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import $ from 'jquery';

import { inject as service } from '@ember/service';

export default Controller.extend({
	viewresultsRoute: service('add_data.viewresults_route'),
	viewresultsController: service('add_data.viewresults_route'),

	ajax: inject(),
	cookies: inject(),
	markets: '',
	market: '',
	years: '',
	year: '',
	isSave: false,
	saveState: false,
	allMonths: false,
	chooseTrueNums: 0,
	selectedArea: 0,
	marketSumSales: 0,
	marketSumSalesPercentage: 0,
	productSumSales: 0,
	productSumSalesPercentage: 0,
	computeShare: computed('marketSumSales', 'productSumSales', function () {
		let psales = parseFloat(this.get('productSumSales')),
			msales = parseFloat(this.get('marketSumSales'));

		return (psales / msales * 100).toFixed(2);
	}),
	init() {
		this._super(...arguments);
		this.querySelectArg();
	},

	querySelectArg() {
		let companyId = localStorage.getItem('company_id'),
			jobId = localStorage.getItem('job_id'),
			req = this.get('viewresults_controller').createModel('SampleCheckSelecter', {
				id: this.get('hash').uuid(),
				res: 'phselecter',
				'company_id': companyId,
				'job_id': jobId
			});

		this.get('viewresultsRoute').queryObject('/api/v1/samplecheckselecter/0', 'SampleCheckSelecter', this.get('viewresultsRoute').object2JsonApi(req))
			.then((res) => {
				if (res !== '') {
					this.set('markets', res.mkt_list);
					this.set('years', res.ym_list); // 下拉窗数据
					this.set('market', res.mkt_list[0]);
					this.set('year', res.ym_list[0]);
					this.get('logger').log(this.get('year'));
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
			userId = localStorage.getItem('user_id'),

			req = this.get('viewresults_controller').createModel('ResultCheck', {
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
					let marketCurrent = res.indicators.marketSumSales.currentNumber,
						marketPercentage = res.indicators.marketSumSales.lastYearPercentage,
						productCurrent = res.indicators.productSales.currentNumber,
						productPercentage = res.indicators.productSales.lastYearPercentage,
						trend = '',
						regionList = '',
						noValueList = [],
						valueList = [],
						current = [],
						lastYear = [],
						mirrorProvincesCurrent = '',
						mirrorProvincesLast = '',
						mirrorProvinces = null;

					this.set('marketSumSales', marketCurrent);
					this.set('marketSumSalesPercentage', marketPercentage.toFixed(2));
					this.set('productSumSales', productCurrent);
					this.set('productSumSalesPercentage', productPercentage.toFixed(2));

					// console.log(res.trend);
					trend = res.trend;
					this.set('trend', trend);
					//折线图数据

					regionList = res.region;

					regionList.forEach(function (i) {
						if (i.value === 0) {
							noValueList.push(i.name);
						} else {
							valueList.push(i.name);
						}
					})
					this.set('noValueList', noValueList);
					this.set('valueList', valueList);
					// 地图数据

					mirrorProvincesCurrent = res.mirror.provinces.current;
					mirrorProvincesLast = res.mirror.provinces.lastyear;
					mirrorProvinces = {
						mirrorProvincesCurrent,
						mirrorProvincesLast
					};

					mirrorProvinces.mirrorProvincesCurrent.forEach((mirrorProvincesCurrentElem, index) => {
						current.push({
							key: index + 1,
							marketSales: mirrorProvincesCurrentElem.marketSales,
							area: ''
						});
					})
					this.set('current', current);
					this.get('logger').log(current);

					mirrorProvinces.mirrorProvincesLast.forEach((mirrorProvincesLastElem, index) => {
						lastYear.push({
							key: index + 1,
							marketSales: -mirrorProvincesLastElem.marketSales,
							areaLast: mirrorProvincesLastElem.area,
							area: mirrorProvinces.mirrorProvincesCurrent[index].area
						});
					});
					// TODO 这他妈是啥
					lastYear.forEach((a) => {
						lastYear.forEach((b) => {
							if (a.area === b.areaLast) {
								a.keyLast = b.key;
							}
						});
					});

					this.set('lastYear', lastYear);
					this.get('logger').log(lastYear);

					let mirrorCityCurrent = res.mirror.city.current;
					let mirrorCityLast = res.mirror.city.lastyear;
					let mirrorCity = {
						mirrorCityCurrent,
						mirrorCityLast
					}

					let currentCity = [];

					mirrorCity.mirrorCityCurrent.forEach((mirrorCityCurrent, index) => {
						let item = {
							key: index + 1,
							marketSales: mirrorCityCurrent.marketSales,
							area: '',
						}
						currentCity.push(item);
					})
					this.set('currentCity', currentCity);
					this.get('logger').log(currentCity)

					let lastYearCity = [];
					mirrorCity.mirrorCityLast.forEach((mirrorCityLast, index) => {
						let item = {
							key: index + 1,
							marketSales: -mirrorCityLast.marketSales,
							areaLast: mirrorCityLast.area,
							area: mirrorCity.mirrorCityCurrent[index].area,
						}
						lastYearCity.push(item);
					})
					lastYearCity.forEach((a) => {
						lastYearCity.forEach((b) => {
							if (a.area === b.areaLast) {
								a.keyLast = b.key;
							}
						})
					})
					this.set('lastYearCity', lastYearCity);
					this.get('logger').log(lastYearCity)
				} else {
					this.set('sampleCheckError', true);
					this.set('errorMessage', 'error');
				}
			});
	},
	actions: {
		queryAll(mAndY) {
			this.queryContentData(mAndY.market, mAndY.year);
		},
		exportFiles() {
			let company_id = localStorage.getItem('company_id');
			let job_id = localStorage.getItem('job_id');
			let market = this.get('market') || localStorage.getItem('market');
			this.get('logger').log('this is export');
			let ym = this.get('year') || localStorage.getItem('year');
			this.get('logger').log(this.get('market'));
			this.get('logger').log(this.get('year'));

			let req = this.get('viewresults_controller').createModel('ExportMaxResult', {
				id: this.get('hash').uuid(),
				company_id: company_id,
				job_id: job_id,
				market: market,
				ym: ym
			})
			let result = this.get('viewresultsRoute').object2JsonApi(req);
			this.get('viewresultsRoute').queryObject('api/v1/exportmaxresult/0', 'ExportMaxResult', result)
				.then((res) => {
					if (res.result_path != '') {
						let resultPath = res.result_path;
						var url = '/download/' + resultPath;
						var xhr = new XMLHttpRequest();
						xhr.open('GET', url, true);        // 也可以使用POST方式，根据接口
						xhr.responseType = 'blob';    // 返回类型blob
						// 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
						xhr.onload = function (res) {
							// 请求完成
							if (this.status === 200) {
								// 返回200
								var a = document.createElement('a');
								a.download = resultPath;
								a.href = res.currentTarget.responseURL;
								$('body').append(a);    // 修复firefox中无法触发click
								a.click();
								$(a).remove();

							}
						};
						xhr.send()
					}
				});
		}
	}
});
