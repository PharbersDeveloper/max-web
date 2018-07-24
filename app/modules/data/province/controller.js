import Controller from '@ember/controller';
import {
    inject
} from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
    ajax: inject(),
    cookies: inject(),
    activeCi: true,
    // time: '2017-03',
    market: '麻醉市场',
    provRankTag: 'provinceSales',
    prodRankTag: "sales",
    // rankingMax: 0,
    prodRankMax: 0,
    provRankMax: 0,
    year: '2017',
    month: '03',
    prov: '北京',
    time: computed('year', 'month', function() {
        // body
        let year = this.get('year');
        let month = this.get('month');
        return year + '-' + month;
    }),
    computedRankingMax(whichValue, whickMax, whickRank) {
        let ranking = this.get(whichValue);
        let range = 0;
        let valueArr = [];
        ranking.map(function(item) {
            valueArr.push(Math.round(item.value));
        })

        let maxValue = Math.max(...valueArr);
        // this.set('rankingMax', maxValue);
        this.set(whickMax, maxValue);

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
        // this.set('rankingRange', rankingRangeArr);
        this.set(whickRank, rankingRangeArr);
    },
    getAjaxOpt(data) {
        return {
            method: 'POST',
            dataType: 'json',
            cache: false,
            data: JSON.stringify(data),
            contentType: 'application/json,charset=utf-8',
            Accpt: 'application/json,charset=utf-8',
        }
    },
    /**
     *	查询市场产品卡片
     */
    queryMarketProdCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/province/provinceName', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询产品cards(in province)：')
                    // console.log(result);
                    this.set('cards', result.provinceWord);
                } else {}
            })
    },
    /**
     * 查询混合图数据
     *
     */
    queryMixedGraph() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
            }
        }
        this.get('ajax').request('api/dashboard/province/lineOverview', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询查询lllllline(in pro)：')
                    // console.log(result);
                    this.set('mixedGraphTitle', result.graphSale.provLineOverview);
                    this.set('mixedGraphData', result.graphSale.mixedGraphData);
                    // this.set('marketSalesValue', result.prodSalesValue);

                }
            })
    },
    /**
     *	查询市场各省份销售概况-table
     */
    queryMarketSalesTable() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
            }
        }
        this.get('ajax').request('api/dashboard/province/tableOverview', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询查询市场竞品销售情况(in pro)：')
                    // console.log(result);
                    this.set('competingTitle', result.proTableOverview)
                    this.set('marketSalesValue', result.prodSalesValue);
                    // console.log(result.prodSalesValue)
                    // this.set('shareTitle', result.prodSalesOverview);
                }
            })
    },

    /**
     *	市场销售组成-pie
     */
    queryPerMarketShare() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/province/marketPart', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询各产品份额(in pro)：')
                    console.log(result);
                    this.set('marketSalesPie', result.pie);
                    this.set('marketTitle', result.marketSharePart);

                }
            })
    },

    /**
     *	查询市场层面排行
     */
    queryMarketRank() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "tag": this.get('provRankTag')
            }
        }
        this.get('ajax').request('api/dashboard/province/provLevelRank', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询各产品排名变化(in pro)：')
                    // console.log(result);
                    this.set('unit', result.unit);
                    this.set('provRankValue', result.ranking);
                    this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
                }
            })
    },

    /**
     *	市场销售总额 卡片数据
     */
    queryProdCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "北京"
            }
        }
        this.get('ajax').request('api/dashboard/province/provMarketSale', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询产品cards(in country)：')
                    // console.log(result);
                    this.set('sales', result.productMarketSale);
                }
            })
    },
    /**
     * queryTrend
     *
     */
    queryProdTrend() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "北京"
            }
        }
        this.get('ajax').request('api/dashboard/province/productTrend', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询aaaaaaaaaaaaaaaaa')
                    console.log(result);
                    this.set('trendTitle', result.tableSale.prodSalesOverview)
                    this.set('prodTrend', result.tableSale.multiData);
                }
            })
    },
    /**
     *	竞品数量 卡片数据
     */
    queryProdMostCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "北京"
            }
        }
        this.get('ajax').request('api/dashboard/province/productCard', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询竞品数量(in pro)：')
                    // console.log(result);
                    this.set('words', result.proProductCard);
                }
            })
    },
    /**
     *	产品份额-pie
     */
    queryPerProductShare() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "北京"
            }
        }
        this.get('ajax').request('api/dashboard/province/productShare', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询各产品份额qqq(in pro)：')
                    // console.log(result);
                    this.set('marketShare', result.pie);
                    this.set('marketTitle', result.marketSharePart);

                }
            })
    },
    /**
     *	各产品排名变化
     */
    queryProductRank() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "河北",
                "tag": this.get('prodRankTag')
            }
        }
        this.get('ajax').request('api/dashboard/province/prodRankChange', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询各产品排名变化qqq(in pro)：')
                    console.log(result);
                    this.set('unit', result.unit);
                    this.set('prodRankValue', result.ranking);
                    // this.computedRankingMax();
                    this.computedRankingMax('prodRankValue', 'prodRankMax', 'prodRankRange');

                }
            })
    },


    /**
     *	各竞品销售概况-table
     */
    queryProductSalesTable() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "province": "河北"
            }
        }
        this.get('ajax').request('api/dashboard/province/prodSaleOverview', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询查询市场竞品销售情况(in pro)：')
                    // console.log(result);
                    this.set('competingTitle', result.prodSalesOverview)
                    this.set('competingProdValue', result.competeSaleTable);
                    // console.log(result.prodSalesValue)
                    // this.set('shareTitle', result.prodSalesOverview);
                }
            })
    },

    init() {
        this._super(...arguments);
        this.markets = ['麻醉市场'];
        this.years = ['2018', '2017', '2016'];
        this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.provRank = ['市场规模(mil)', '市场增长(%)', '销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];
        this.prodRank = ['销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];
        //  市场规模卡片数据
        this.cards = [];
        this.queryMarketProdCards();
        //  end 市场规模卡片数据

        //  市场各省份销售概况-混合图
        this.mixedGraphData = [];
        this.queryMixedGraph();
        // end市场各省份销售概况-混合图

        //  市场各省份销售概况-table
        this.MarketSales = [{
            label: '省份名',
            valuePath: 'province',
            classNames: 'tabl',
            align: 'center',
            sorted: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
            // breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列
        }, {
            label: '市场大小',
            valuePath: 'market_size',
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
            // breakpoints: ['mobile', 'tablet', 'desktop']
        }, {
            label: '市场增长(%)',
            valuePath: 'market_groth',
            // width: '100px',
            align: 'center',
            classNames: 'tabl',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'sales_amount',
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
        }];
        this.marketSalesValue = [];
        this.queryMarketSalesTable();
        // end 市场各省份销售概况-table

        //  市场销售组成-pie
        this.marketSalesPie = [];
        this.marketTitle = {};
        this.queryPerMarketShare();
        //  end 市场销售组成

        //  市场省份层面排行
        this.provRankValue = [];
        // this.rankingRange = [];
        this.provRankRange = [];
        this.queryMarketRank();
        this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
        // this.computedRankingMax();
        //  end 市场省份层面排行

        //市场销售总额-卡片数据
        this.sales = [];
        this.queryProdCards();
        //end 市场销售总额-卡片数据
        // prodTrend
        this.prodTrend = [];
        this.queryProdTrend();
        // end prodTrend
        //竞品数量-卡片数据
        this.words = [];
        this.queryProdMostCards();
        //end 竞品数量-卡片数据

        //产品份额-pie
        this.marketSalesPie = [];
        this.marketTitle = {};
        this.queryPerProductShare();
        //end 产品份额-pie

        //各产品排名变化
        this.prodRankValue = [];
        // this.rankingRange = [];
        this.prodRankRange = [];

        this.queryProductRank();
        this.computedRankingMax('prodRankValue', 'prodRankMax', 'prodRankRange');
        //end 各产品排名变化

        //各竞品销售概况-table
        this.competingProd = [{
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sorted: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            label: '生产商',
            valuePath: 'manufacturer',
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'market_sale',
            align: 'center',
            classNames: 'tabl',
            minResizeWidth: '70px',
        }, {
            label: '销售增长',
            valuePath: 'sales_growth',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: 'EV值(%)',
            valuePath: 'ev_value',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '份额(%)',
            valuePath: 'share',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '份额增长(%)',
            valuePath: 'share_growth',
            align: 'center',
            minResizeWidth: '70px',
        }];
        this.competingProdValue = [];
        this.queryProductSalesTable();
        //end 各竞品销售概况-table

        this.provinces = ['河北省', '河南省'];
        this.prodSalesOverview = {};
        this.prodSalesTable = [];

        this.prodCont = [{
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sorted: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度

        }, {
            label: '市场名',
            valuePath: 'market',
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'sales',
            align: 'center',
            classNames: 'tabl',
            minResizeWidth: '70px',

        }, {
            label: '贡献度',
            valuePath: 'cont',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '贡献度变化 -  上期(%)',
            valuePath: 'cont-month',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '贡献度变化 - 三个月(%)',
            valuePath: 'cont-season',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '贡献度变化 - 去年同期(%)',
            valuePath: 'cont-year',
            align: 'center',
            minResizeWidth: '70px',
        }];
    },
    actions: {
        getMarket(params) {
            this.set('market', params)
        },
        getYear: function(params) {
            this.set('year', params);
        },
        getMonth(params) {
            this.set('month', params);
        },
        queryProvRank(params) {
            console.log(params);
            if (params === '市场规模(mil)') {
                this.set('provRankTag', 'provinceSales')
            } else if (params === '市场增长(%)') {
                console.log('salesGrowth')
                this.set('provRankTag', 'provMomGrowth')
            } else if (params === '销售额(mil)') {
                this.set('provRankTag', 'companySales')
            } else if (params === '销售增长(%)') {
                this.set('provRankTag', 'companySalesMomGrowth')
            } else if (params === '份额(%)') {
                this.set('provRankTag', 'companyShare')
            } else if (params === '份额增长(%') {
                this.set('provRankTag', 'companyShareMomGrowth')
            }
            this.queryMarketRank();
        },
        queryProdRank(params) {
            console.log(params);
            // this.prodRank = ['销售增长(%)', '份额(%)', '份额增长(%)'];
            if (params === '销售额(mil)') {
                this.set('prodRankTag', 'sales')
            } else if (params === '销售增长(%)') {
                this.set('prodRankTag', 'salesGrowth')
            } else if (params === '份额(%)') {
                // console.log('salesGrowth');
                this.set('prodRankTag', 'share')
            } else if (params === '份额增长(%)') {
                this.set('prodRankTag', 'shareGrowth')
            }
            this.queryProductRank();

        },
        submit() {
            this.set('modal3', false);
            this.queryMarketProdCards();
            this.queryMixedGraph();
            this.queryMarketSalesTable();
            this.queryPerMarketShare();
            this.queryMarketRank();
        },

        testsubmit() {
            console.log('aaaaaaaaaaaaa');
        }
    }
});