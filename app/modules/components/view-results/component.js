import { computed } from '@ember/object';
import Component from '@ember/component';
import { later } from '@ember/runloop';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
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
	computeShare: computed('marketSumSales', 'productSumSales', function () {
		let psales = parseFloat(this.get('productSumSales')),
			msales = parseFloat(this.get('marketSumSales'));

		return (psales / msales * 100).toFixed(2);
	}),
	init() {
		this._super(...arguments);
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
		}
		];
	},
	queryContentData() {
		let market = $('select[name="markets"]').val() || localStorage.getItem('market'),
			year = $('select[name="years"]').val() || localStorage.getItem('year');

		return {
			market: market,
			year: year
		};
	},
	actions: {
		saveData() {
			this.set('isSave', true);
		},
		exportFiles() {
			this.sendAction('exportFiles');
		},
		queryAll() {
			let mAndY = this.queryContentData();

			this.sendAction('queryAll', mAndY);
		},
		chooseAllMonth() {
			let allMOnthsBool = this.get('allMonths');

			if (allMOnthsBool) {
				this.set('chooseTrueNums', this.get('months').length);
				this.get('months').forEach((item) => {
					item.set('isChecked', false);
				});
			} else {
				this.set('chooseTrueNums', 0);
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
				this.set('chooseTrueNums', trueNums);
				if (trueNums === this.get('months').length) {
					this.set('allMonths', true);
				}
			} else {
				item.set('isChecked', false);
				trueNums--;
				this.set('chooseTrueNums', trueNums);
				if (trueNums < this.get('months').length) {
					this.set('allMonths', false);
				}
			}
		},
		confirmSave() {
			this.set('isSave', false);
			this.set('saveState', true);
			later(() => {
				this.set('saveState', false);
			}, 1800);
		}
	}
});
