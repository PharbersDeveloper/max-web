import { computed } from '@ember/object';
import Controller from '@ember/controller';
import styles from '../styles';
import { inject } from '@ember/service';
import { later } from '@ember/runloop';

import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage'
import SampleEchartsOption from '../../../components/sample-line-and-bar/getOption';

export default Controller.extend({
    ajax: inject(),
    cookies: inject(),
    styles,
    sampleCheckError: false,
    hospitalNumber: 0,
    lastYearHospitalNumber: 0,
    computeHospitalNumber: computed('hospitalNumber', 'lastYearHospitalNumber', function() {
        let number = (this.get('hospitalNumber') - this.get('lastYearHospitalNumber')) / this.get('lastYearHospitalNumber');
        return (parseFloat(number) * 100).toFixed(2);
    }),
    productNumber: 0,
    lastYearProductNumber: 0,
    computeProductNumber: computed('productNumber', 'lastYearProductNumber', function() {
        let number = (this.get('productNumber') - this.get('lastYearProductNumber')) / this.get('lastYearProductNumber');
        return (parseFloat(number) * 100).toFixed(2);
    }),
    salesNumber: 0,
    lastYearSalesNumber: 0,
    computeSalesNumber: computed('salesNumber', 'lastYearSalesNumber', function() {
        let number = (this.get('salesNumber') - this.get('lastYearSalesNumber')) / this.get('lastYearSalesNumber');
        return (parseFloat(number) * 100).toFixed(2);
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
    querySelectArg() {
        let condition = {
            condition: {
                job_id: this.get('cookies').read('job_id')
            }
        }

        this.get('ajax').request('/api/search/check/simple/select', this.getAjaxOpt(condition)).then(({result, error, status}, reject) => {
            if (status === 'ok') {
                this.set('markets', result.markets);
                this.set('years', result.years);
                later(this, () => {
                    this.queryContentData();
                }, 1000)
            } else {
                this.set('sampleCheckError', true);
                this.set('errorMessage', error.message);
            }
        });
    },
    queryContentData() {
        let market = $('select[name="markets"] :selected').val() || '';
        this.set('selectedMarket', market)
        let years = $('select[name="years"] :selected').val() || '';
        let condition = {
            condition: {
                job_id: this.get('cookies').read('job_id'),
                market: market,
                years: years
            }
        }
        this.get('ajax').request('/api/search/check/simple', this.getAjaxOpt(condition)).then(({result, error, status}, reject) => {
            if (status === 'ok') {
                let getHospital= SampleEchartsOption.create()
                let getProduct= SampleEchartsOption.create()
                let getSales= SampleEchartsOption.create()
                this.set('hospitalOption', getHospital.getOption(result.hospital))
                this.set('productOption', getProduct.getOption(result.product))
                this.set('salesOption', getSales.getOption(result.sales))
                this.set('hospitalNumber', result.hospital.currentNumber)
                this.set('lastYearHospitalNumber', result.hospital.lastYearNumber)

                this.set('productNumber', result.product.currentNumber)
                this.set('lastYearProductNumber', result.product.lastYearNumber)

                this.set('salesNumber', result.sales.currentNumber)
                this.set('lastYearSalesNumber', result.sales.lastYearNumber)

                this.set('model', result.notfindhospital);
            } else {
                this.set('error', true);
                this.set('errorMessage', error.message);
            }
        });
    },
    init() {
        this._super(...arguments);
        this.set('columns', [
            // { propertyName: 'index', 'className':'text-center', title: '序号', useSorting: false },
            { propertyName: 'index', 'className': 'text-center', useSorting: false },
            { propertyName: 'hospitalName', 'className': 'text-center', useSorting: false },
            { propertyName: 'province', 'className': 'text-center', useSorting: false },
            { propertyName: 'city', 'className': 'text-center', useSorting: false },
            { propertyName: 'cityLevel', 'className': 'text-center', useSorting: false }
        ]);
        this.querySelectArg();

    },
    actions: {
        queryAll() {
            this.queryContentData()
        },
        uploadFileAgain(modal) {
            modal.close()
            SampleObject.set('isShowProgress', false);
            SampleObject.set('fileParsingSuccess', false);
            SampleObject.set('calcYearsProgress', false);
            SampleObject.set('calcPanelProgress', false);
            this.transitionToRoute('adddata.uploadfiles')
            // window.location = 'uploadfiles'
        }
    }
});
