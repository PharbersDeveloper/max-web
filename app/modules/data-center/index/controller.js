import Controller from '@ember/controller';
import {
	inject
} from '@ember/service';
import {
	computed
} from '@ember/object';
import $ from 'jquery';
export default Controller.extend({
	i18n: inject(),
	cookies: inject(),
	fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
	year: '2017',
	month: '01',
	time: computed('year', 'month', function () {
		// body
		let year = this.get('year');
		let month = this.get('month');
		return year + '-' + month;
	}),
	// time : this.get('time'),
	userId: localStorage.getItem('userid'),
	companyId: localStorage.getItem('company_id'),


    /**
     *	查询产品销售额
     *
     */
	queryProdOV() {
		let req = this.store.createRecord('request', {
			res: 'tableSale',
		});
		//要发送的数据格式
		let eqValues = [{
			type: 'eqcond',
			key: 'company_id',
			val: this.companyId,
			category: null
		},
		{
			type: 'eqcond',
			key: 'time',
			val: this.time,
			category: null
		},
		{
			type: 'eqcond',
			key: 'user_id',
			val: this.userId,
			category: null
		}
		]
		//组建的一对多的关系
		eqValues.forEach((elem, index) => {
			req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
				key: elem.key,
				val: elem.val,
				category: elem.category || null
			}))
		})
		//遍历数组
		let result = this.store.object2JsonApi('request', req);
		//转成jsonAPI格式
		// console.log(result); 
		//request
		this.store.queryObject('/api/v1/dashboard/saleData', 'tablesale', result).then((result) => {
			// console.log(result); 
			this.set('prodSalesTitle', result.ProdSalesOverview);
			if (result.ProdSalesTable.length !== 0) {
				this.set('prodSalesLine', result.ProdSalesTable);
			}
		}) //response
	},
    /**
     *	查询卡片数据
     *
     */
	queryCards() {
		// 要发送的数据格式
		let req = this.store.createRecord('request', {
			res: 'cards',
		});
		// 组建的一对多的关系
		let eqValues = [{
			type: 'eqcond',
			key: 'company_id',
			val: this.companyId,
			category: null
		},
		{
			type: 'eqcond',
			key: 'time',
			val: this.time,
			category: null
		},
		{
			type: 'eqcond',
			key: 'user_id',
			val: this.userId,
			category: null
		}
		]
		// 遍历数组
		eqValues.forEach((elem, index) => {
			req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
				key: elem.key,
				val: elem.val,
				category: elem.category || null
			}))
		})
		// 转成jsonAPI格式
		let result = this.store.object2JsonApi('request', req);
		this.store.queryObject('/api/v1/dashboard/keyWord', 'cards', result)
			.then((result) => {
				this.set('cards', result.Card)
			})
	},
    /**
     *	查询各产品销售概况
     *
     */
	queryProdSales() {
		// 要发送的数据格式
		let req = this.store.createRecord('request', {
			res: 'overview',
		});
		// 组建的一对多的关系
		let eqValues = [{
			type: 'eqcond',
			key: 'company_id',
			val: this.companyId,
			category: null
		},
		{
			type: 'eqcond',
			key: 'time',
			val: this.time,
			category: null
		},
		{
			type: 'eqcond',
			key: 'user_id',
			val: this.userId,
			category: null
		}
		]
		// 遍历数组
		eqValues.forEach((elem, index) => {
			req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
				key: elem.key,
				val: elem.val,
				category: elem.category || null
			}))
		})
		// 转成jsonAPI格式
		let result = this.store.object2JsonApi('request', req);
		// console.log(result);
		//request
		this.store.queryObject('/api/v1/dashboard/overView', 'overview', result).then((result) => {
			//response
			this.set('titleInfo', result.ProdSalesOverview);
			if (result.ProdSalesValue.length !== 0) {
				this.set('prodSalesValue', result.ProdSalesValue);
			}

		})
	},
    /**
     *	查询各产品销售贡献度
     *
     */
	queryProdCont() {

		// 要发送的数据格式
		let req = this.store.createRecord('request', {
			res: 'contribution',
		});
		// 组建的一对多的关系
		let eqValues = [{
			type: 'eqcond',
			key: 'company_id',
			val: this.companyId,
			category: null
		},
		{
			type: 'eqcond',
			key: 'time',
			val: this.time,
			category: null
		},
		{
			type: 'eqcond',
			key: 'user_id',
			val: this.userId,
			category: null
		}
		]
		// 遍历数组
		eqValues.forEach((elem, index) => {
			req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
				key: elem.key,
				val: elem.val,
				category: elem.category || null
			}))
		})
		// 转成jsonAPI格式
		let result = this.store.object2JsonApi('request', req);
		this.store.queryObject('/api/v1/dashboard/contribution', 'contribution', result).then((result) => {
			this.set('contTitle', result.ProdSalesOverview)
			//response
			if (result.ProdContValue.length !== 0) {
				this.set('pieValue', result.ProdContValue);
				this.set('prodContValue', result.Pie)
			}
		})
	},
	init() {
		this._super(...arguments);
        /**
         * 产品销售额
         */
		this.prodSalesTitle = {};
		this.prodSalesLine = [];
		this.queryProdOV();
        /**
         * card
         */
		this.cards = [];
		this.queryCards();
        /**
         * 产品销售概况table
         */
		this.titleInfo = {};
		this.prodSales = [{
			// label: '商品名',
			label: this.i18n.t('biDashboard.common.tableName') + "",
			valuePath: 'prod',
			classNames: 'tabl',
			align: 'center',
			sortable: false, //是否可以对列进行排序
			minResizeWidth: '70px', //列可以调整的最小宽度
		}, {
			// label: '市场名',
			label: this.i18n.t('biDashboard.common.tableMarketName') + "",
			valuePath: 'market',
			classNames: 'tabl',
			align: 'center',
			sortable: false,
			minResizeWidth: '70px',
		}, {
			// label: '市场规模',
			label: this.i18n.t('biDashboard.common.tableMarketSize') + "",
			valuePath: 'market_scale',
			align: 'center',
			classNames: 'tabl',
			minResizeWidth: '70px',
		}, {
			// label: '市场增长',
			label: this.i18n.t('biDashboard.common.tableMarketGrowth') + "",
			valuePath: 'market_growth',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			// label: '销售额',
			label: this.i18n.t('biDashboard.common.tableSales') + "",
			valuePath: 'sales',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			// label: '销售增长',
			label: this.i18n.t('biDashboard.common.tableSalesGrowth') + "",
			valuePath: 'sales_growth',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			// label: 'EV值',
			label: this.i18n.t('biDashboard.common.tableEvValue') + "",
			valuePath: 'ev_value',
			align: 'center',
			minResizeWidth: '50px',
		}, {
			// label: '份额(%)',
			label: this.i18n.t('biDashboard.common.tableShare') + "",
			valuePath: 'share',
			align: 'center',
			minResizeWidth: '70px',
		}, {
			// label: '份额增长(%)',
			label: this.i18n.t('biDashboard.common.tableShareGrowth') + "",
			valuePath: 'share_growth',
			align: 'center',
			minResizeWidth: '70px',
		}];
		this.prodSalesValue = [];
		this.queryProdSales();

        /**
         * 产品贡献度 pie and table
         */
		this.contTitle = {};
		this.prodContValue = [];
		this.pieValue = [];
		this.prodCont = [
			{
				// label: '商品名',
				label: this.i18n.t('biDashboard.common.tableName') + "",
				valuePath: 'prod',
				classNames: 'tabl',
				align: 'center',
				sortable: false, //是否可以对列进行排序
				minResizeWidth: '70px', //列可以调整的最小宽度
			}, {
				// label: '市场名',
				label: this.i18n.t('biDashboard.common.tableMarketName') + "",
				valuePath: 'market',
				classNames: 'tabl',
				align: 'center',
				sortable: false,
				minResizeWidth: '70px',
			}, {
				// label: '销售额',
				label: this.i18n.t('biDashboard.common.tableSales') + "",
				valuePath: 'sales',
				align: 'center',
				classNames: 'tabl',
				minResizeWidth: '70px',
			}, {
				// label: '贡献度',
				label: this.i18n.t('biDashboard.common.tableContribution') + "",
				valuePath: 'cont',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				// label: '贡献度变化 -  上期(%)',
				label: this.i18n.t('biDashboard.common.tableConChangeLastPeriod') + "",
				valuePath: 'cont_month',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				// label: '贡献度变化 - 三个月(%)',
				label: this.i18n.t('biDashboard.common.tableConChangeThreeMonth') + "",
				valuePath: 'cont_season',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				// label: '贡献度变化 - 去年同期(%)',
				label: this.i18n.t('biDashboard.common.tableConChangeLastYear') + "",
				valuePath: 'cont_year',
				align: 'center',
				minResizeWidth: '70px',
			}
		];
		this.queryProdCont();

		this.years = ['2018', '2017', '2016'];
		this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
	},
	actions: {
		getYear: function (params) {
			this.set('year', params)
		},
		getMonth(params) {
			this.set('month', params)
		},
		submit() {
			this.set('year', $("#select-year").val());
			this.set('month', $("#select-month").val());
			this.set('modal3', false);
			this.queryProdOV();
			this.queryCards();
			this.queryProdSales();
			this.queryProdCont();
		},
	}
});