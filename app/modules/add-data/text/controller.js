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
