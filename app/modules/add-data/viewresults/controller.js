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
		let company_id = localStorage.getItem('company_id');
		let job_id = localStorage.getItem('job_id');
		//
		// let company = this.store.peekAll('phmaxjob').firstObject.company_id;
		// let job = this.store.peekAll('phmaxjob').firstObject.job_id;

		// let job = "30bbdb4b-477d-92cf-f0d3-bdf6c952979e"
		// let company = "5afa53bded925c05c6f69c54";

		let req = this.store.createRecord('samplecheckselecter',{
			res: "phselecter",
			company_id: company_id,
			job_id: job_id
		})

		let result = this.store.object2JsonApi('request', req);
		this.store.queryObject('/api/v1/samplecheckselecter/0','samplecheckselecter', result ).then((res) => {
			if(res !== "") {
				this.set("market",res.mkt_list);
				this.set("year",res.ym_list);
				this.queryContentData();
			} else {
				this.set('sampleCheckError', true);
				this.set('errorMessage', "error");
			}
		});
    },
	queryContentData() {
		// let company = this.store.peekAll('phmaxjob').lastObject.company_id;
		// let job = this.store.peekAll('phmaxjob').lastObject.job_id;
		// let user = this.store.peekAll('phmaxjob').lastObject.user_id;

		let company_id = localStorage.getItem('company_id');
		let job_id = localStorage.getItem('job_id');
		let user_id = localStorage.getItem('user_id');
		// let company = "5afa53bded925c05c6f69c54";
		// let job = "d1af7bd5-c164-0c15-6510-0121d66d0c9f";
		// let user = "jeorch";

		let market = $('select[name="markets"]').val() || "麻醉市场";
		console.log(market);
		let ym = $('select[name="years"]').val() || "201801";
		console.log(ym);
		// let ym = "201801";
		// let market = "麻醉市场";
		let req = this.store.createRecord('resultcheck',{
			res: "result chech",
			user_id: user_id,
			job_id: job_id,
			company_id: company_id,
			ym: ym,
			market: market
		})
		let result = this.store.object2JsonApi('request',req);
		this.store.queryObject('/api/v1/resultcheck/0','resultcheck', result ).then((res) => {
		    if(res !== "") {
				let selectedMarket = res.market;
				let market_current = res.indicators.marketSumSales.currentNumber;
				let market_percentage = res.indicators.marketSumSales.lastYearPercentage;
				let product_current = res.indicators.productSales.currentNumber;
				let product_percentage = res.indicators.productSales.lastYearPercentage;
				this.set('selectedMarket',selectedMarket);
				this.set('marketSumSales',market_current);
				this.set('marketSumSalesPercentage',market_percentage.toFixed(2));
				this.set('productSumSales',product_current);
				this.set('productSumSalesPercentage',product_percentage.toFixed(2));

				console.log(res.trend);
				let trend = res.trend;
				this.set('trend',trend);

			} else {
				this.set('sampleCheckError', true);
				this.set('errorMessage', "error");
			}
		});
	}
});
