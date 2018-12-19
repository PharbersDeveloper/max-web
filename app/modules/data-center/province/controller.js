import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';

export default Controller.extend({
	dataCenterRoute: service('data_center_route'),
	dataCenterController: service('data_center_controller'),
	i18n: service(),
	cookies: service(),
	market: '麻醉市场',
	provRankTag: 'provinceSales',
	prodRankTag: 'sales',
	trendTag: 'sales',
	prodRankMax: 0,
	provRankMax: 0,
	year: '2017',
	month: '01',
	prov: '北京市',
	userId: localStorage.getItem('userid'),
	companyId: localStorage.getItem('company_id'),

	time: computed('year', 'month', function () {
		let year = this.get('year'),
			month = this.get('month');

		return year + '-' + month;
	}),
	computedRankingMax(whichValue, whickMax, whickRank) {
		let ranking = this.get(whichValue),
			range = 0,
			valueArr = [],
			maxValue = 0,
			rankingRangeArr = [];

		ranking.map(function (item) {
			valueArr.push(Math.round(item.value));
		});

		maxValue = Math.max(...valueArr);
		// this.set('rankingMax', maxValue);

		this.set(whickMax, maxValue);

		if (maxValue < 10) {
			range = 2;
		} else {
			let maxAsArr = String(Math.round(maxValue / 5)).split(''),
				firstMax = Number(maxAsArr[0]),
				restMax = maxAsArr.length - 1;

			range = (firstMax + 1) * Math.pow(10, restMax);
		}
		rankingRangeArr = [];

		for (let i = 0; i <= 5; i++) {
			rankingRangeArr.push(i * range);
		}
		// this.set('rankingRange', rankingRangeArr);
		this.set(whickRank, rankingRangeArr);
	},
	/**
     *	查询市场产品卡片
     */
	queryMarketProdCards() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincename01',
				res: 'provincename',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.userId
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/provinceName', 'provincename', result)
			.then((data) => {
				if (data.ProvinceWord.length !== 0) {
					this.set('cards', data.ProvinceWord);
				}
			});
	},
	/**
     * 查询混合图数据
     *
     */
	queryMixedGraph() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincelineoverview01',
				res: 'provincelineoverview',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/lineOverview', 'provincelineoverview', result)
			.then((data) => {
				this.set('mixedGraphTitle', data.ProdSalesOverview);
				if (data.MixedGraphLine.length !== 0) {
					this.set('mixedGraphData', data.MixedGraphLine);
				}
			});
	},
	/**
     *	查询市场各省份销售概况-table
     */
	queryMarketSalesTable() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincetableoverview01',
				res: 'provincetableoverview',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/tableOverview', 'provincetableoverview', result)
			.then((data) => {
				this.set('provSalesTitle', data.ProdSalesOverview);
				if (data.ProdSalesValue.length !== 0) {
					this.set('marketSalesValue', data.ProdSalesValue);
				}
			});
	},

	/**
     *	市场销售组成-pie
     */
	queryPerMarketShare() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincemarketpart01',
				res: 'provincemarketpart',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/marketPart', 'provincemarketpart', result)
			.then((data) => {
				this.set('marketTitle', data.ProdSalesOverview);
				if (data.Pie.length !== 0) {
					this.set('marketSalesPie', data.Pie);
				}
			});
	},

	/**
     *	查询市场层面排行
     */
	queryMarketRank() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincelevelrank01',
				res: 'provincelevelrank',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'tag01',
						key: 'tag',
						val: this.provRankTag
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/provLevelRank', 'provincelevelrank', result)
			.then((data) => {
				this.set('marketRankingUnit', data.unit);
				if (data.Ranking.length !== 0) {
					this.set('provRankValue', data.Ranking);
					this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
				}
			});
	},

	/**
     *	市场销售总额 卡片数据
     */
	queryProdCards() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'provincemarketsale01',
				res: 'provincemarketsale',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/provMarketSale', 'provincemarketsale', result)
			.then((data) => {
				if (data.SaleShareCard.length !== 0) {
					this.set('sales', data.SaleShareCard);
				}
			});
	},
	/**
     * queryTrend
     *
     */
	queryProdTrend() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproducttrend01',
				res: 'provinceproducttrend',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/productTrend', 'provinceproducttrend', result)
			.then((data) => {
				this.set('trendTitle', data.ProdSalesOverview);
				if (data.MultipleLine.length !== 0) {
					this.set('prodTrend', data.MultipleLine);
				}
			});
	},
	/**
     *	竞品数量 卡片数据
     */
	queryProdMostCards() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproductcard01',
				res: 'provinceproductcard',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/productCard', 'provinceproductcard', result)
			.then((data) => {
				if (data.ProProductCard.length !== 0) {
					this.set('words', data.ProProductCard);
				}
			});
	},
	/**
     *	产品份额-pie
     */
	queryPerProductShare() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproductshare01',
				res: 'provinceproductshare',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/productShare', 'provinceproductshare', result)
			.then((data) => {
				this.set('prodMarketTitle', data.ProdSalesOverview);
				if (data.Pie.length !== 0) {
					this.set('marketShare', data.Pie);
				}
			}); //response
	},
	/**
     *	各产品排名变化
     */
	queryProductRank() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproductrankchange01',
				res: 'provinceproductrankchange',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'tag01',
						key: 'tag',
						val: this.prodRankTag
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/prodRankChange', 'provinceproductrankchange', result)
			.then((data) => {
				this.set('prodRankingUnit', data.ProdSalesOverview.unit);
				if (data.Ranking.length !== 0) {
					this.set('prodRankValue', data.Ranking);
					this.computedRankingMax('prodRankValue', 'prodRankMax', 'prodRankRange');
				}
			}); //response
	},


	/**
     *	各竞品销售概况-table
     */
	queryProductSalesTable() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproductsaleoverview01',
				res: 'provinceproductsaleoverview',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/prodSaleOverview', 'provinceproductsaleoverview', result)
			.then((data) => {
				this.set('competingTitle', data.ProdSalesOverview);
				if (data.ProdSalesValue.length !== 0) {
					this.set('competingProdValue', data.ProdSalesValue);
				}
			}); //response
	},
	/**
     *	查询产品销售趋势
     */
	queryAllProdTrend() {

		let req = this.get('dataCenterController').createModel('request', {
				id: 'provinceproducttrendanalysis01',
				res: 'provinceproducttrendanalysis',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'user_id01',
						key: 'user_id',
						val: this.userId
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'province01',
						key: 'province',
						val: this.prov
					}),
					this.get('dataCenterController').createModel('eqcond', {
						id: 'tag01',
						key: 'tag',
						val: this.trendTag
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/dashboard/province/prodTrendAnalysis', 'provinceproducttrendanalysis', result)
			.then((data) => {
				this.set('AllTrendTitle', data.ProdSalesOverview);
				if (data.ProdTrendLine.length !== 0) {
					this.set('AllTrendValue', data.ProdTrendLine);
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
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/search/market/all', 'allmarket', result)
			.then((data) => {
				if (data.status === 'ok') {
					let tempMarkets = [];

					data.Market.forEach(function (d) {
						tempMarkets.push(d.name);
					});
					this.set('markets', tempMarkets);
					this.set('market', tempMarkets[0]);
					this.queryMarketProdCards();
					this.queryMixedGraph();
					this.queryMarketSalesTable();
					this.queryPerMarketShare();
					this.queryMarketRank();
					this.queryMarketProv();
				}
			}); //response

	},
	/**
     *	查询市场下的所有城市
     */
	queryMarketProv() {
		let req = this.get('dataCenterController').createModel('request', {
				id: 'allprovince01',
				res: 'allprovince',
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
						id: 'company_id01',
						key: 'company_id',
						val: this.companyId
					})
				])
			}),
			result = this.get('dataCenterRoute').object2JsonApi(req);

		this.get('dataCenterRoute').queryObject('/api/v1/search/province/all', 'allprovince', result)
			.then((data) => {
				if (data.status === 'ok') {
					let tempProvs = [];

					data.Province.forEach(function (d) {
						tempProvs.push(d.name);
					});
					this.set('provs', tempProvs);
					this.set('prov', tempProvs[0]);
					this.queryProdCards();
					this.queryProdTrend();
					this.queryProdMostCards();
					this.queryPerProductShare();
					this.queryProductRank();
					this.queryProductSalesTable();
					this.queryAllProdTrend();
				}
			}); //response

	},
	init() {
		this._super(...arguments);
		this.markets = [];
		this.years = ['2018', '2017', '2016'];
		this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
		this.provRank = [
			// '市场规模(mil)',
			String(this.i18n.t('biDashboard.common.rankMarketSize')),
			// '市场增长(%)',
			String(this.i18n.t('biDashboard.common.rankMarketGrowth')),
			// '销售额(mil)',
			String(this.i18n.t('biDashboard.common.rankSales')),
			// '销售增长(%)',
			String(this.i18n.t('biDashboard.common.rankSalesGrowth')),
			// '份额(%)',
			String(this.i18n.t('biDashboard.common.rankShare')),
			// '份额增长(%)'
			String(this.i18n.t('biDashboard.common.rankShareGrowth'))
		];
		this.prodRank = [
			// '销售额(mil)',
			String(this.i18n.t('biDashboard.common.rankSales')),
			// '销售增长(%)',
			String(this.i18n.t('biDashboard.common.rankSalesGrowth')),
			// '份额(%)',
			String(this.i18n.t('biDashboard.common.rankShare')),
			// '份额增长(%)'
			String(this.i18n.t('biDashboard.common.rankShareGrowth'))
		];
		this.trendData = [
			// '销售额(mil)',
			String(this.i18n.t('biDashboard.common.rankSales')),
			// '销售增长(%)',
			String(this.i18n.t('biDashboard.common.rankSalesGrowth')),
			// '份额(%)',
			String(this.i18n.t('biDashboard.common.rankShare')),
			// '份额增长(%)'
			String(this.i18n.t('biDashboard.common.rankShareGrowth'))
		];

		//  市场规模卡片数据
		this.cards = [
			//         {
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "mil",
			// 	value: 88.88,
			// 	percent: -8,
			// },{
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "mil",
			// 	value: 88.88,
			// 	percent: 4.3,
			// },{
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "mil",
			// 	value: 88.88,
			// 	percent: 4.3,
			// },{
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "mil",
			// 	value: 88.88,
			// 	percent: 4.3,
			// },{
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "%",
			// 	value: 88.88,
			// 	percent: 4.3,
			// },{
			// 	title: "title",
			// 	subtitle: "time",
			// 	name: "省份名称",
			// 	tag: "%",
			// 	value: 88.88,
			// 	percent: 4.3,
			// }
		];
		// this.queryMarketProdCards();
		//  end 市场规模卡片数据

		//  市场各省份销售概况-混合图
		this.mixedGraphTitle = {
			// title: '市场各省份销售概况',
		};
		this.mixedGraphData = [
			//     {
			//     'province': 'aa',
			//     'scale': 22,
			//     'sales': 20,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.09,

			// }, {
			//     'province': 'bb',
			//     'scale': 55,
			//     'sales': 50,
			//     'market_growth': 0.09,
			//     'prod_growth': -0.04,

			// }, {
			//     'province': 'cc',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },  {
			//     'province': 'dd',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'ee',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'ff',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'gg',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'hh',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },

			// {
			//     'province': 'ii',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'jj',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': 0.09,
			//     'prod_growth': -0.04,

			// },
			// {
			//     'province': 'kk',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'll',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': 0.09,
			//     'prod_growth': -0.04,

			// },        {
			//     'province': 'mm',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'nn',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': 0.09,
			//     'prod_growth': -0.04,

			// },
			// {
			//     'province': 'oo',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': -0.03,
			//     'prod_growth': 0.17,

			// },
			// {
			//     'province': 'pp',
			//     'scale': 66,
			//     'sales': 60,
			//     'market_growth': 0.09,
			//     'prod_growth': -0.04,

			// },
		];
		// this.queryMixedGraph();
		// end市场各省份销售概况-混合图

		//  市场各省份销售概况-table
		this.provSalesTitle = {
			// title:'市场各省销售概况',
		};
		this.MarketSales = [
			{
				// label: '省份名',
				label: String(this.i18n.t('biDashboard.province.provinceName')),
				valuePath: 'province',
				classNames: 'tabl',
				align: 'center',
				sortable: false, //是否可以对列进行排序
				minResizeWidth: '70px' //列可以调整的最小宽度
				// breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列
			}, {
				// label: '市场大小',
				label: String(this.i18n.t('biDashboard.province.marketSize')),
				valuePath: 'market_size',
				classNames: 'tabl',
				align: 'center',
				minResizeWidth: '70px'
			}, {
				// label: '市场增长(%)',
				label: String(this.i18n.t('biDashboard.common.tableMarketGrowth')),
				valuePath: 'market_growth',
				align: 'center',
				classNames: 'tabl',
				minResizeWidth: '70px'
			}, {
				// label: '销售额',
				label: String(this.i18n.t('biDashboard.common.tableSales')),
				valuePath: 'sales_amount',
				align: 'center',
				minResizeWidth: '70px'
			}, {
				// label: '销售增长(%)',
				label: String(this.i18n.t('biDashboard.common.tableSalesGrowth')),
				valuePath: 'sales_growth',
				align: 'center',
				minResizeWidth: '70px'
			}, {
				// label: 'EV值(%)',
				label: String(this.i18n.t('biDashboard.common.tableEvValue')),
				valuePath: 'ev_value',
				align: 'center',
				minResizeWidth: '70px'
			}, {
				// label: '份额(%)',
				label: String(this.i18n.t('biDashboard.common.tableShare')),
				valuePath: 'share',
				align: 'center',
				minResizeWidth: '70px'
			}, {
				// label: '份额增长(%)',
				label: String(this.i18n.t('biDashboard.common.tableShareGrowth')),
				valuePath: 'share_growth',
				align: 'center',
				minResizeWidth: '70px'
			}
		];
		this.marketSalesValue = [
			//     {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }, {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }, {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }, {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }, {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }, {
			//     'province': '省份名',
			//     'market_size':41614,
			//     'market_groth': 123456,
			//     'sales_amount':14614,
			//     'sales_growth': 16,
			//     'ev_value': 100,
			//     'share': 45,
			//     'share_growth': 9,
			// }
		];
		// this.queryMarketSalesTable();
		// end 市场各省份销售概况-table

		//  市场销售组成-pie
		this.marketSalesPie = [
			//     {
			//     show_value: 0.12,
			//     show_unit: '%',
			//     title: '北京',
			//     color: 'red',
			//     tips: [{
			//             key: '省份销售额',
			//             value: 546872,
			//             unit: 'mil'
			//         },
			//         {
			//             key: '产品份额',
			//             value: '26',
			//             unit: '%'
			//         }
			//     ]
			// }, {
			//     show_value: 0.12,
			//     show_unit: '%',
			//     title: '北京',
			//     color: 'red',
			//     tips: [{
			//             key: '省份销售额',
			//             value: 546872,
			//             unit: 'mil'
			//         },
			//         {
			//             key: '产品份额',
			//             value: '26',
			//             unit: '%'
			//         }
			//     ]
			// }, {
			//     show_value: 0.12,
			//     show_unit: '%',
			//     title: '北京',
			//     color: 'red',
			//     tips: [{
			//             key: '省份销售额',
			//             value: 546872,
			//             unit: 'mil'
			//         },
			//         {
			//             key: '产品份额',
			//             value: '26',
			//             unit: '%'
			//         }
			//     ]
			// }
		];
		this.marketTitle = {
			// title: '各产品销售概况',
			// subtitle: '2018-01',
		};
		// this.queryPerMarketShare();
		//  end 市场销售组成

		//  市场省份层面排行
		this.provRankValue = [
			// {
			//     no: 1,
			//     province: "province2",
			//     growth: 4,
			//     value: 38
			// },
			// {
			//     no: 1,
			//     province: "province2",
			//     growth: 4,
			//     value: 30
			// }
		];
		// this.rankingRange = [];
		this.provRankRange = [];
		this.marketRankingUnit = '';
		// this.queryMarketRank();
		// this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
		// this.computedRankingMax();
		//  end 市场省份层面排行

		//市场销售总额-卡片数据
		this.sales = [
			//     {
			//     title: "title",
			//     subtitle: "subtitle",
			//     leaftitle: "北京市",
			//     num: 625.7,
			//     yearOnYear: 4.3,
			//     ringRatio: 4.3,
			// }, {
			//     title: "title",
			//     subtitle: "subtitle",
			//     leaftitle: "北京市",
			//     num: 625.7,
			//     yearOnYear: 4.3,
			//     ringRatio: 4.3,
			// }, {
			//     title: "title",
			//     subtitle: "subtitle",
			//     leaftitle: "北京市",
			//     num: 625.7,
			//     yearOnYear: 4.3,
			//     ringRatio: 4.3,
			// }
		];
		// this.queryProdCards();
		//end 市场销售总额-卡片数据
		// prodTrend
		this.trendTitle = {
			// title: '市场规模 & 辉瑞产品销售趋势',
			// timeStart: '2018-01',
			// timeOver: '2018-08',
			// area: '北京市',
		};
		this.prodTrend = [
			//     {
			//     "ym": "2017-01",
			//     "marketSales": 27,
			//     "prodSales": 15,
			//     "share": 20
			// }, {
			//     "ym": "2017-02",
			//     "marketSales": 26,
			//     "prodSales": 15,
			//     "share": 25
			// }, {
			//     "ym": "2017-03",
			//     "marketSales": 27,
			//     "prodSales": 15,
			//     "share": 20
			// },
		];
		// this.queryProdTrend();
		// end prodTrend
		//竞品数量-卡片数据
		this.words = [
			//     {
			//     title:'竞品数量',
			//     subtitle:'2018-04',
			//     province:'北京市',
			//     name:65
			// },{
			//     title: "title",
			//     subtitle: "subtitle",
			//     leaftitle:'北京市',
			//     name: "市场名称",
			//     subname: 'subname',
			//     value: 94.83,
			//     percent: 5.6
			// }, {
			//     title: "产品下滑",
			//     subtitle: "2018-04",
			//     leaftitle:'北京市',
			//     name: "商品名称",
			//     subname: '市场名',
			//     value: 94.83,
			//     percent: 56.6,
			// }, {
			//     title: "产品下滑",
			//     subtitle: "2018-04",
			//     leaftitle:'北京市',
			//     name: "商品名称",
			//     subname: '市场名',
			//     value: 94.83,
			//     percent: 56.6
			// }
		];
		// this.queryProdMostCards();
		//end 竞品数量-卡片数据

		//产品份额-pie
		this.marketShare = [
			//     {
			// 	'title': '产品一',
			// 	'show_value': 10,
			// 	'share': 848,
			// 	'color': '#3399FF',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'848',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'10',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品二',
			// 	'show_value': 8,
			// 	'share': 845,
			// 	'color': 'orange',
			// 	'tips':  [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'845',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'8',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品三',
			// 	'show_value': 2,
			// 	'share': 256,
			// 	'color': 'lightyellow',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'256',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'2',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品四',
			// 	'show_value': 18,
			// 	'share': 452,
			// 	'color': 'lightgreen',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'452',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'18',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品5',
			// 	'show_value': 2,
			// 	'share': 411,
			// 	'color': 'blue',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'411',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'2',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品6',
			// 	'show_value': 7,
			// 	'share': 421,
			// 	'color': 'lightblue',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'421',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'7',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品7',
			// 	'show_value': 10,
			// 	'share': 444,
			// 	'color': 'pink',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'444',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'10',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '产品8',
			// 	'show_value': 14,
			// 	'share': 422,
			// 	'color': 'lightgray',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'422',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'14',
			//         unit:'',
			//     },],
			// }, {
			// 	'title': '其他',
			// 	'show_value': 30,
			// 	'share': 175,
			// 	'color': 'skyblue',
			// 	'tips': [{
			//         key:'生产商:',
			//         value:'XXX公司',
			//         unit:'',
			//     },
			//     {
			//         key:'销售额:',
			//         value:'175',
			//         unit:'',
			//     },
			//     {
			//         key:'份额:',
			//         value:'30',
			//         unit:'',
			//     },],
			// },
		];
		this.prodMarketTitle = {
			// title: '各产品销售概况',
			// subtitle: '2018-01',
			// province:"北京市"
		};
		// this.queryPerProductShare();
		//end 产品份额-pie

		//各产品排名变化
		this.prodRankValue = [
			// {
			//     no: 1,
			//     prod: "prod2",
			//     manu: "生产商2",
			//     growth: 4,
			//     value: 38
			// },
			// {
			//     no: 1,
			//     prod: "prod2",
			//     manu: "生产商2",
			//     growth: 4,
			//     value: 38
			// }
		];
		this.prodRankRange = [];
		this.prodRankingUnit = '';

		// this.queryProductRank();
		//end 各产品排名变化

		//各竞品销售概况-table
		this.competingProd = [{
			// label: '商品名',
			label: String(this.i18n.t('biDashboard.common.tableName')),
			valuePath: 'prod',
			classNames: 'tabl',
			align: 'center',
			sortable: false, //是否可以对列进行排序
			minResizeWidth: '70px' //列可以调整的最小宽度
		}, {
			// label: '生产商',
			label: String(this.i18n.t('biDashboard.common.tableManufacturer')),
			valuePath: 'manufacturer',
			classNames: 'tabl',
			align: 'center',
			sortable: false,
			minResizeWidth: '70px',
			cellClassNames: 'overf'
			// cellCopmonent: 'table-overflow',
		}, {
			// label: '销售额',
			label: String(this.i18n.t('biDashboard.common.tableSales')),
			valuePath: 'market_sale',
			align: 'center',
			classNames: 'tabl',
			minResizeWidth: '70px'
		}, {
			// label: '销售增长',
			label: String(this.i18n.t('biDashboard.common.tableSalesGrowth')),
			valuePath: 'sales_growth',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			// label: 'EV值(%)',
			label: String(this.i18n.t('biDashboard.common.tableEvValue')),
			valuePath: 'ev_value',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			// label: '份额(%)',
			label: String(this.i18n.t('biDashboard.common.tableShare')),
			valuePath: 'share',
			align: 'center',
			minResizeWidth: '70px'
		}, {
			// label: '份额增长(%)',
			label: String(this.i18n.t('biDashboard.common.tableShareGrowth')),
			valuePath: 'share_growth',
			align: 'center',
			minResizeWidth: '70px'
		}];
		this.competingTitle = {
			// title:'各竞品销售概况',
			// subtitle:'2018-04',
			// city:'北京市'
		};
		this.competingProdValue = [
			// {
			// 'prod': '产品一',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// }, {
			// 'prod': '产品二',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// },{
			// 'prod': '产品三',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// },{
			// 'prod': '产品四',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// },{
			// 'prod': '产品五',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// },{
			// 'prod': '产品六',
			// 'manufacturer':"aaaaa",
			// 'market_sale': 123456,
			// 'sales_growth': 16,
			// 'ev_value': 100,
			// 'share': 45,
			// 'share_growth': 9,
			// }
		];
		// this.queryProductSalesTable();
		//end 各竞品销售概况-table

		this.provinces = [];
		this.prodSalesOverview = {};
		this.prodSalesTable = [];

		this.prodCont = [{
			//     label: '商品名',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'prod',
			//     classNames: 'tabl',
			//     align: 'center',
			//     sorted: false, //是否可以对列进行排序
			//     minResizeWidth: '70px', //列可以调整的最小宽度

			// }, {
			//     label: '市场名',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'market',
			//     classNames: 'tabl',
			//     align: 'center',
			//     minResizeWidth: '70px',
			// }, {
			//     label: '销售额',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'sales',
			//     align: 'center',
			//     classNames: 'tabl',
			//     minResizeWidth: '70px',

			// }, {
			//     label: '贡献度',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'cont',
			//     align: 'center',
			//     minResizeWidth: '70px',
			// }, {
			//     label: '贡献度变化 -  上期(%)',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'cont-month',
			//     align: 'center',
			//     minResizeWidth: '70px',
			// }, {
			//     label: '贡献度变化 - 三个月(%)',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'cont-season',
			//     align: 'center',
			//     minResizeWidth: '70px',
			// }, {
			//     label: '贡献度变化 - 去年同期(%)',
			//     label: this.i18n.t('biDashboard.common.tableName') + "",
			//     valuePath: 'cont-year',
			//     align: 'center',
			//     minResizeWidth: '70px',
		}];
		this.AllTrendTitle = {
			// title: '麻醉市场产品销售趋势分析',
			// timeStart: '2018-01',
			// timeOver: '2018-08',
			// area: '北京市',
		};
		this.AllTrendValue = [
			// {
			//     name: "product1",
			//     values: [{
			//             ym: "2018-01",
			//             value: 100,
			//             unit: ''
			//         },
			//         {
			//             ym: "2018-02",
			//             value: 110,
			//             unit: ''
			//         }
			//     ]
			// }, {
			//     name: "product2",
			//     values: [{
			//             ym: "2018-01",
			//             value: 100,
			//             unit: ''
			//         },
			//         {
			//             ym: "2018-02",
			//             value: 110,
			//             unit: ''
			//         }
			//     ]
			// }, {
			//     name: "product3",
			//     values: [{
			//             ym: "2018-01",
			//             value: 100,
			//             unit: ''
			//         },
			//         {
			//             ym: "2018-02",
			//             value: 110,
			//             unit: ''
			//         }
			//     ]
			// }
		];
		this.queryMarket();
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
		getProv(params) {
			this.set('prov', params);
		},
		queryProvRank(params) {
			if (params === String(this.i18n.t('biDashboard.common.rankMarketSize'))) {
				this.set('provRankTag', 'provinceSales');
			} else if (params === String(this.i18n.t('biDashboard.common.rankMarketGrowth'))) {
				this.set('provRankTag', 'provMomGrowth');
			} else if (params === String(this.i18n.t('biDashboard.common.rankSales'))) {
				this.set('provRankTag', 'companySales');
			} else if (params === String(this.i18n.t('biDashboard.common.rankSalesGrowth'))) {
				this.set('provRankTag', 'companySalesMomGrowth');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShare'))) {
				this.set('provRankTag', 'companyShare');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShareGrowth'))) {
				this.set('provRankTag', 'companyShareMomGrowth');
			}
			this.queryMarketRank();
		},
		queryProdRank(params) {
			if (params === String(this.i18n.t('biDashboard.common.rankSales'))) {
				this.set('prodRankTag', 'sales');
			} else if (params === String(this.i18n.t('biDashboard.common.rankSalesGrowth'))) {
				this.set('prodRankTag', 'salesGrowth');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShare'))) {
				this.set('prodRankTag', 'share');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShareGrowth'))) {
				this.set('prodRankTag', 'shareGrowth');
			}
			this.queryProductRank();

		},
		queryTrend(params) {
			if (params === String(this.i18n.t('biDashboard.common.rankSales'))) {
				this.set('trendTag', 'sales');
			} else if (params === String(this.i18n.t('biDashboard.common.rankSalesGrowth'))) {
				this.set('trendTag', 'salesGrowth');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShare'))) {
				this.set('trendTag', 'share');
			} else if (params === String(this.i18n.t('biDashboard.common.rankShareGrowth'))) {
				this.set('trendTag', 'shareGrowth');
			}
			this.queryAllProdTrend();
		},
		submit() {
			this.set('year', $('#select-year').val());
			this.set('month', $('#select-month').val());
			this.set('market', $('#select-market').val());
			this.set('markTimeProv', false);
			this.queryMarketProdCards();
			this.queryMixedGraph();
			this.queryMarketSalesTable();
			this.queryPerMarketShare();
			this.queryMarketRank();
			// this.queryProdCards();
			// this.queryProdTrend();
			// this.queryProdMostCards();
			// this.queryPerProductShare();
			// this.queryProductRank();
			// this.queryProductSalesTable();
			// this.queryAllProdTrend();
			this.queryMarketProv();
		},
		submitProv() {
			this.set('prov', $('#select-prov').val());
			this.set('modalprov', false);
			this.queryProdCards();
			this.queryProdTrend();
			this.queryProdMostCards();
			this.queryPerProductShare();
			this.queryProductRank();
			this.queryProductSalesTable();
			this.queryAllProdTrend();
		}

	}
});
