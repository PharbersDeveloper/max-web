import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import {computed} from '@ember/object';
export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	activeCi: true,
	fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
	// time: '2017-03',
	year: '2018',
	month: '01',
	time: computed('year','month', function() {
		// body
		let year = this.get('year');
		let month = this.get('month');
		return year+'-'+month;
	}),
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
	 *	查询产品销售概况
	 *
	 */
	queryProdOV() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"time": this.get('time')
			}
		}
		this.get('ajax').request('/api/dashboard/saleData', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error
			}) => {
				if (status === 'ok') {
					console.log('查询产品销售概况')
					console.log(result.tableSale);
					this.set('prodSalesOverview', result.tableSale.prodSalesOverview);
					this.set('prodSalesLine', result.tableSale.prodSalesTable)
				}
			})
	},
	/**
	 *	查询卡片数据
	 *
	 */
	queryCards() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"time": this.get('time')
			}
		}
		this.get('ajax').request('api/dashboard/keyWord', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error
			}) => {
				if (status === 'ok') {
					// console.log('查询卡片数据')
					// console.log(result)
					this.set('cards', result.cards)
				}
			})
	},
	/**
	 *	查询各产品销售概况
	 *
	 */
	queryProdSales() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"time": this.get('time')
			}
		}
		this.get('ajax').request('api/dashboard/overView', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error
			}) => {
				if (status === 'ok') {
					// console.log('查询各产品销售概况:')
					// console.log(result);
					this.set('titleInfo', result.overView.prodSalesOverview);
					// console.log(this.get('titleInfo'))
					this.set('prodSalesValue', result.overView.prodSalesValue);
				}
			})
	},
	/**
	 *	查询各产品销售贡献度
	 *
	 */
	queryProdCont() {
		let condition = {
			"condition": {
				"user_id": this.get('cookies').read('uid'),
				"time": this.get('time')
			}
		}
		this.get('ajax').request('api/dashboard/contribution', this.getAjaxOpt(condition))
			.then(({
				status,
				result,
				error
			}) => {
				if (status === 'ok') {
					// console.log('查询各产品销售贡献度：')
					// console.log(result);
					this.set('prodContValue', result.tableSale.prodContValue)
					this.set('pieValue', result.tableSale.pie);
					this.set('contTitle', result.tableSale.prodSalesOverview)
				}
			})
	},
	init() {
		this._super(...arguments);
		this.pieValue = [];
		this.queryProdOV();
		this.queryCards();
		this.queryProdSales();
		this.queryProdCont();
		this.markets = ['first', 'second'];
		this.contTitle = {};
		this.prodSalesOverview = {
			title: '辉瑞产品销售额',
			time: '2018.01-2018.08',
			currentMonth: '2018-07',
			curMoSales: 9999.9,
			yearYear: 99.9,
			ring: 499,
			totle: 146534563,
			ave: 34572452,
		};
		this.prodSalesLine = [

		];
		this.cards = [

		];
		this.titleInfo = {
			/*	title: '各产品销售概况',
				subtitle: '2018-04',
				city: ''
			*/
		};
		this.prodSalesValue = [

		];
		this.prodSales = [{
			label: '商品名',
			valuePath: 'prod',
			// width: '100px',
			classNames: 'tabl',
			align: 'center',
			sorted: false, //是否可以对列进行排序
			minResizeWidth: '70px', //列可以调整的最小宽度
			// breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列

		}, {
			label: '市场名',
			valuePath: 'market',
			// width: '100px',
			classNames: 'tabl',
			align: 'center',
			minResizeWidth: '70px',
			// breakpoints: ['mobile', 'tablet', 'desktop']
		}, {
			label: '市场规模',
			valuePath: 'market_scale',
			// width: '100px',
			align: 'center',
			classNames: 'tabl',
			minResizeWidth: '70px',

		}, {
			label: '市场增长',
			valuePath: 'market_growth',
			// width: '100px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '销售额',
			valuePath: 'sales',
			// width: '100px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '销售增长',
			valuePath: 'sales_growth',
			// width: '80px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: 'EV值',
			valuePath: 'ev_value',
			// width: '100px',
			align: 'center',
			minResizeWidth: '50px',
		}, {
			label: '份额(%)',
			valuePath: 'share',
			// width: '80px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '份额增长(%)',
			valuePath: 'share_growth',
			// width: '100px',
			align: 'center',
			minResizeWidth: '70px',
		}];
		this.prodCont = [{
			label: '商品名',
			valuePath: 'prod',
			// width: '100px',
			classNames: 'tabl',
			align: 'center',
			sorted: false, //是否可以对列进行排序
			minResizeWidth: '70px', //列可以调整的最小宽度
			// breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列

		}, {
			label: '市场名',
			valuePath: 'market',
			// width: '100px',
			classNames: 'tabl',
			align: 'center',
			minResizeWidth: '70px',
			// breakpoints: ['mobile', 'tablet', 'desktop']
		}, {
			label: '销售额',
			valuePath: 'sales',
			// width: '100px',
			align: 'center',
			classNames: 'tabl',
			minResizeWidth: '70px',

		}, {
			label: '贡献度',
			valuePath: 'cont',
			// width: '100px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '贡献度变化 -  上期(%)',
			valuePath: 'cont-month',
			// width: '100px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '贡献度变化 - 三个月(%)',
			valuePath: 'cont-season',
			// width: '80px',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			label: '贡献度变化 - 去年同期(%)',
			valuePath: 'cont-year',
			// width: '80px',
			align: 'center',
			minResizeWidth: '70px',
		}];
		this.prodContValue = [

		];
		this.years = ['2018','2017','2016'];
		this.months = ['01','02','03','04','05','06','07','08','09','10','11','12']
	},
	actions: {
		getYear: function(params) {
            console.log(params);
			this.set('year',params)
			// var opt = this.get(params);
        },
		getMonth(params) {
			console.log(params);
			this.set('month',params)
		},
		submit() {
			// console.log('dddd');
			this.set('modal3',false);
			this.queryProdOV();
			this.queryCards();
			this.queryProdSales();
			this.queryProdCont();
		},
	}
});
