import Controller from '@ember/controller';
import {
    inject
} from '@ember/service';
import {
    computed
} from '@ember/object';
export default Controller.extend({
    ajax: inject(),
    cookies: inject(),
    market: '麻醉市场',
    ranktag: 'sales',
    trendTag: 'sales',
    rankingMax: 0,
    activeCi: true,
    year: '2017',
    month: '03',
    time: computed('year', 'month', function() {
        let year = this.get('year');
        let month = this.get('month');
        return year + '-' + month;
    }),
    computedRankingMax() {
        let ranking = this.get('ranking');
        let range = 0;
        let valueArr = [];
        ranking.map(function(item) {
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
            // console.log((firstMax+1)*(Math.pow(10,(restMax))));
            range = (firstMax + 1) * (Math.pow(10, (restMax)));
        }
        let rankingRangeArr = [];
        for (let i = 0; i <= 5; i++) {
            rankingRangeArr.push(i * range)
        }
        this.set('rankingRange', rankingRangeArr)
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

    /**
     *	查询产品卡片
     */
    queryProdCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/nation/saleShare', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    this.set('cards', result.saleShareCard);
                }
            })
    },
    /**
     *	查询市场&产品趋势
     */
    queryProdTrend() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/nation/marketTrend', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    // console.log('查询市场&产品趋势(in country)：')
                    // console.log(result.tableSale.multiData);
                    this.set('trendTitle', result.tableSale.prodSalesOverview)
                    this.set('multiData', result.tableSale.multiData);
                }
            })
    },
    /**
     *	查询产品most卡片
     */
    queryProdMostCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/nation/mostWord', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    // console.log('查询产品Mostcards(in country)：')
                    // console.log(result);
                    this.set('words', result.mostCard);
                }
            })
    },
    /**
     *	查询各产品份额
     */
    queryPerProdShare() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market')
            }
        }
        this.get('ajax').request('api/dashboard/nation/productShare', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    // console.log('查询各产品份额(in country)：')
                    // console.log(result.pie);
                    this.set('pieValue', result.pie);
                    this.set('shareTitle', result.prodSalesOverview);
                }
            })
    },
    /**
     *	查询各产品排名变化
     */
    queryRanking() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "tag": this.get('ranktag')
            }
        }
        this.get('ajax').request('api/dashboard/nation/productRank', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    // console.log('查询各产品排名变化(in country)：')
                    // console.log(result);
                    this.set('unit', result.unit);
                    this.set('ranking', result.ranking);
                    this.computedRankingMax();
                }
            })
    },
    /**
     *	查询市场竞品销售情况
     */
    queryCompeting() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
            }
        }
        this.get('ajax').request('api/dashboard/nation/productTable', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    // console.log('查询查询市场竞品销售情况(in country)：')
                    // console.log(result);
                    this.set('competingTitle', result.prodSalesOverview)
                    this.set('competingValue', result.prodSalesValue);
                }
            })
    },
    /**
     *	查询产品销售趋势
     */
    queryAllProdTrend() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "tag": this.get('trendTag')
            }
        }
        this.get('ajax').request('api/dashboard/nation/prodTrendAnalysis', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    console.log('查询查询市场销售趋势(in country)：')
                    console.log(result);
                    this.set('AllTrendTitle', result.prodSalesOverview);
                    this.set('AllTrendValue', result.multiData);
                }
            })
    },
    /**
     * 查询本公司下的所有市场
     */
    queryMarket() {
        /* let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid')
            }
        }
        this.get('ajax').request('api/search/market/all', this.getAjaxOpt(condition))
            .then(({ status, result, error }) => {
                if (status === 'ok') {
                    this.set('markets', result.markets);
                    this.set('market', result.markets[0]);
                    this.queryProdCards();
                    this.queryProdTrend();
                    this.queryProdMostCards();
                    this.queryPerProdShare();
                    this.queryRanking();
                    this.queryCompeting();
                    this.queryAllProdTrend();
                }
            }) */
    },
    init() {
        this._super(...arguments);

        // 产品销量卡片
        this.cards = [{
            title: "title",
            subtitle: "subtitle",
            leaftitle: "area",
            num: 625.7,
            tag: 'mil',
            yearOnYear: 4.3,
            ringRatio: 4.3,
        }, {
            title: "title",
            subtitle: "subtitle",
            leaftitle: "area",
            num: 625.7,
            tag: 'mil',
            yearOnYear: 4.3,
            ringRatio: 4.3,
        }, {
            title: "title",
            subtitle: "subtitle",
            leaftitle: "area",
            num: 25.77,
            tag:'%',
            yearOnYear: 4.3,
            ringRatio: 4.3,
        }];
        // this.queryProdCards();
        // end 产品销量卡片

        // 市场&产品趋势
        this.trendTitle = {
            title: '市场规模 & 辉瑞产品销售趋势',
            timeStart: '2018-01',
            timeOver: '2018-08',
            area: '全国',
        };
        this.multiData = [{
            "ym": "2017-01",
            "marketSales": 27,
            "prodSales": 15,
            "share": 20
        }, {
            "ym": "2017-02",
            "marketSales": 26,
            "prodSales": 15,
            "share": 25
        }, {
            "ym": "2017-03",
            "marketSales": 27,
            "prodSales": 15,
            "share": 20
        }, ];
        // this.queryProdTrend();
        // end 市场&产品趋势

        // Most cards
        this.words = [{
            title:'竟品数量',
            subtitle:'2018-04',
            leaftitle:'全国',
            name:65
        },{
            title: "title",
            subtitle: "subtitle",
            leaftitle: "全国",
            name: "市场名称",
            subname: 'subname',
            value: 94.83,
            percent: 5.6
        }, {
            title: "产品下滑",
            subtitle: "2018-04",
            leaftitle: "",
            name: "商品名称",
            subname: '市场名',
            value: 94.83,
            percent: 56.6,
        }, {
            title: "产品下滑",
            subtitle: "2018-04",
            leaftitle: "",
            name: "商品名称",
            subname: '市场名',
            value: 94.83,
            percent: 56.6
        }];

        // this.queryProdMostCards();
        //  end most card

        // 各产品份额
        this.shareTitle = {
            title: '各产品份额',
            subtitle: '2018-01',
            area: '全国'
        };
        this.pieValue = [{
			'title': '产品一',
			'show_value': 10,
			'share': 848,
			'color': '#3399FF',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'848',
                unit:'',
            },
            {
                key:'份额:',
                value:'10',
                unit:'',
            },],
		}, {
			'title': '产品二',
			'show_value': 8,
			'share': 845,
			'color': 'orange',
			'tips':  [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'845',
                unit:'',
            },
            {
                key:'份额:',
                value:'8',
                unit:'',
            },],
		}, {
			'title': '产品三',
			'show_value': 2,
			'share': 256,
			'color': 'lightyellow',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'256',
                unit:'',
            },
            {
                key:'份额:',
                value:'2',
                unit:'',
            },],
		}, {
			'title': '产品四',
			'show_value': 18,
			'share': 452,
			'color': 'lightgreen',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'452',
                unit:'',
            },
            {
                key:'份额:',
                value:'18',
                unit:'',
            },],
		}, {
			'title': '产品5',
			'show_value': 2,
			'share': 411,
			'color': 'blue',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'411',
                unit:'',
            },
            {
                key:'份额:',
                value:'2',
                unit:'',
            },],
		}, {
			'title': '产品6',
			'show_value': 7,
			'share': 421,
			'color': 'lightblue',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'421',
                unit:'',
            },
            {
                key:'份额:',
                value:'7',
                unit:'',
            },],
		}, {
			'title': '产品7',
			'show_value': 10,
			'share': 444,
			'color': 'pink',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'444',
                unit:'',
            },
            {
                key:'份额:',
                value:'10',
                unit:'',
            },],
		}, {
			'title': '产品8',
			'show_value': 14,
			'share': 422,
			'color': 'lightgray',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'422',
                unit:'',
            },
            {
                key:'份额:',
                value:'14',
                unit:'',
            },],
		}, {
			'title': '其他',
			'show_value': 30,
			'share': 175,
			'color': 'skyblue',
			'tips': [{
                key:'生产商:',
                value:'XXX公司',
                unit:'',
            },
            {
                key:'销售额:',
                value:'175',
                unit:'',
            },
            {
                key:'份额:',
                value:'30',
                unit:'',
            },],
		}, ];
        // this.queryPerProdShare();
        //  end 各产品份额

        //  各产品排名变化
        this.RankdataType = ['销售额', '销售增长', '份额', '份额增长'];
        this.ranking = [{
            no: 1,
            prod: "prod2",
            manu: "生产商2",
            growth: 4,
            value: 38
        },
        {
            no: 2,
            prod: "prod4",
            manu: "生产商2",
            growth: 4,
            value: 30
        },
        {
            no: 3,
            prod: "prod7",
            manu: "生产商2",
            growth: 4,
            value: 18
        }];
        this.rankingRange = [];
        this.unit = '%';
        this.computedRankingMax();
        // this.queryRanking();
        //  end 各产品排名变化

        // 查询查询市场竞品销售情况
        this.competingTitle = {
            title: '各产品销售概况',
            subtitle: '2018-01',
            city:'全国'
        };
        this.competingValue = [{
            'prod': '产品一',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        }, {
            'prod': '产品二',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        },{
            'prod': '产品三',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        },{
            'prod': '产品四',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        },{
            'prod': '产品五',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        },{
            'prod': '产品六',
            'manufacturer':"aaaaa",
            'market_sale': 123456,
            'sales_growth': 16,
            'ev_value': 100,
            'share': 45,
            'share_growth': 9,
        }, ];
        // this.queryCompeting();
        // end 查询查询市场竞品销售情况
        // 查询所有产品销售趋势分析
        this.AllTrendTitle = {
            title: '麻醉市场产品销售趋势分析',
            timeStart: '2018-01',
            timeOver: '2018-08',
            area: '全国',
        };
        this.AllTrendValue = [{
            name: "product1",
            values: [{
                    ym: "2018-01",
                    value: 100,
                    unit: ''
                },
                {
                    ym: "2018-02",
                    value: 100,
                    unit: ''
                }
            ]
        }, {
            name: "product2",
            values: [{
                    ym: "2018-01",
                    value: 100,
                    unit: ''
                },
                {
                    ym: "2018-02",
                    value: 110,
                    unit: ''
                }
            ]
        }, {
            name: "product3",
            values: [{
                    ym: "2018-01",
                    value: 90,
                    unit: ''
                },
                {
                    ym: "2018-02",
                    value: 120,
                    unit: ''
                }
            ]
        }];
        // this.queryAllProdTrend();
        //	end

        this.competingColumn = [{
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            label: '生产商',
            valuePath: 'manufacturer',
            sortable: false,
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'market_sale',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售增长(%)',
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
        this.markets = [];
        this.years = ['2018', '2017', '2016'];
        this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.trendData = ['销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];
        // 查询市场
        this.queryMarket();
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
        queryRank(params) {
            if (params === '销售额') {
                this.set('ranktag', 'sales')
            } else if (params === '销售增长') {
                this.set('ranktag', 'salesGrowth')
            } else if (params === '份额') {
                this.set('ranktag', 'prodShare')
            } else if (params === '份额增长') {
                this.set('ranktag', 'prodShareGrowth')
            }
            this.queryRanking();

        },
        queryTrend(params) {
            // console.log(params);
            if (params === '销售额(mil)') {
                this.set('trendTag', 'sales')
            } else if (params === '销售增长(%)') {
                this.set('trendTag', 'salesGrowth')
            } else if (params === '份额(%)') {
                this.set('trendTag', 'share')
            } else if (params === '份额增长(%)') {
                this.set('trendTag', 'shareGrowth')
            }
            this.queryAllProdTrend();
        },
        submit() {
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