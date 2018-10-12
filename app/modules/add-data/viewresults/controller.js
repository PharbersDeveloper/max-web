import Controller from '@ember/controller';
import {
	computed
} from '@ember/object';
import {
	later
} from '@ember/runloop';
import {
	inject
} from '@ember/service';
import $ from 'jquery';

export default Controller.extend({
    ajax: inject(),
	cookies: inject(),
	isSave: false,
	saveState: false,
	allMonths: false,
	chooseTrueNums: 0,
	selectedArea: 0,
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
    },

    querySelectArg() {
		let company_id = localStorage.getItem('company_id');
		let job_id = localStorage.getItem('job_id');
		// let company = this.store.peekAll('phmaxjob').firstObject.company_id;
		// let job = this.store.peekAll('phmaxjob').firstObject.job_id;

		let req = this.store.createRecord('samplecheckselecter',{
			res: "phselecter",
			company_id: company_id,
			job_id: job_id
		})
		let result = this.store.object2JsonApi('request', req);
		this.store.queryObject('/api/v1/samplecheckselecter/0','samplecheckselecter', result ).then((res) => {
			if(res !== "") {
				this.set("markets",res.mkt_list);
				this.set("years",res.ym_list); // 下拉窗数据
				this.queryContentData(res.mkt_list[0],res.ym_list[0]);
			} else {
				this.set('sampleCheckError', true);
				this.set('errorMessage', "error");
			}
		});
    },

	queryContentData(market,year) {
		this.set('selectedMarket', market);
		// let company = this.store.peekAll('phmaxjob').lastObject.company_id;
		// let job = this.store.peekAll('phmaxjob').lastObject.job_id;
		// let user = this.store.peekAll('phmaxjob').lastObject.user_id;

		let company_id = localStorage.getItem('company_id');
		let job_id = localStorage.getItem('job_id');
		let user_id = localStorage.getItem('user_id');


		// let market = $('select[name="markets"]').val() || localStorage.getItem('market');
		// console.log(market);
		// let years = $('select[name="years"]').val() || localStorage.getItem('year');
		// console.log(years);

		let req = this.store.createRecord('resultcheck',{
			res: "resultCheck",
			user_id: user_id,
			job_id: job_id,
			company_id: company_id,
			ym: year,
			market: market
		})
		let result = this.store.object2JsonApi('request',req);
		this.store.queryObject('/api/v1/resultcheck/0','resultcheck', result ).then((res) => {
		    if(res !== "") {
				// let selectedMarket = res.market;
				let market_current = res.indicators.marketSumSales.currentNumber;
				let market_percentage = res.indicators.marketSumSales.lastYearPercentage;
				let product_current = res.indicators.productSales.currentNumber;
				let product_percentage = res.indicators.productSales.lastYearPercentage;
				// this.set('selectedMarket',selectedMarket);
				this.set('marketSumSales',market_current);
				this.set('marketSumSalesPercentage',market_percentage.toFixed(2));
				this.set('productSumSales',product_current);
				this.set('productSumSalesPercentage',product_percentage.toFixed(2));

				// console.log(res.trend);
				let trend = res.trend;
				this.set('trend',trend);
				//折线图数据

				let regionList = res.region;
				let noValueList = [];
				let valueList = [];
				let listValue = regionList.map(function(i) {
					if(i.value = 0) {
						let noValue = i.name;
						noValueList.push(noValue);
					}  else {
						let values = i.name;
						valueList.push(values);
					}
				})
				this.set("noValueList",noValueList);
				this.set("valueList",valueList);
				// 地图数据

				let mirrorProvincesCurrent = res.mirror.provinces.current;
				let mirrorProvincesLast = res.mirror.provinces.lastyear;
				let mirrorProvinces = {
					mirrorProvincesCurrent,
					mirrorProvincesLast
				}
				console.log(mirrorProvinces)
				let current = [];
				mirrorProvinces.mirrorProvincesCurrent.forEach((mirrorProvincesCurrent,index)=>{
					let item = {
						key: index+1,
						marketSales: mirrorProvincesCurrent.marketSales,
						area: "",
					}
					current.push(item);
				})
				this.set('current',current);
				console.log("this is current")
				console.log(current)

				let lastYear = [];
				mirrorProvinces.mirrorProvincesLast.forEach((mirrorProvincesLast,index)=>{
					let item = {
						key: index+1,
						marketSales: -mirrorProvincesLast.marketSales,
						areaLast: mirrorProvincesLast.area,
						area: mirrorProvinces.mirrorProvincesCurrent[index].area,
					}
					lastYear.push(item);
				})
				lastYear.forEach((a)=>{
					lastYear.forEach((b)=>{
						if(a.area === b.areaLast) {
							a.keyLast = b.key;
						}
					})
				})
				this.set('lastYear',lastYear);
				console.log("this is last")
				console.log(lastYear)
			} else {
				this.set('sampleCheckError', true);
				this.set('errorMessage', "error");
			}
		});
	},
	actions: {
		queryAll(mAndY) {
			this.queryContentData(mAndY.market,mAndY.year);
			// console.log(mAndY);
		}
	}
});
