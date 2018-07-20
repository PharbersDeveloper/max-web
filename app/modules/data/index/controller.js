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
    activeCi: true,
    fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
    year: '2017',
    month: '03',
    time: computed('year', 'month', function() {
        // body
        let year = this.get('year');
        let month = this.get('month');
        return year + '-' + month;
    }),
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
     *	查询产品销售概况
     *
     */
    queryProdOV() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time')
            }
        }
        this.get('ajax').request('/api/dashboard/saleData', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询产品销售概况')
                    // console.log(result.tableSale);
                    this.set('prodSalesTitle', result.tableSale.prodSalesOverview);
                    this.set('prodSalesLine', result.tableSale.prodSalesTable)
                }
            })
    },
    /**
     *	查询卡片数据
     *
     */
    queryCards() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time')
            }
        }
        this.get('ajax').request('api/dashboard/keyWord', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询卡片数据')
                    // console.log(result)
                    this.set('cards', result.cards)
                }
            })
    },
    /**
     *	查询各产品销售概况
     *
     */
    queryProdSales() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time')
            }
        }
        this.get('ajax').request('api/dashboard/overView', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('查询各产品销售概况:')
                    // console.log(result);
                    this.set('titleInfo', result.overView.prodSalesOverview);
                    this.set('prodSalesValue', result.overView.prodSalesValue);
                }
            })
    },
    /**
     *	查询各产品销售贡献度
     *
     */
    queryProdCont() {
        let condition = {
            "condition": {
                "user_id": this.get('cookies').read('uid'),
                "time": this.get('time')
            }
        }
        this.get('ajax').request('api/dashboard/contribution', this.getAjaxOpt(condition))
            .then(({
                status,
                result,
                error
            }) => {
                if (status === 'ok') {
                    // console.log('ooooo查询各产品销售贡献度：')
                    // console.log(result);
                    this.set('prodContValue', result.tableSale.prodContValue)
                    this.set('pieValue', result.tableSale.pie);
                    this.set('contTitle', result.tableSale.prodSalesOverview)
                }
            })
    },
    init() {
        this._super(...arguments);
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
        this.prodSalesValue = [];
        this.queryProdSales();

		/**
		* 产品贡献度 pie and table
		*/
        this.contTitle = {};
		this.prodContValue = [];
		this.pieValue = [];

		this.queryProdCont();

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
            this.set('modal3', false);
            this.queryProdOV();
            this.queryCards();
            this.queryProdSales();
            this.queryProdCont();
        },
    }
});
