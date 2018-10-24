import Controller from '@ember/controller';
import {
    inject
} from '@ember/service';
import {
    computed
} from '@ember/object';
import $ from 'jquery';
export default Controller.extend({
    cookies: inject(),
    fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
    year: '2017',
    month: '01',
    time: computed('year', 'month', function() {
        // body
        let year = this.get('year');
        let month = this.get('month');
        return year + '-' + month;
    }),
    // time : this.get('time'),
    userId : localStorage.getItem('userid'),
    companyId : localStorage.getItem('company_id'),


    /**
     *	查询产品销售额
     *
     */
    queryProdOV() {
        // let condition = {
        //     "condition": {
        //         "company_id": localStorage.getItem('company_id'),
        //         "time": this.get('time')
        //     }
        // }
        // console.log(condition)
        // this.get('ajax').request('/api/dashboard/saleData', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             this.set('prodSalesTitle', result.tableSale.prodSalesOverview);
        //             this.set('prodSalesLine', result.tableSale.prodSalesTable)
        //         }
        //     })

        // let company_id = localStorage.getItem('company_id');
        // let time = this.get('time');

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
            if (result.ProdSalesTable.length == 0) {
            } else {
                this.set('prodSalesLine', result.ProdSalesTable);
            }
        }) //response
    },
    /**
     *	查询卡片数据
     *
     */
    queryCards() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time')
        //     }
        // }
        // console.log(this.get('time'))
        // this.get('ajax').request('api/dashboard/keyWord', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log('查询卡片数据')
        //             // console.log(result)
        //             this.set('cards', result.cards)
        //         }
        //     })

        // 获取参数
        // let company_id = localStorage.getItem('company_id');
        // let time = this.get('time');
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
        // console.log(result);
         //request
        this.store.queryObject('/api/v1/dashboard/keyWord', 'cards', result).then((result) => {
            //response
            // console.log(result.Card);
            this.set('cards', result.Card)
        }) 
    },
    /**
     *	查询各产品销售概况
     *
     */
    queryProdSales() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/overView', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log('查询各产品销售概况:')
        //             // console.log(result);
        //             this.set('titleInfo', result.overView.prodSalesOverview);
        //             this.set('prodSalesValue', result.overView.prodSalesValue);
        //         }
        //     })

        // 获取参数
        // let company_id = localStorage.getItem('company_id');
        // let time = this.get('time');
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
            if(result.ProdSalesValue.length == 0){
            }else{
                this.set('prodSalesValue', result.ProdSalesValue);
            }

        }) 
    },
    /**
     *	查询各产品销售贡献度
     *
     */
    queryProdCont() {
        // let condition = {
        //     "condition": {
        //         "user_id": this.get('cookies').read('uid'),
        //         "time": this.get('time')
        //     }
        // }
        // this.get('ajax').request('api/dashboard/contribution', this.getAjaxOpt(condition))
        //     .then(({ status, result, error }) => {
        //         if (status === 'ok') {
        //             // console.log('ooooo查询各产品销售贡献度：')
        //             // console.log(result);
        //             this.set('prodContValue', result.tableSale.prodContValue)
        //             this.set('pieValue', result.tableSale.pie);
        //             this.set('contTitle', result.tableSale.prodSalesOverview)
        //         }
        //     })

        // 获取参数
        // let company_id = localStorage.getItem('company_id');
        // let time = this.get('time');
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
        // console.log(result);
         //request
        this.store.queryObject('/api/v1/dashboard/contribution', 'contribution', result).then((result) => {
            this.set('contTitle', result.ProdSalesOverview)
            //response
            if(result.ProdContValue.length == 0){
            }else{
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
        this.prodSalesTitle = {
            // title: '辉瑞产品销售额',
            // timeStart: '2018-01',
            // timeOver: '2018-08',
            // currentMonth: '2018-04',
            // curMoSales: 9935.4,
            // yearYear: 4.3,
            // ring: 4.3,
            // totle: 146534563,
            // ave: 34572452,
        };
        this.prodSalesLine = [
        //     {
		// 	ym: '2018-01',
		// 	sales: 400
		// }, {
		// 	ym: '2018-02',
		// 	sales: 700
		// }, {
		// 	ym: '2018-03',
		// 	sales: 500
		// }, {
		// 	ym: '2018-04',
		// 	sales: 500
		// }, {
		// 	ym: '2018-05',
		// 	sales: 700
		// }, {
		// 	ym: '2018-06',
		// 	sales: 500
		// }, {
		// 	ym: '2018-07',
		// 	sales: 800
		// }, {
		// 	ym: '2018-08',
		// 	sales: 0
		// }, {
		// 	ym: '2018-09',
		// 	sales: 0
		// }, {
		// 	ym: '2018-10',
		// 	sales: 0
		// }, {
		// 	ym: '2018-11',
		// 	sales: 0
		// }, {
		// 	ym: '2018-12',
		// 	sales: 0
        // }
    ];
        this.queryProdOV();
        /**
         * card
         */
        this.cards = [
        //     {
        //     title: "title",
        //     subtitle: "subtitle",
        //     name: "市场名称",
        //     subname: 'subname',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '5.6'
        // }, {
        //     title: "产品下滑",
        //     subtitle: "2018-04",
        //     name: "商品名称",
        //     subname: '市场名',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '-56.6'
        // }, {
        //     title: "产品下滑",
        //     subtitle: "2018-04",
        //     name: "商品名称",
        //     subname: '市场名',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '-56.6'
        // },{
        //     title: "title",
        //     subtitle: "subtitle",
        //     name: "市场名称",
        //     subname: 'subname',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '5.6'
        // }, {
        //     title: "产品下滑",
        //     subtitle: "2018-04",
        //     name: "商品名称",
        //     subname: '市场名',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '56.6'
        // }, {
        //     title: "产品下滑",
        //     subtitle: "2018-04",
        //     name: "商品名称",
        //     subname: '市场名',
        //     tag: "mil",
        //     value: '94.83',
        //     percent: '56.6'
        // }
    ];
        this.queryCards();
        /**
         * 产品销售概况table
         */
        this.titleInfo = {
            // title: '各产品销售概况',
            // subtitle: '2018-01',
        };
        this.prodSales = [{
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            label: '市场名',
            valuePath: 'market',
            classNames: 'tabl',
            align: 'center',
            sortable: false,
            minResizeWidth: '70px',
        }, {
            label: '市场规模',
            valuePath: 'market_scale',
            align: 'center',
            classNames: 'tabl',
            minResizeWidth: '70px',
        }, {
            label: '市场增长',
            valuePath: 'market_growth',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售额',
            valuePath: 'sales',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '销售增长',
            valuePath: 'sales_growth',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: 'EV值',
            valuePath: 'ev_value',
            align: 'center',
            minResizeWidth: '50px',
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
        this.prodSalesValue = [
            // {
            //     'prod': '产品二',
            //     'market': 'aaaa',
            //     'market_scale': 4564,
            //     'market_growth': 135,
            //     'sales': 87345,
            //     'sales_growth': 68,
            //     'ev_value': 468,
            //     'share': 78,
            //     'share_growth': 41,
        
            // }, {
            //     'prod': '产品三',
            //     'market': 'aaaa',
            //     'market_scale': 4564,
            //     'market_growth': 647,
            //     'sales': 56,
            //     'sales_growth': 786,
            //     'ev_value': 563,
            //     'share': 536,
            //     'share_growth': 786,
            // }
        ];
        this.queryProdSales();

        /**
         * 产品贡献度 pie and table
         */
        this.contTitle = {
            // title: '各产品销售概况',
            // subtitle: '2018-01',
        };
        this.prodContValue = [
        //     {
		// 	'prod': '产品一',
		// 	'market': 123456,
		// 	'sales': 12,
		// 	'cont': 45175,
		// 	'cont-month': 16,
		// 	'cont-season': 100,
		// 	'cont-year': 45,
		// }, {
		// 	'prod': '产品二',
		// 	'market': 54387,
		// 	'sales': 135,
		// 	'cont': 87345,
		// 	'cont-month': 68,
		// 	'cont-season': 468,
		// 	'cont-year': 78,
		// }, {
		// 	'prod': '产品三',
		// 	'market': 8321,
		// 	'sales': 647,
		// 	'cont': 56,
		// 	'cont-month': 786,
		// 	'cont-season': 563,
		// 	'cont-year': 536,
		// }, {
		// 	'prod': '产品四',
		// 	'market': 67456,
		// 	'sales': 13422,
		// 	'cont': 452,
		// 	'cont-month': 42,
		// 	'cont-season': 45,
		// 	'cont-year': 656,
		// }, {
		// 	'prod': '产品5',
		// 	'market': 67456,
		// 	'sales': 13422,
		// 	'cont': 452,
		// 	'cont-month': 42,
		// 	'cont-season': 45,
		// 	'cont-year': 656,
		// }, {
		// 	'prod': '产品6',
		// 	'market': 67456,
		// 	'sales': 13422,
		// 	'cont': 452,
		// 	'cont-month': 42,
		// 	'cont-season': 45,
		// 	'cont-year': 656,
		// }, {
		// 	'prod': '产品7',
		// 	'market': 67456,
		// 	'sales': 13422,
		// 	'cont': 452,
		// 	'cont-month': 42,
		// 	'cont-season': 45,
		// 	'cont-year': 656,
		// }, {
		// 	'prod': '产品8',
		// 	'market': 67456,
		// 	'sales': 13422,
		// 	'cont': 452,
		// 	'cont-month': 42,
		// 	'cont-season': 45,
		// 	'cont-year': 656,
		// }, {
		// 	'prod': '产品9',
		// 	'market': 356,
		// 	'sales': 34,
		// 	'cont': 75,
		// 	'cont-month': 12,
		// 	'cont-season': 46,
		// 	'cont-year': 54,
        // }, 
        ];
        this.pieValue = [
        //     {
		// 	'title': '产品一',
		// 	'show_value': 10,
		// 	'share': 848,
		// 	'color': '#3399FF',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'848',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'10',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品二',
		// 	'show_value': 8,
		// 	'share': 845,
		// 	'color': 'orange',
		// 	'tips':  [{
        //         key:'销售额:',
        //         value:'845',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'8',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品三',
		// 	'show_value': 2,
		// 	'share': 256,
		// 	'color': 'lightyellow',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'256',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'2',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品四',
		// 	'show_value': 18,
		// 	'share': 452,
		// 	'color': 'lightgreen',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'452',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'18',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品5',
		// 	'show_value': 2,
		// 	'share': 411,
		// 	'color': 'blue',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'411',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'2',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品6',
		// 	'show_value': 7,
		// 	'share': 421,
		// 	'color': 'lightblue',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'421',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'7',
        //         unit:'',
        //     },],
		// }, {
		// 	'title': '产品7',
		// 	'show_value': 10,
		// 	'share': 444,
		// 	'color': 'pink',
		// 	'tips': [{
        //         key:'销售额:',
        //         value:'444',
        //         unit:'',
        //     },
        //     {
        //         key:'贡献度:',
        //         value:'10',
        //         unit:'',
        //     },],
        // }, 
    ];
        this.prodCont = [
            {
            label: '商品名',
            valuePath: 'prod',
            classNames: 'tabl',
            align: 'center',
            sortable: false, //是否可以对列进行排序
            minResizeWidth: '70px', //列可以调整的最小宽度
        }, {
            label: '市场名',
            valuePath: 'market',
            classNames: 'tabl',
            align: 'center',
            sortable: false,
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
            valuePath: 'cont_month',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '贡献度变化 - 三个月(%)',
            valuePath: 'cont_season',
            align: 'center',
            minResizeWidth: '70px',
        }, {
            label: '贡献度变化 - 去年同期(%)',
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
        getYear: function(params) {
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