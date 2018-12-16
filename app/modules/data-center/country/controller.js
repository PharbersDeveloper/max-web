import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';

export default Controller.extend({
    data_center_route: service(),
    data_center_controller: service(),
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
            // label: '商品名',
            label: this.i18n.t('biDashboard.common.tableName') + "",
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            // label: '生产商',
            label: this.i18n.t('biDashboard.common.tableManufacturer') + "",
            valuePath: 'manufacturer',
            sortable: false,
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            // label: '销售额',
            label: this.i18n.t('biDashboard.common.tableSales') + "",
            valuePath: 'market_sale',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            // label: '销售增长(%)',
            label: this.i18n.t('biDashboard.common.tableSalesGrowth') + "",
            valuePath: 'sales_growth',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            // label: 'EV值(%)',
            label: this.i18n.t('biDashboard.common.tableEvValue') + "",
            valuePath: 'ev_value',
            align: 'center',
            minResizeWidth: '70px',
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
        this.markets = [];
        this.years = ['2018', '2017', '2016'];
        this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.trendData = [
            // '销售额(mil)',
            this.i18n.t('biDashboard.common.rankSales') + "",
            // '销售增长(%)',
            this.i18n.t('biDashboard.common.rankSalesGrowth') + "",
            // '份额(%)',
            this.i18n.t('biDashboard.common.rankShare') + "",
            // '份额增长(%)'
            this.i18n.t('biDashboard.common.rankShareGrowth') + "",
        ];

        // 产品销量卡片
        this.cards = [];
        // this.queryProdCards();
        // end 产品销量卡片

        // 市场&产品趋势
        this.trendTitle = {
            // title: '市场规模 & 辉瑞产品销售趋势',
            // timeStart: '2018-01',
            // timeOver: '2018-08',
            // area: '全国',
        };
        this.multiData = [
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
        // end 市场&产品趋势

        // Most cards
        this.words = [
            //     {
            //     title:'竟品数量',
            //     subtitle:'2018-04',
            //     leaftitle:'全国',
            //     name:65
            // },{
            //     title: "title",
            //     subtitle: "subtitle",
            //     leaftitle: "全国",
            //     name: "市场名称",
            //     subname: 'subname',
            //     value: 94.83,
            //     percent: 5.6
            // }, {
            //     title: "产品下滑",
            //     subtitle: "2018-04",
            //     leaftitle: "",
            //     name: "商品名称",
            //     subname: '市场名',
            //     value: 94.83,
            //     percent: 56.6,
            // }, {
            //     title: "产品下滑",
            //     subtitle: "2018-04",
            //     leaftitle: "",
            //     name: "商品名称",
            //     subname: '市场名',
            //     value: 94.83,
            //     percent: 56.6
            // }
        ];

        // this.queryProdMostCards();
        //  end most card

        // 各产品份额
        this.shareTitle = {
            // title: '各产品份额',
            // subtitle: '2018-01',
            // area: '全国'
        };
        this.pieValue = [
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
        // this.queryPerProdShare();
        //  end 各产品份额

        //  各产品排名变化
        this.RankdataType = [
            // '销售额(mil)',
            this.i18n.t('biDashboard.common.rankSales') + "",
            // '销售增长(%)',
            this.i18n.t('biDashboard.common.rankSalesGrowth') + "",
            // '份额(%)',
            this.i18n.t('biDashboard.common.rankShare') + "",
            // '份额增长(%)'
            this.i18n.t('biDashboard.common.rankShareGrowth') + "",
        ];
        this.ranking = [
            //     {
            //     no: 1,
            //     prod: "prod2",
            //     manu: "生产商2",
            //     growth: 4,
            //     value: 38
            // },
            // {
            //     no: 2,
            //     prod: "prod4",
            //     manu: "生产商2",
            //     growth: 4,
            //     value: 30
            // },
            // {
            //     no: 3,
            //     prod: "prod7",
            //     manu: "生产商2",
            //     growth: 4,
            //     value: 18
            // }
        ];
        this.rankingRange = [];
        this.unit = '';
        // this.queryRanking();
        //  end 各产品排名变化

        // 查询查询市场竞品销售情况
        this.competingTitle = {
            // title: '各产品销售概况',
            // subtitle: '2018-01',
            // city:'全国'
        };
        this.competingValue = [
            // {
            //     'prod': '产品一',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // }, {
            //     'prod': '产品二',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // },{
            //     'prod': '产品三',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // },{
            //     'prod': '产品四',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // },{
            //     'prod': '产品五',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // },{
            //     'prod': '产品六',
            //     'manufacturer':"aaaaa",
            //     'market_sale': 123456,
            //     'sales_growth': 16,
            //     'ev_value': 100,
            //     'share': 45,
            //     'share_growth': 9,
            // },
        ];
        // this.queryCompeting();
        // end 查询查询市场竞品销售情况

        // 查询所有产品销售趋势分析
        this.AllTrendTitle = {
            // title: '麻醉市场产品销售趋势分析',
            // timeStart: '2018-01',
            // timeOver: '2018-08',
            // area: '全国',
        };
        this.AllTrendValue = [
            //     {
            //     name: "product1",
            //     values: [{
            //             ym: "2018-01",
            //             value: 100,
            //             unit: ''
            //         },
            //         {
            //             ym: "2018-02",
            //             value: 100,
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
            //             value: 90,
            //             unit: ''
            //         },
            //         {
            //             ym: "2018-02",
            //             value: 120,
            //             unit: ''
            //         }
            //     ]
            // }
        ];
        // this.queryAllProdTrend();
        //	end

        // 查询市场
        this.queryMarket();
    },

    time: computed('year', 'month', function () {
        let year = this.get('year');
        let month = this.get('month');
        return year + '-' + month;
    }),

    computedRankingMax() {
        let ranking = this.get('ranking');
        let range = 0;
        let valueArr = [];
        ranking.map(function (item) {
            valueArr.push(Math.round(item.value));
        })

        let maxValue = Math.max(...valueArr);
        this.set('rankingMax', maxValue);
        if (maxValue < 10) {
            range = 2;
        } else {
            let maxAsArr = String(Math.round(maxValue / 5)).split("");
            let firstMax = Number(maxAsArr[0]);
            let restMax = maxAsArr.length - 1;
            range = (firstMax + 1) * (Math.pow(10, (restMax)));
        }
        let rankingRangeArr = [];
        for (let i = 0; i <= 5; i++) {
            rankingRangeArr.push(i * range)
        }
        this.set('rankingRange', rankingRangeArr)
    },

    /**
     *	查询产品卡片
     */
    queryProdCards() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationsaleshare01',
            res: 'nationsaleshare',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);
        //转成jsonAPI格式

        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/saleShare', 'nationsaleshare', result)
            .then((result) => {
                if (result.SaleShareCard.length != 0) {
                    this.set('cards', result.SaleShareCard)
                }
            })
    },
    /**
     *	查询市场&产品趋势
     */
    queryProdTrend() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationmarkettrend01',
            res: 'nationmarkettrend',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                })
            ])
        });

        //遍历数组
        let result = this.get('data_center_route').object2JsonApi(req);
        //转成jsonAPI格式
        // console.log(result);
        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/marketTrend', 'nationmarkettrend', result)
            .then((result) => {
                this.set('trendTitle', result.ProdSalesOverview)
                if (result.MultipleLine.length != 0) {
                    this.set('multiData', result.MultipleLine);
                }
            })
    },
    /**
     *	查询产品most卡片
     */
    queryProdMostCards() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationmostword01',
            res: 'nationmostword',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);
        //转成jsonAPI格式
        // console.log(result);
        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/mostWord', 'nationmostword', result)
            .then((result) => {
                if (result.MostCard.length != 0) {
                    this.set('words', result.MostCard);
                }
            })
    },
    /**
     *	查询各产品份额
     */
    queryPerProdShare() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationproductshare01',
            res: 'nationproductshare',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);

        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/productShare', 'nationproductshare', result)
            .then((result) => {
                this.set('shareTitle', result.ProdSalesOverview);
                if (result.Pie.length != 0) {
                    this.set('pieValue', result.Pie);
                }
            })
    },
    /**
     *	查询各产品排名变化
     */
    queryRanking() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationproductrank01',
            res: 'nationproductrank',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'tag01',
                    key: 'tag',
                    val: this.ranktag
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);

        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/productRank', 'nationproductrank', result)
            .then((result) => {
                this.set('unit', result.unit);
                if (result.Ranking.length != 0) {
                    this.set('ranking', result.Ranking);
                    this.computedRankingMax();
                }
            })
    },
    /**
     *	查询市场竞品销售情况
     */
    queryCompeting() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationproducttable01',
            res: 'nationproducttable',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);

        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/productTable', 'nationproducttable', result)
            .then((result) => {
                this.set('competingTitle', result.ProdSalesOverview);
                if (result.ProdSalesValue.length != 0) {
                    this.set('competingValue', result.ProdSalesValue);
                }
            })
    },
    /**
     *	查询产品销售趋势
     */
    queryAllProdTrend() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'nationprodtrendanalysis01',
            res: 'nationprodtrendanalysis',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'market01',
                    key: 'market',
                    val: this.market
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'time01',
                    key: 'time',
                    val: this.time
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'user_id01',
                    key: 'user_id',
                    val: this.userId
                }),
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'tag01',
                    key: 'tag',
                    val: this.ranktag
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);

        this.get('data_center_route').queryObject('/api/v1/dashboard/nation/prodTrendAnalysis', 'nationprodtrendanalysis', result)
            .then((result) => {
                this.set('AllTrendTitle', result.ProdSalesOverview);
                if (result.ProdTrendLine.length != 0) {
                    this.set('AllTrendValue', result.ProdTrendLine);
                }
            })
    },
    /**
     * 查询本公司下的所有市场
     */
    queryMarket() {
        let req = this.get('data_center_controller').createModel('request', {
            id: 'allmarket01',
            res: 'allmarket',
            eqcond: new A([
                this.get('data_center_controller').createModel('eqcond', {
                    id: 'company_id01',
                    key: 'company_id',
                    val: this.companyId
                })
            ])
        });

        let result = this.get('data_center_route').object2JsonApi(req);

        this.get('data_center_route').queryObject('/api/v1/search/market/all', 'allmarket', result)
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
            })
    },

    actions: {
        getMarket(params) {
            this.set('market', params)
        },
        getYear: function (params) {
            this.set('year', params);
        },
        getMonth(params) {
            this.set('month', params);
        },
        queryRank(params) {
            if (params === this.i18n.t('biDashboard.common.rankSales') + "") {
                this.set('ranktag', 'sales')
            } else if (params === this.i18n.t('biDashboard.common.rankSalesGrowth') + "") {
                this.set('ranktag', 'salesGrowth')
            } else if (params === this.i18n.t('biDashboard.common.rankShare') + "") {
                this.set('ranktag', 'share')
            } else if (params === this.i18n.t('biDashboard.common.rankShareGrowth') + "") {
                this.set('ranktag', 'shareGrowth')
            }
            this.queryRanking();

        },
        queryTrend(params) {
            if (params === this.i18n.t('biDashboard.common.rankSales') + "") {
                this.set('trendTag', 'sales')
            } else if (params === this.i18n.t('biDashboard.common.rankSalesGrowth') + "") {
                this.set('trendTag', 'salesGrowth')
            } else if (params === this.i18n.t('biDashboard.common.rankShare') + "") {
                this.set('trendTag', 'share')
            } else if (params === this.i18n.t('biDashboard.common.rankShareGrowth') + "") {
                this.set('trendTag', 'shareGrowth')
            }
            this.queryAllProdTrend();
        },
        submit() {
            this.set('year', $("#select-year").val());
            this.set('month', $("#select-month").val());
            this.set('market', $("#select-market").val());
            this.set('markTime', false);
            this.queryProdCards();
            this.queryProdTrend();
            this.queryProdMostCards();
            this.queryPerProdShare();
            this.queryRanking();
            this.queryCompeting();
            this.queryAllProdTrend();
        },
    }
});
