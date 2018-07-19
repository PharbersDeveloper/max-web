import Controller from '@ember/controller';
import {inject} from '@ember/service';
export default Controller.extend({
    ajax: inject(),
    cookies: inject(),
    activeCi: true,
    time: '2017-03',
    market:'麻醉市场',
    tag: "provinceSales",
    rankingMax: 0,
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
        // console.log(this.get('market'))
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
                // console.log('查询产品cards(in province)：')
                if (status === 'ok') {
                    // console.log('查询产品cards(in province)：')
                    // console.log(result);
                    this.set('cards', result.provinceWord);
                } else {
                    console.log('errrrror')
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
                    this.set('competingTitle',result.proTableOverview)
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
                    // console.log('查询各产品份额(in pro)：')
                    // console.log(result);
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
                "tag": this.get('tag')
            }
        }
        this.get('ajax').request('api/dashboard/province/provLevelRank', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    console.log('查询各产品排名变化(in pro)：')
                    console.log(result);
                    this.set('unit',result.unit);
                    this.set('ranking', result.ranking);
                    this.computedRankingMax();
                }
            })
    },
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

    init() {
        this._super(...arguments);
        //  市场规模卡片数据
        this.cards = [];
        this.queryMarketProdCards();
        //  end 市场规模卡片数据

        //  市场各省份销售概况-混合图
        // end市场各省份销售概况-混合图

        //  市场各省份销售概况-table
        this.MarketSales = [
            {
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
        },{
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
        this.ranking = [];
        this.rankingRange = [];
        this.queryMarketRank();
        //  end 市场省份层面排行


        // this.ranking = [{
        //     no: 1,
        //     prod: "prod2",
        //     manu: "生产商2",
        //     growth: 4,
        //     value: 38
        // }, {
        //     no: 1,
        //     prod: "prod2",
        //     manu: "生产商2",
        //     growth: 4,
        //     value: 24
        // }];
        // this.rankingRange = [];
        this.computedRankingMax();
        this.markets = ['河北省', '河南省'];
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
        this.sales = [{
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
        this.titleInfo = {
            title: '各产品销售概况',
            time: '2018-04',
            city: ''
        };


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
            valuePath: 'sales',
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
        this.competingProdValue = [{
            'prod': 'aaa',
            'manufacturer': "a'a'a'",
            "sales": 33,
            "sales_growth": 33,
            "ev_value": 3,
            "share": 0,
            "share_growth": 3,
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
        this.marketProd = [{
                "date": "2017-01",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-02",
                "marketSales": 26,
                "prodSales": 15,
                "share": 25
            }, {
                "date": "2017-03",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-04",
                "marketSales": 26,
                "prodSales": 15,
                "share": 25
            },
            {
                "date": "2017-05",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-06",
                "marketSales": 26,
                "prodSales": 15,
                "share": 25
            }, {
                "date": "2017-07",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-08",
                "marketSales": 26,
                "prodSales": 15,
                "share": 25
            }, {
                "date": "2017-09",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-10",
                "marketSales": 26,
                "prodSales": 15,
                "share": 28
            }, {
                "date": "2017-11",
                "marketSales": 27,
                "prodSales": 15,
                "share": 20
            }, {
                "date": "2017-12",
                "marketSales": 26,
                "prodSales": 15,
                "share": 25
            },
        ];
    },

});
