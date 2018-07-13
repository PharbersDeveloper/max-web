import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	time: '2017-03',
	actions: {
		submit() {
			Ember.Logger.log(123)
		}
	},
	activeCi: true,
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
					console.log('查询各产品销售贡献度(in country)：')
					console.log(result);
					this.set('pieValue', result.tableSale.pie);
				}
			})
	},
	init() {
		this._super(...arguments);
		this.queryProdCont();
		this.markets = ['first', 'second'];
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
		this.prodSalesTable = [{
			date: new Date('2018-01'),
			sales: 500
		}, {
			date: new Date('2018-02'),
			sales: 600
		}, {
			date: new Date('2018-03'),
			sales: 500
		}, {
			date: new Date('2018-04'),
			sales: 400
		}, {
			date: new Date('2018-05'),
			sales: 500
		}, {
			date: new Date('2018-06'),
			sales: 600
		}, {
			date: new Date('2018-07'),
			sales: 500
		}, {
			date: new Date('2018-08'),
			sales: 0
		}, {
			date: new Date('2018-09'),
			sales: 0
		}, {
			date: new Date('2018-10'),
			sales: 0
		}, {
			date: new Date('2018-11'),
			sales: 0
		}, ];
		this.cards = [{
			title: "市场销售总额",
			subtitle: "2018-02",
			city: "全国",
			num: "625.7",
			yearOnYear: "+4.3%",
			ringRatio: "+4.5%",
		}, {
			title: "市场销售总额",
			subtitle: "2018-02",
			city: "全国",
			num: "625.7",
			yearOnYear: "+4.3%",
			ringRatio: "+4.5%",
		}, {
			title: "市场销售总额",
			subtitle: "2018-02",
			city: "全国",
			num: "625.7",
			yearOnYear: "+4.3%",
			ringRatio: "+4.5%",
		}];
		this.words = [{
			title: "产品数量",
			subtitle: "2018-04",
			city: "全国",
			name: "65",
			subname: '个',
			value: '',
			percent: ''
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "全国",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "全国",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "全国",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}];
		this.titleInfo = {
			title: '各产品销售概况',
			time: '2018-04',
			city: ''
		};
		this.ProdSalesValue = [{
			'prod': '产品一',
			'market_sale': 123456,
			'market_growth': 12,
			'current_sales': 45175,
			'sales_growth': 16,
			'ev_value': 100,
			'share': 45,
			'share_growth': 9,
			'target': 5861,
			'achievement_rate': 47,
			'contribution_rate': 41,
		}, {
			'prod': '产品二',
			'market_sale': 54387,
			'market_growth': 135,
			'current_sales': 87345,
			'sales_growth': 68,
			'ev_value': 468,
			'share': 78,
			'share_growth': 41,
			'target': 579,
			'achievement_rate': 13,
			'contribution_rate': 96,
		}, {
			'prod': '产品三',
			'market_sale': 8321,
			'market_growth': 647,
			'current_sales': 56,
			'sales_growth': 786,
			'ev_value': 563,
			'share': 536,
			'share_growth': 786,
			'target': 53,
			'achievement_rate': 56,
			'contribution_rate': 34,
		}, {
			'prod': '产品四',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		}, {
			'prod': '产品5',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		}, {
			'prod': '产品6',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		}, ];
		this.ProdSales = [{
				label: '产品名称',
				valuePath: 'prod',
				// width: '100px',
				classNames: 'tabl',
				align: 'center',
				sorted: false, //是否可以对列进行排序
				minResizeWidth: '70px', //列可以调整的最小宽度
				// breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列

			}, {
				label: '市场销售额',
				valuePath: 'market_sale',
				// width: '100px',
				classNames: 'tabl',
				align: 'center',
				minResizeWidth: '70px',
				// breakpoints: ['mobile', 'tablet', 'desktop']
			}, {
				label: '市场增长(%)',
				valuePath: 'market_growth',
				// width: '100px',
				align: 'center',
				classNames: 'tabl',
				minResizeWidth: '70px',

			}, {
				label: '当期销售额',
				valuePath: 'current_sales',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: '销售增长(%)',
				valuePath: 'sales_growth',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: 'EV值(%)',
				valuePath: 'ev_value',
				// width: '80px',
				align: 'center',
				minResizeWidth: '70px',
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
			}, {
				label: '指标',
				valuePath: 'target',
				// width: '100px',
				align: 'center',
				minResizeWidth: '50px',
			},
			{
				label: '指标达成率(%)',
				valuePath: 'achievement_rate',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			},
			{
				label: '销售贡献率(%)',
				valuePath: 'contribution_rate',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}
		];
		this.newValue = [2, 2, 2, 2];
		this.pieValue = [9, 8, 7, 6, 5, 4, 3, 2, 1];
		this.pieColor = ['#4169E1', '#6495ED', '#2C82BE', '#53A8E2', '#76DDFB', '#ADD8E6', '#B0E0E6', '#40E0D0', '#FFFFE0']
	},
});