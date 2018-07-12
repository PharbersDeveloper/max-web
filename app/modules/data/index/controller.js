import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';

export default Controller.extend({
	ajax: inject(),
	cookies: inject(),
	activeCi: true,
	time: '2018-04',
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
				if (status === ok) {
					console.log('查询产品销售概况')
					console.log(result);
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
					console.log('查询卡片数据')
					console.log(result)
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
					console.log('查询各产品销售概况:')
					console.log(result)
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
					console.log('查询各产品销售贡献度：')
					console.log(result)
				}
			})
	},
	init() {
		this._super(...arguments);
		this.queryProdOV();
		this.queryCards();
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
			date: '2018-01',
			sales: 500
		}, {
			date: '2018-02',
			sales: 600
		}, {
			date: '2018-03',
			sales: 500
		}, {
			date: '2018-04',
			sales: 400
		}, {
			date: '2018-05',
			sales: 500
		}, {
			date: '2018-06',
			sales: 600
		}, {
			date: '2018-07',
			sales: 500
		}, {
			date: '2018-08',
			sales: 0
		}, {
			date: '2018-09',
			sales: 0
		}, {
			date: '2018-10',
			sales: 0
		}, {
			date: '2018-11',
			sales: 0
		}, ];
		this.cards = [{
			title: "title",
			subtitle: "subtitle",
			city: "city",
			name: "市场名称",
			subname: 'subname',
			value: 'value',
			percent: '5.6%'
		}, {
			title: "贡献最高",
			subtitle: "2018-04",
			city: "全国",
			name: "头孢",
			subname: '北京市场',
			value: '88.888Mil',
			percent: '88.6%'
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}, {
			title: "产品增长",
			subtitle: "2018-04",
			city: "",
			name: "青霉素",
			subname: '大中华市场',
			value: '9999.83Mil',
			percent: '999.6%'
		}];
		this.titleInfo = {
			title: '各产品销售概况',
			time: '2018-04',
			city: ''
		};
		this.prodSalesValue = [{
			'prod': '产品一',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 12,
			'sales': 45175,
			'sales_growth': 16,
			'ev_value': 100,
			'share': 45,
			'share_growth': 9,

		}, {
			'prod': '产品二',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 135,
			'sales': 87345,
			'sales_growth': 68,
			'ev_value': 468,
			'share': 78,
			'share_growth': 41,

		}, {
			'prod': '产品三',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 647,
			'sales': 56,
			'sales_growth': 786,
			'ev_value': 563,
			'share': 536,
			'share_growth': 786,
		}, {
			'prod': '产品四',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 13422,
			'sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,

		}, {
			'prod': '产品5',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 13422,
			'sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,

		}, {
			'prod': '产品6',
			'market': 'aaaa',
			'market_scale': 4564,
			'market_growth': 13422,
			'sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
		}, ];
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
		this.prodContValue = [{
			'prod': '产品一',
			'market': 123456,
			'sales': 12,
			'cont': 45175,
			'cont-month': 16,
			'cont-season': 100,
			'cont-year': 45,
		}, {
			'prod': '产品二',
			'market': 54387,
			'sales': 135,
			'cont': 87345,
			'cont-month': 68,
			'cont-season': 468,
			'cont-year': 78,
		}, {
			'prod': '产品三',
			'market': 8321,
			'sales': 647,
			'cont': 56,
			'cont-month': 786,
			'cont-season': 563,
			'cont-year': 536,
		}, {
			'prod': '产品四',
			'market': 67456,
			'sales': 13422,
			'cont': 452,
			'cont-month': 42,
			'cont-season': 45,
			'cont-year': 656,
		}, {
			'prod': '产品5',
			'market': 67456,
			'sales': 13422,
			'cont': 452,
			'cont-month': 42,
			'cont-season': 45,
			'cont-year': 656,
		}, {
			'prod': '产品6',
			'market': 67456,
			'sales': 13422,
			'cont': 452,
			'cont-month': 42,
			'cont-season': 45,
			'cont-year': 656,
		}, {
			'prod': '产品7',
			'market': 67456,
			'sales': 13422,
			'cont': 452,
			'cont-month': 42,
			'cont-season': 45,
			'cont-year': 656,
		}, {
			'prod': '产品8',
			'market': 67456,
			'sales': 13422,
			'cont': 452,
			'cont-month': 42,
			'cont-season': 45,
			'cont-year': 656,
		}, {
			'prod': '产品9',
			'market': 356,
			'sales': 34,
			'cont': 75,
			'cont-month': 12,
			'cont-season': 46,
			'cont-year': 54,
		}, ];
		this.pieValue = [9, 8, 7, 6, 5, 4, 3, 2, 1];
		this.pieColor = ['#4169E1', '#6495ED', '#2C82BE', '#53A8E2', '#76DDFB', '#ADD8E6', '#B0E0E6', '#40E0D0', '#FFFFE0']
	},
});