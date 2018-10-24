import Controller from '@ember/controller';
import {
    inject
} from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
export default Controller.extend({
    cookies: inject(),
    market: '麻醉市场',
    provRankTag: 'provinceSales',
    prodRankTag: "sales",
    trendTag: 'sales',
    prodRankMax: 0,
    provRankMax: 0,
    year: '2017',
    month: '01',
    prov: '北京市',
    userId : localStorage.getItem('userid'),
    companyId : localStorage.getItem('company_id'),
    // oldtime: computed('year', 'month', function() {
    //     let year = this.get('year');
    //     let month = this.get('month');
    //     return year + '-' + month;
    // }),
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
        console.log(whickRank);
        console.log(rankingRangeArr);
    },
    /**
     *	查询市场产品卡片
     */
    queryMarketProdCards() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/provinceName', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询产品cards(in province)：')
        //             // console.log(result);
        //             this.set('cards', result.provinceWord);
        //         } else {}
        //     })

        let req = this.store.createRecord('request', {
            res: 'provincename',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
                key: 'company_id',
                val: this.companyId,
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
        this.store.queryObject('/api/v1/dashboard/province/provinceName', 'provincename', result).then((result) => {
            if (result.ProvinceWord.length == 0) {
            } else {
                this.set('cards', result.ProvinceWord)
                console.log(this.cards.length);
            }
        }) //response
    },
    /**
     * 查询混合图数据
     *
     */
    queryMixedGraph() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/lineOverview', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询查询lllllline(in pro)：')
        //             // console.log(result);
        //             this.set('mixedGraphTitle', result.graphSale.provLineOverview);
        //             this.set('mixedGraphData', result.graphSale.mixedGraphData);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provincelineoverview',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
                key: 'company_id',
                val: this.companyId,
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
        this.store.queryObject('/api/v1/dashboard/province/lineOverview', 'provincelineoverview', result).then((result) => {
            this.set('mixedGraphTitle', result.ProdSalesOverview);
            if (result.MixedGraphLine.length == 0) {
            } else {
                // this.set('mixedGraphData', result.MixedGraphLine);
                console.log(this.mixedGraphData.length);
            }
        }) //response
    },
    /**
     *	查询市场各省份销售概况-table
     */
    queryMarketSalesTable() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/tableOverview', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询查询市场竞品销售情况(in pro)：')
        //             // console.log(result);
        //             this.set('provSalesTitle', result.proTableOverview)
        //             this.set('marketSalesValue', result.prodSalesValue);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provincetableoverview',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
                key: 'company_id',
                val: this.companyId,
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
        this.store.queryObject('/api/v1/dashboard/province/tableOverview', 'provincetableoverview', result).then((result) => {
            this.set('provSalesTitle', result.ProdSalesOverview)
            if (result.ProdSalesValue.length == 0) {
            } else {
                this.set('marketSalesValue', result.ProdSalesValue);
                console.log(this.marketSalesValue);
            }
        }) //response
    },

    /**
     *	市场销售组成-pie
     */
    queryPerMarketShare() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/marketPart', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询各产品份额(in pro)：')
        //             // console.log(result);
        //             this.set('marketSalesPie', result.pie);
        //             this.set('marketTitle', result.marketSharePart);

        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provincemarketpart',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
                key: 'company_id',
                val: this.companyId,
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
        this.store.queryObject('/api/v1/dashboard/province/marketPart', 'provincemarketpart', result).then((result) => {
            this.set('marketTitle', result.ProdSalesOverview)
            if (result.Pie.length == 0) {
            } else {
                this.set('marketSalesPie', result.Pie);
                console.log(this.marketSalesPie.length);
            }
        }) //response
    },

    /**
     *	查询市场层面排行
     */
    queryMarketRank() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "tag": this.get('provRankTag')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/provLevelRank', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询各产品排名变化(in pro)：')
        //             // console.log(result);
        //             this.set('unit', result.unit);
        //             this.set('provRankValue', result.ranking);
        //             this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provincelevelrank',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'tag',
                val: this.provRankTag,
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
        this.store.queryObject('/api/v1/dashboard/province/provLevelRank', 'provincelevelrank', result).then((result) => {
            this.set('marketRankingUnit', result.unit);
            console.log(this.marketRankingUnit);
            if (result.Ranking.length == 0) {
            } else {
                this.set('provRankValue', result.Ranking);
                this.computedRankingMax('provRankValue', 'provRankMax', 'provRankRange');
                console.log(this.provRankValue.length);
            }
        }) //response
    },

    /**
     *	市场销售总额 卡片数据
     */
    queryProdCards() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov')
        //     }
        // }
        // console.log('++++++++++++++++++++++++++');
        // console.log(this.get('prov'));
        // this.get('ajax').request('api/dashboard/province/provMarketSale', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询产品cards(in country)：')
        //             // console.log(result);
        //             this.set('sales', result.productMarketSale);
        //         }
        //     })
        
        let req = this.store.createRecord('request', {
            res: 'provincemarketsale',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/provMarketSale', 'provincemarketsale', result).then((result) => {
            if (result.SaleShareCard.length == 0) {
            } else {
                this.set('sales', result.SaleShareCard);
                console.log(this.sales.length);
            }
        }) //response
    },
    /**
     * queryTrend
     *
     */
    queryProdTrend() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/productTrend', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询aaaaaaaaaaaaaaaaa')
        //             // console.log(result);
        //             this.set('trendTitle', result.tableSale.prodSalesOverview)
        //             this.set('prodTrend', result.tableSale.multiData);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproducttrend',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/productTrend', 'provinceproducttrend', result).then((result) => {
            this.set('trendTitle', result.ProdSalesOverview);
            if (result.MultipleLine.length == 0) {
            } else {
                this.set('prodTrend', result.MultipleLine);
                console.log(this.prodTrend.length);
            }
        }) //response
    },
    /**
     *	竞品数量 卡片数据
     */
    queryProdMostCards() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/productCard', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询竞品数量(in pro)：')
        //             // console.log(result);
        //             this.set('words', result.proProductCard);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproductcard',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/productCard', 'provinceproductcard', result).then((result) => {
            if (result.ProProductCard.length == 0) {
            } else {
                this.set('words', result.ProProductCard);
                console.log(this.words.length);
            }
        }) //response
    },
    /**
     *	产品份额-pie
     */
    queryPerProductShare() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/productShare', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询各产品份额qqq(in pro)：')
        //             // console.log(result);
        //             this.set('marketShare', result.pie);
        //             this.set('marketTitle', result.marketSharePart);

        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproductshare',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/productShare', 'provinceproductshare', result).then((result) => {
            this.set('marketTitle', result.ProdSalesOverview);
            if (result.Pie.length == 0) {
            } else {
                this.set('marketShare', result.Pie);
                console.log(this.marketShare.length);
            }
        }) //response
    },
    /**
     *	各产品排名变化
     */
    queryProductRank() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov'),
        //         "tag": this.get('prodRankTag')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/prodRankChange', this.getAjaxOpt(condition))
        //     .then(({
        //         status,
        //         result,
        //         error
        //     }) => {
        //         if (status === 'ok') {
        //             // console.log('查询各产品排名变化qqq(in pro)：')
        //             // console.log(result);
        //             this.set('unit', result.unit);
        //             this.set('prodRankValue', result.ranking);
        //             // this.computedRankingMax();
        //             this.computedRankingMax('prodRankValue', 'prodRankMax', 'prodRankRange');

        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproductrankchange',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
                category: null
            },
            {
                type: 'eqcond',
                key: 'tag',
                val: this.prodRankTag,
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
        this.store.queryObject('/api/v1/dashboard/province/prodRankChange', 'provinceproductrankchange', result).then((result) => {
            this.set('prodRankingUnit', result.ProdSalesOverview.unit);
            if (result.Ranking.length == 0) {
            } else {
                this.set('prodRankValue', result.Ranking);
                this.computedRankingMax('prodRankValue', 'prodRankMax', 'prodRankRange');
                console.log(this.prodRankValue.length);
            }
        }) //response
    },


    /**
     *	各竞品销售概况-table
     */
    queryProductSalesTable() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "province": this.get('prov')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/province/prodSaleOverview', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log('查询查询市场竞品销售情况(in pro)：')
        //             // console.log(result);
        //             this.set('competingTitle', result.prodSalesOverview)
        //             this.set('competingProdValue', result.competeSaleTable);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproductsaleoverview',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/prodSaleOverview', 'provinceproductsaleoverview', result).then((result) => {
            this.set('competingTitle', result.ProdSalesOverview);
            if (result.ProdSalesValue.length == 0) {
            } else {
                this.set('competingProdValue', result.ProdSalesValue);
                console.log(this.competingProdValue.length);
            }
        }) //response
    },
    /**
     *	查询产品销售趋势
     */
    queryAllProdTrend() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market'),
        //         "tag": this.get('trendTag')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/nation/prodTrendAnalysis', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log('查询查询市场销售趋势(in country)：')
        //             // console.log(result);
        //             this.set('AllTrendTitle', result.prodSalesOverview);
        //             this.set('AllTrendValue', result.multiData);
        //         }
        //     })

        let req = this.store.createRecord('request', {
            res: 'provinceproducttrendanalysis',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'market',
                val: this.market,
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
            },
            {
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
                category: null
            },
            {
                type: 'eqcond',
                key: 'tag',
                val: this.trendTag,
                category: null
            },
            {
                type: 'eqcond',
                key: 'province',
                val: this.prov,
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
        this.store.queryObject('/api/v1/dashboard/province/prodTrendAnalysis', 'provinceproducttrendanalysis', result).then((result) => {
            this.set('AllTrendTitle', result.ProdSalesOverview);
            if (result.ProdTrendLine.length == 0) {
            } else {
                this.set('AllTrendValue', result.ProdTrendLine);
                console.log(this.AllTrendValue.length);
            }
        }) //response
    },
    /**
     * 查询本公司下的所有市场
     */
    queryMarket() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid')
        //     }
        // }
        // this.get('ajax').request('api/search/market/all', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             this.set('markets', result.markets);
        //             this.set('market', result.markets[0]);
        //             return result.markets[0];
        //         }
        //     })
        //     .then(this.queryMarketProdCards())
        //     .then(this.queryMixedGraph())
        //     .then(this.queryMarketSalesTable())
        //     .then(this.queryPerMarketShare())
        //     .then(this.queryMarketRank())
        //     .then(this.queryMarketProv());
        
        let req = this.store.createRecord('request', {
            res: 'allmarket',
        });
        //要发送的数据格式
        let eqValues = [{
                type: 'eqcond',
                key: 'company_id',
                val: this.companyId,
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
        this.store.queryObject('/api/v1/search/market/all', 'allmarket', result).then((result) => {
            if (result.status === 'ok') {
                let tempMarkets = [];
                result.Market.forEach(function(d) {
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
        }) //response

    },
    /**
     *	查询市场下的所有城市
     */
    queryMarketProv() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time'),
        //         "market": this.get('market')
        //     }
        // }
        // this.get('ajax').request('/api/dashboard/province/all', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log(result);
        //             this.set('provs', result.provinces);
        //             console.log("/////////////////////////");
        //             console.log(result.provinces[0]);
        //             this.set('prov', result.provinces[0]);
        //             this.queryProdCards();
        //             this.queryProdTrend();
        //             this.queryProdMostCards();
        //             this.queryPerProductShare();
        //             this.queryProductRank();
        //             this.queryProductSalesTable();
        //             this.queryAllProdTrend();
        //             return result.provinces[0];
        //         } else {}
        //     })

        let req = this.store.createRecord('request', {
            res: 'allprovince',
        });
        //要发送的数据格式
        let eqValues = [{
            type: 'eqcond',
            key: 'market',
            val: this.market,
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
            key: 'company_id',
            val: this.companyId,
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
        this.store.queryObject('/api/v1/search/province/all', 'allprovince', result).then((result) => {
            if (result.status === 'ok') {
                let tempProvs = [];
                result.Province.forEach(function(d) {
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
        }) //response

    },
    init() {
        this._super(...arguments);
        this.markets = [];
        this.years = ['2018', '2017', '2016'];
        this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.provRank = ['市场规模(mil)', '市场增长(%)', '销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];
        this.prodRank = ['销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];
        this.trendData = ['销售额(mil)', '销售增长(%)', '份额(%)', '份额增长(%)'];

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
            {
            'province': 'aa',
            'scale': 22,
            'sales': 20,
            'market_growth': -0.03,
            'prod_growth': 0.09,

        }, {
            'province': 'bb',
            'scale': 55,
            'sales': 50,
            'market_growth': 0.09,
            'prod_growth': -0.04,

        }, {
            'province': 'cc',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },  {
            'province': 'dd',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'ee',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'ff',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'gg',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'hh',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },

        {
            'province': 'ii',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'jj',
            'scale': 66,
            'sales': 60,
            'market_growth': 0.09,
            'prod_growth': -0.04,

        },
        {
            'province': 'kk',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'll',
            'scale': 66,
            'sales': 60,
            'market_growth': 0.09,
            'prod_growth': -0.04,

        },        {
            'province': 'mm',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'nn',
            'scale': 66,
            'sales': 60,
            'market_growth': 0.09,
            'prod_growth': -0.04,

        },
        {
            'province': 'oo',
            'scale': 66,
            'sales': 60,
            'market_growth': -0.03,
            'prod_growth': 0.17,

        },
        {
            'province': 'pp',
            'scale': 66,
            'sales': 60,
            'market_growth': 0.09,
            'prod_growth': -0.04,

        },
    ];
        // this.queryMixedGraph();
        // end市场各省份销售概况-混合图

        //  市场各省份销售概况-table
        this.provSalesTitle = {
            // title:'市场各省销售概况',
        }
        this.MarketSales = [
            {
            label: '省份名',
            valuePath: 'province',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
            // breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列
        }, {
            label: '市场大小',
            valuePath: 'market_size',
            classNames: 'tabl',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '市场增长(%)',
            valuePath: 'market_growth',
            align: 'center',
            classNames: 'tabl',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'sales_amount',
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
        this.marketRankingUnit = "";
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
        this.marketTitle = {
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
        this.prodRankingUnit = "";

        // this.queryProductRank();
        //end 各产品排名变化

        //各竞品销售概况-table
        this.competingProd = [{
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            label: '生产商',
            valuePath: 'manufacturer',
            classNames: 'tabl',
            align: 'center',
            sortable: false,
            minResizeWidth: '70px',
            cellClassNames: 'overf',
            // cellCopmonent: 'table-overflow',
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
            this.set('market', params)
        },
        getYear: function(params) {
            this.set('year', params);
        },
        getMonth(params) {
            this.set('month', params);
        },
        getProv(params) {
            this.set('prov', params)
        },
        queryProvRank(params) {
            if (params === '市场规模(mil)') {
                this.set('provRankTag', 'provinceSales')
            } else if (params === '市场增长(%)') {
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
            if (params === '销售额(mil)') {
                this.set('prodRankTag', 'sales')
            } else if (params === '销售增长(%)') {
                this.set('prodRankTag', 'salesGrowth')
            } else if (params === '份额(%)') {
                this.set('prodRankTag', 'share')
            } else if (params === '份额增长(%)') {
                this.set('prodRankTag', 'shareGrowth')
            }
            this.queryProductRank();

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
            this.set('year', $("#select-year").val());
            this.set('month', $("#select-month").val());
            this.set('market', $("#select-market").val());
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
            this.set('prov', $("#select-prov").val());
            this.set('modalprov', false);
            this.queryProdCards();
            this.queryProdTrend();
            this.queryProdMostCards();
            this.queryPerProductShare();
            this.queryProductRank()
            this.queryProductSalesTable()
            this.queryAllProdTrend();
        }

    }
});