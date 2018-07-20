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
    rankingMax: 0,
    activeCi: true,
    year: '2017',
    month: '03',
    time: computed('year', 'month', function() {
        // body
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
        // let maxValue = 34.3;
        if (maxValue < 10) {
            // return 10;
            range = 2;
            // let rankingRangeArr = [0,2,4,6,8,10];
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
        // }
        // if(Number(maxAsArr[1]) < 5) {
        // 	// return Number(firstMax + 5*(Math.pow(10,restMax)));
        // 	console.log(Number(firstMax + 5*(Math.pow(10,restMax))))
        // }else {
        // 	// return (firstMax+1)*(Math.pow(10,(restMax+1)));
        // 	console.log((firstMax+1)*(Math.pow(10,(restMax+1))));
        // }

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
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询产品cards(in country)：')
                    // console.log(result);
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
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询市场&产品趋势(in country)：')
                    console.log(result.tableSale.multiData);
                    this.set('trendTitle', result.tableSale.prodSalesOverview)
                    this.set('multiData', result.tableSale.multiData);
                    // title = resulttableSale.prodSalesOverview
                    // result = result.tableSale.multiData
                    // this.set('cards', result.saleShareCard);
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
            .then(({
                status,
                result,
                error
            }) => {
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
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询各产品份额(in country)：')
                    console.log(result.pie);
                    this.set('pieValue', result.pie);
                    this.set('shareTitle', result.prodSalesOverview);

                }
            })
    },
    /**
     *	查询各产品排名变化
     */
    queryRank() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time'),
                "market": this.get('market'),
                "tag": this.get('ranktag')
            }
        }
        this.get('ajax').request('api/dashboard/nation/productRank', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
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
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询查询市场竞品销售情况(in country)：')
                    // console.log(result);
                    this.set('competingTitle', result.prodSalesOverview)
                    this.set('competingValue', result.prodSalesValue);
                    // this.set('shareTitle', result.prodSalesOverview);
                }
            })
    },
    init() {
        this._super(...arguments);
        // 产品销量卡片
        this.cards = [];
        this.queryProdCards();
        // end 产品销量卡片

        // 市场&产品趋势
        this.trendTitle = {};
        this.multiData = [];
        this.queryProdTrend();
        // end 市场&产品趋势

        // Most cards
        this.words = [];
        this.queryProdMostCards();
        //  end most card

        // 各产品份额
        this.shareTitle = {};
        this.pieValue = [];
        this.queryPerProdShare();
        //  end 各产品份额

        //  各产品排名变化
        this.RankdataType = ['销售额','销售增长','份额','份额增长'];
        this.ranking = [];
        this.rankingRange = [];
        this.queryRank();
        //  end 各产品排名变化

        // 查询查询市场竞品销售情况
        this.competingValue = [];
        this.queryCompeting();
        // end 查询查询市场竞品销售情况
        this.markets = ['first', 'second'];

        this.competingColumn = [{
            label: '商品名',
            valuePath: 'prod',
            // width: '100px',
            classNames: 'tabl',
            align: 'center',
            sorted: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
            // breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列
        }, {
            label: '生产商',
            valuePath: 'manufacturer',
            sorted: false,
            // width: '100px',
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
            // breakpoints: ['mobile', 'tablet', 'desktop']
        }, {
            label: '销售额',
            valuePath: 'market_sale',
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
        this.markets = ['麻醉市场'];
        this.years = ['2018', '2017', '2016'];
        this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
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
            if(params === '销售额'){
                this.set('ranktag','sales')
            } else if (params === '销售增长') {
                this.set('ranktag','salesGrowth')
            }else if (params === '份额') {
                this.set('ranktag','prodShare')
            }else if (params === '份额增长') {
                this.set('ranktag','prodShareGrowth')
            }
            this.queryRank();

        },
        submit() {
            this.set('modal3', false);
            this.queryProdOV();
            this.queryCards();
            this.queryProdSales();
            this.queryProdCont();
        },
    }
});
