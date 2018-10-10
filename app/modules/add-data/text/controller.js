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
    },
    /**
     *	查询各产品销售贡献度
     *
     */

    init() {
        this._super(...arguments);
        // this.prodSalesTitle = {};
        this.prodSalesLine = [];
    },
    actions: {
        submit() {

            this.queryProdSales();
        },
    }
});
