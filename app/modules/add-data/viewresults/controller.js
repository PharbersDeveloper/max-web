import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import $ from 'jquery';

import { inject as service } from '@ember/service';

export default Controller.extend({
	viewresults_route: service('add_data.viewresults_route'),
	viewresults_controller: service('add_data.viewresults_route'),
	ajax: inject(),
    cookies: inject(),
    markets: "",
    market: "",
    years: "",
    year: "",
    isSave: false,
    saveState: false,
    allMonths: false,
    chooseTrueNums: 0,
    selectedArea: 0,
    marketSumSales: 0,
    marketSumSalesPercentage: 0,
    productSumSales: 0,
    productSumSalesPercentage: 0,
    computeShare: computed('marketSumSales', 'productSumSales', function () {
        let psales = parseFloat(this.get('productSumSales'))
        let msales = parseFloat(this.get('marketSumSales'))
        return ((psales / msales) * 100).toFixed(2);
    }),
    init() {
        this._super(...arguments);
        this.querySelectArg();
    },

    querySelectArg() {
        let company_id = localStorage.getItem('company_id');
        let job_id = localStorage.getItem('job_id');

        let req = this.get('viewresults_controller').createModel('SampleCheckSelecter', {
            res: "phselecter",
            company_id: company_id,
            job_id: job_id
        })
        let result = this.store.object2JsonApi('request', req);
        this.store.queryObject('/api/v1/samplecheckselecter/0', 'SampleCheckSelecter', result).then((res) => {
            if (res !== "") {
                this.set("markets", res.mkt_list);
                this.set("years", res.ym_list); // 下拉窗数据
                this.set('market', res.mkt_list[0]);
                this.set('year', res.ym_list[0]);
                console.log(this.get("year"));
                this.queryContentData(res.mkt_list[0], res.ym_list[0]);
            } else {
                this.set('sampleCheckError', true);
                this.set('errorMessage', "error");
            }
        });
    },

    queryContentData(market, year) {
        this.set('selectedMarket', market);

        let company_id = localStorage.getItem('company_id');
        let job_id = localStorage.getItem('job_id');
        let user_id = localStorage.getItem('user_id');

        let req = this.store.createRecord('ResultCheck', {
            res: "resultCheck",
            user_id: user_id,
            job_id: job_id,
            company_id: company_id,
            ym: year,
            market: market
        })
        let result = this.store.object2JsonApi('request', req);
        this.store.queryObject('api/v1/resultcheck/0', 'ResultCheck', result).then((res) => {
            if (res !== "") {
                let market_current = res.indicators.marketSumSales.currentNumber;
                let market_percentage = res.indicators.marketSumSales.lastYearPercentage;
                let product_current = res.indicators.productSales.currentNumber;
                let product_percentage = res.indicators.productSales.lastYearPercentage;
                this.set('marketSumSales', market_current);
                this.set('marketSumSalesPercentage', market_percentage.toFixed(2));
                this.set('productSumSales', product_current);
                this.set('productSumSalesPercentage', product_percentage.toFixed(2));

                // console.log(res.trend);
                let trend = res.trend;
                this.set('trend', trend);
                //折线图数据

                let regionList = res.region;
                let noValueList = [];
                let valueList = [];
                let listValue = regionList.map(function (i) {
                    if (i.value = 0) {
                        let noValue = i.name;
                        noValueList.push(noValue);
                    } else {
                        let values = i.name;
                        valueList.push(values);
                    }
                })
                this.set("noValueList", noValueList);
                this.set("valueList", valueList);
                // 地图数据

                let mirrorProvincesCurrent = res.mirror.provinces.current;
                let mirrorProvincesLast = res.mirror.provinces.lastyear;
                let mirrorProvinces = {
                    mirrorProvincesCurrent,
                    mirrorProvincesLast
                }
                let current = [];
                mirrorProvinces.mirrorProvincesCurrent.forEach((mirrorProvincesCurrent, index) => {
                    let item = {
                        key: index + 1,
                        marketSales: mirrorProvincesCurrent.marketSales,
                        area: "",
                    }
                    current.push(item);
                })
                this.set('current', current);
                console.log(current);

                let lastYear = [];
                mirrorProvinces.mirrorProvincesLast.forEach((mirrorProvincesLast, index) => {
                    let item = {
                        key: index + 1,
                        marketSales: -mirrorProvincesLast.marketSales,
                        areaLast: mirrorProvincesLast.area,
                        area: mirrorProvinces.mirrorProvincesCurrent[index].area,
                    }
                    lastYear.push(item);
                })
                lastYear.forEach((a) => {
                    lastYear.forEach((b) => {
                        if (a.area === b.areaLast) {
                            a.keyLast = b.key;
                        }
                    })
                })
                this.set('lastYear', lastYear);
                console.log(lastYear);

                let mirrorCityCurrent = res.mirror.city.current;
                let mirrorCityLast = res.mirror.city.lastyear;
                let mirrorCity = {
                    mirrorCityCurrent,
                    mirrorCityLast
                }
                let currentCity = [];
                mirrorCity.mirrorCityCurrent.forEach((mirrorCityCurrent, index) => {
                    let item = {
                        key: index + 1,
                        marketSales: mirrorCityCurrent.marketSales,
                        area: "",
                    }
                    currentCity.push(item);
                })
                this.set('currentCity', currentCity);
                console.log(currentCity)

                let lastYearCity = [];
                mirrorCity.mirrorCityLast.forEach((mirrorCityLast, index) => {
                    let item = {
                        key: index + 1,
                        marketSales: -mirrorCityLast.marketSales,
                        areaLast: mirrorCityLast.area,
                        area: mirrorCity.mirrorCityCurrent[index].area,
                    }
                    lastYearCity.push(item);
                })
                lastYearCity.forEach((a) => {
                    lastYearCity.forEach((b) => {
                        if (a.area === b.areaLast) {
                            a.keyLast = b.key;
                        }
                    })
                })
                this.set('lastYearCity', lastYearCity);
                console.log(lastYearCity)
            } else {
                this.set('sampleCheckError', true);
                this.set('errorMessage', "error");
            }
        });
    },
    actions: {
        queryAll(mAndY) {
            this.queryContentData(mAndY.market, mAndY.year);
        },
        exportFiles() {
            let company_id = localStorage.getItem('company_id');
            let job_id = localStorage.getItem('job_id');
            let market = this.get("market") || localStorage.getItem('market');
            console.log("this is export");
            let ym = this.get("year") || localStorage.getItem('year');
            console.log(this.get("market"));
            console.log(this.get("year"));

            let req = this.store.createRecord('exportmaxresult', {
                res: "export",
                company_id: company_id,
                job_id: job_id,
                market: market,
                ym: ym
            })
            let result = this.store.object2JsonApi('request', req);
            this.store.queryObject('/api/v1/exportmaxresult/0', 'exportmaxresult', result).then((res) => {
                if (res.result_path != '') {
                    let resultPath = res.result_path;
                    var url = '/download/' + resultPath;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);        // 也可以使用POST方式，根据接口
                    xhr.responseType = "blob";    // 返回类型blob
                    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                    xhr.onload = function (res) {
                        // 请求完成
                        if (this.status === 200) {
                            // 返回200
                            var a = document.createElement('a');
                            a.download = resultPath;
                            a.href = res.currentTarget.responseURL;
                            $("body").append(a);    // 修复firefox中无法触发click
                            a.click();
                            $(a).remove();

                        }
                    };
                    xhr.send()
                }
            });
        }
    }
});
