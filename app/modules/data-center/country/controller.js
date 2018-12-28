import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';

export default Controller.extend({
	dataCenterRoute: service('data_center_route'),
	dataCenterController: service('data_center_controller'),

	i18n: service(),
	market: '麻醉市场',
	ranktag: 'sales',
	trendTag: 'sales',
	rankingMax: 0,
	userId: localStorage.getItem('userid'),
	companyId: localStorage.getItem('company_id'),
	year: '2017',
	month: '01',
	init() {
		this._super(...arguments);
		this.competingColumn = [{
			label: this.i18n.t('biDashboard.common.tableName'),
			valuePath: 'prod',
			classNames: 'tabl',
			align: 'center',
			sortable: false, //是否可以对列进行排序
			minResizeWidth: '70px' //列可以调整的最小宽度
		}, {
			label: this.i18n.t('biDashboard.common.tableManufacturer'),
			valuePath: 'manufacturer',
			sortable: false,
			classNames: 'tabl',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			label: this.i18n.t('biDashboard.common.tableSales'),
			valuePath: 'market_sale',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			label: this.i18n.t('biDashboard.common.tableSalesGrowth'),
			valuePath: 'sales_growth',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			label: this.i18n.t('biDashboard.common.tableEvValue'),
			valuePath: 'ev_value',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			label: this.i18n.t('biDashboard.common.tableShare'),
			valuePath: 'share',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			label: this.i18n.t('biDashboard.common.tableShareGrowth'),
			valuePath: 'share_growth',
			align: 'center',
			minResizeWidth: '70px'
		}];
		this.markets = [];
		this.years = ['2018', '2017', '2016'];
		this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
		this.trendData = [
			// '销售额(mil)',
			this.i18n.t('biDashboard.common.rankSales'),
			// '销售增长(%)',
			this.i18n.t('biDashboard.common.rankSalesGrowth'),
			// '份额(%)',
			this.i18n.t('biDashboard.common.rankShare'),
			// '份额增长(%)'
			this.i18n.t('biDashboard.common.rankShareGrowth')
		];

		// 产品销量卡片
		this.cards = [];
		// end 产品销量卡片

		// 市场&产品趋势
		this.trendTitle = {};
		this.multiData = [];
		// end 市场&产品趋势

		// Most cards
		this.words = [];

		//  end most card

		// 各产品份额
		this.shareTitle = {};
		this.pieValue = [];
		// this.queryPerProdShare();
		//  end 各产品份额

		//  各产品排名变化
		this.RankdataType = [
			// '销售额(mil)',
			this.i18n.t('biDashboard.common.rankSales'),
			// '销售增长(%)',
			this.i18n.t('biDashboard.common.rankSalesGrowth'),
			// '份额(%)',
			this.i18n.t('biDashboard.common.rankShare'),
			// '份额增长(%)'
			this.i18n.t('biDashboard.common.rankShareGrowth')
		];
		this.ranking = [];
		this.rankingRange = [];
		this.unit = '';
		//  end 各产品排名变化

		// 查询查询市场竞品销售情况
		this.competingTitle = {};
		this.competingValue = [];
		// end 查询查询市场竞品销售情况

		// 查询所有产品销售趋势分析
		this.AllTrendTitle = {};
		this.AllTrendValue = [];
		//	end

		// 查询市场
		// this.queryMarket();
	},

	time: computed('year', 'month', function () {
		let year = this.get('year'),
			month = this.get('month');

		return year + '-' + month;
	}),

	computedRankingMax() {
		let ranking = this.get('ranking'),
			range = 0,
			valueArr = [],
			rankingRangeArr = [],
			maxValue = null;

		ranking.map(function (item) {
			valueArr.push(Math.round(item.value));
		});

		maxValue = Math.max(...valueArr);
		this.set('rankingMax', maxValue);
		if (maxValue < 10) {
			range = 2;
		} else {
			let maxAsArr = String(Math.round(maxValue / 5)).split(''),
				firstMax = Number(maxAsArr[0]),
				restMax = maxAsArr.length - 1;

			range = (firstMax + 1) * Math.pow(10, restMax);
		}

		for (let i = 0; i <= 5; i++) {
			rankingRangeArr.push(i * range);
		}
		this.set('rankingRange', rankingRangeArr);
	},

	/**
     *	查询产品卡片
     */
	queryProdCards() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationsaleshare01',
			res: 'nationsaleshare',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				})
			])
		});

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/saleShare', 'nationsaleshare', this.get('dataCenterRoute').object2JsonApi(req))
			.then(data => {
				if (data.SaleShareCard.length !== 0) {
					this.set('cards', data.SaleShareCard);
				}
			});
	},
	/**
     *	查询市场&产品趋势
     */
	queryProdTrend() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationmarkettrend01',
			res: 'nationmarkettrend',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				})
			])
		});

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/marketTrend', 'nationmarkettrend', this.get('dataCenterRoute').object2JsonApi(req))
			.then(data => {
				this.set('trendTitle', data.ProdSalesOverview);
				if (data.MultipleLine.length !== 0) {
					this.set('multiData', data.MultipleLine);
				}
			});
	},
	/**
     *	查询产品most卡片
     */
	queryProdMostCards() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationmostword01',
			res: 'nationmostword',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				})
			])
		});

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/mostWord', 'nationmostword', this.get('dataCenterRoute').object2JsonApi(req))
			.then((data) => {
				if (data.MostCard.length !== 0) {
					this.set('words', data.MostCard);
				}
			});
	},
	/**
     *	查询各产品份额
     */
	queryPerProdShare() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationproductshare01',
			res: 'nationproductshare',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				})
			])
		});


		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/productShare', 'nationproductshare', this.get('dataCenterRoute').object2JsonApi(req))
			.then((result) => {
				this.set('shareTitle', result.ProdSalesOverview);
				if (result.Pie.length !== 0) {
					this.set('pieValue', result.Pie);
				}
			});
	},
	/**
     *	查询各产品排名变化
     */
	queryRanking() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationproductrank01',
			res: 'nationproductrank',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'tag01',
					key: 'tag',
					val: this.ranktag
				})
			])
		});


		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/productRank', 'nationproductrank', this.get('dataCenterRoute').object2JsonApi(req))
			.then((result) => {
				this.set('unit', result.unit);
				if (result.Ranking.length !== 0) {
					this.set('ranking', result.Ranking);
					this.computedRankingMax();
				}
			});
	},
	/**
     *	查询市场竞品销售情况
     */
	queryCompeting() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationproducttable01',
			res: 'nationproducttable',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				})
			])
		});

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/productTable', 'nationproducttable', this.get('dataCenterRoute').object2JsonApi(req))
			.then((result) => {
				this.set('competingTitle', result.ProdSalesOverview);
				if (result.ProdSalesValue.length !== 0) {
					this.set('competingValue', result.ProdSalesValue);
				}
			});
	},
	/**
     *	查询产品销售趋势
     */
	queryAllProdTrend() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'nationprodtrendanalysis01',
			res: 'nationprodtrendanalysis',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'market01',
					key: 'market',
					val: this.market
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'time01',
					key: 'time',
					val: this.time
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'user_id01',
					key: 'user_id',
					val: this.userId
				}),
				this.get('dataCenterController').createModel('eqcond', {
					id: 'tag01',
					key: 'tag',
					val: this.ranktag
				})
			])
		});

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/nation/prodTrendAnalysis', 'nationprodtrendanalysis', this.get('dataCenterRoute').object2JsonApi(req))
			.then((result) => {
				this.set('AllTrendTitle', result.ProdSalesOverview);
				if (result.ProdTrendLine.length !== 0) {
					this.set('AllTrendValue', result.ProdTrendLine);
				}
			});
	},
	/**
		* 查询本公司下的所有市场
		*/
	queryMarket() {
		let req = this.get('dataCenterController').createModel('request', {
			id: 'allmarket01',
			res: 'allmarket',
			eqcond: new A([
				this.get('dataCenterController').createModel('eqcond', {
					id: 'company_id01',
					key: 'company_id',
					val: this.companyId
				})
			])
		});


		this.get('dataCenterRoute').queryObject('/api/v1/search/market/all', 'allmarket', this.get('dataCenterRoute').object2JsonApi(req))
			.then((result) => {
				if (result.status === 'ok') {
					let tempMarkets = [];

					result.Market.forEach(function (d) {
						tempMarkets.push(d.name);
					});
					this.set('markets', tempMarkets);
					this.set('market', tempMarkets[0]);
					this.queryProdCards();
					this.queryProdTrend();
					this.queryProdMostCards();
					this.queryPerProdShare();
					this.queryRanking();
					this.queryCompeting();
					this.queryAllProdTrend();
				}
			});
	},

	actions: {
		getMarket(params) {
			this.set('market', params);
		},
		getYear: function (params) {
			this.set('year', params);
		},
		getMonth(params) {
			this.set('month', params);
		},
		queryRank(params) {
			if (params === this.i18n.t('biDashboard.common.rankSales').toString()) {
				this.set('ranktag', 'sales');
			} else if (params === this.i18n.t('biDashboard.common.rankSalesGrowth').toString()) {
				this.set('ranktag', 'salesGrowth');
			} else if (params === this.i18n.t('biDashboard.common.rankShare').toString()) {
				this.set('ranktag', 'share');
			} else if (params === this.i18n.t('biDashboard.common.rankShareGrowth').toString()) {
				this.set('ranktag', 'shareGrowth');
			}
			this.queryRanking();

		},
		queryTrend(params) {
			if (params === this.i18n.t('biDashboard.common.rankSales').toString()) {
				this.set('trendTag', 'sales');
			} else if (params === this.i18n.t('biDashboard.common.rankSalesGrowth').toString()) {
				this.set('trendTag', 'salesGrowth');
			} else if (params === this.i18n.t('biDashboard.common.rankShare').toString()) {
				this.set('trendTag', 'share');
			} else if (params === this.i18n.t('biDashboard.common.rankShareGrowth').toString()) {
				this.set('trendTag', 'shareGrowth');
			}
			this.queryAllProdTrend();
		},
		submit() {
			this.set('year', $('#select-year').val());
			this.set('month', $('#select-month').val());
			this.set('market', $('#select-market').val());
			this.set('markTime', false);
			this.queryProdCards();
			this.queryProdTrend();
			this.queryProdMostCards();
			this.queryPerProdShare();
			this.queryRanking();
			this.queryCompeting();
			this.queryAllProdTrend();
		}
	}
});
