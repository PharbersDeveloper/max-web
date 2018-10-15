import {
	computed
} from '@ember/object';
import Controller from '@ember/controller';
import styles from '../styles';
import {
	inject
} from '@ember/service';
import {
	later
} from '@ember/runloop';

import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage'
// import SampleEchartsOption from '../../../components/sample-line-and-bar/getOption';
import $ from 'jquery';
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
	init() {
		this._super(...arguments);
		this.prodSalesLine = [];
		this.querySelectArg();
		this.prodSales = [{
	            label: '序号',
				width:'200px',
	            valuePath: 'index',
	            classNames: 'tabl',
	            align: 'center',
	            sortable: false, //是否可以对列进行排序
	            minResizeWidth: '70px', //列可以调整的最小宽度
	        }, {
	            label: '医院名称',
	            valuePath: 'hospitalName',
	            classNames: 'tabl',
	            align: 'left',
	            sortable: false,
	            minResizeWidth: '70px',
	        }];
	        this.prodSalesValue = [{
				index: '1',
				hospitalName: '临河区中心医院'
			},{
				index: '2',
				hospitalName: '临河区中心医院2'
			}];

	},
	querySelectArg() {
		// let job = this.store.peekAll('phmaxjob').lastObject.job_id;
		// let company = this.store.peekAll('phmaxjob').lastObject.company_id;

		let job_id = localStorage.getItem('job_id');
		let company_id = localStorage.getItem('company_id');

		let req = this.store.createRecord('samplecheckselecter',{
			res: "phselecter",
			company_id: company_id,
			job_id: job_id
		})

		let result = this.store.object2JsonApi('request', req);
		console.log(result);
		console.log("---checkselecter result----")
		this.store.queryObject('/api/v1/samplecheckselecter/0','samplecheckselecter', result ).then((res) => {
			if(res !== "") {
				this.set("markets",res.mkt_list);
				this.set("years",res.ym_list);
				localStorage.setItem('market',res.mkt_list[0]);
				localStorage.setItem('year',res.ym_list[0]);
				this.queryContentData();
			} else {
				this.set('sampleCheckError', true);
				this.set('errorMessage', "error");
			}
		});
	},
	queryContentData() {
		// let company = this.store.peekAll('phmaxjob').lastObject.company_id;
		// let job = this.store.peekAll('phmaxjob').lastObject.job_id;
		// let user = this.store.peekAll('phmaxjob').lastObject.user_id;
		let market = $('select[name="markets"]').val() || localStorage.getItem('market');
		console.log(market);
		let years = $('select[name="years"]').val() || localStorage.getItem('year');
		console.log(years);
		let job_id = localStorage.getItem('job_id');
		let company_id = localStorage.getItem('company_id');
		let user = localStorage.getItem('username');;

		let req = this.store.createRecord('samplecheckbody',{
			res: "samplecheckbody",
			company_id: company_id,
			job_id: job_id,
			ym:years,
			market:market,
			user_id:user
		})

		let result = this.store.object2JsonApi('request', req);
		console.log(result);
		console.log("---checkbody result----")
		this.store.queryObject('/api/v1/samplecheckbody/0','samplecheckbody', result ).then((res) => {
			if(res !== "") {
				console.log(res);
				let hosp_currentNumber = res.hospital.currentNumber;
				let hosp_lastYearNumber = res.hospital.lastYearNumber;
				this.set('hospitalNumber',hosp_currentNumber);
				this.set('lastYearHospitalNumber',hosp_lastYearNumber);
				let pro_currentNumber = res.product.currentNumber;
				let pro_lastYearNumber = res.product.lastYearNumber;
				this.set('productNumber',pro_currentNumber);
				this.set('lastYearProductNumber',pro_lastYearNumber);
				let sale_currentNumber = res.sales.currentNumber;
				let sale_lastYearNumber = res.sales.lastYearNumber;
				this.set('salesNumber',sale_currentNumber);
				this.set('lastYearSalesNumber',sale_lastYearNumber);

				let yms = ["2018 01","2018 02","2018 03","2018 04","2018 05","2018 06","2018 07","2018 08","2018 09","2018 10","2018 11","2018 12",]
				// 医院折线图
				let hosp_baselines = res.hospital.baselines;
				let hosp_samplenumbers = res.hospital.samplenumbers;
				let hosp_data = {
					hosp_baselines,
					hosp_samplenumbers,
					yms
				};
				let hosp_datas = [];
				hosp_data.hosp_baselines.forEach((hosp_baselines,index) => {
					let item = {
						key: hosp_data.yms[index],
						value: hosp_data.hosp_samplenumbers[index],
						value2: hosp_baselines,
					}
					hosp_datas.push(item);
				});
				this.set('hosp_datas',hosp_datas);
				//产品折线图
				let pro_baselines = res.product.baselines;
				let pro_samplenumbers = res.product.samplenumbers;
				let pro_data = {
					pro_baselines,
					pro_samplenumbers,
					yms
				};
				let pro_datas = [];
				pro_data.pro_baselines.forEach((pro_baselines,index) => {
					let item = {
						key: pro_data.yms[index],
						value: pro_data.pro_samplenumbers[index],
						value2: pro_baselines,
					}
					pro_datas.push(item);
				});
				this.set('pro_datas',pro_datas);
				//样本销售额折线图
				let sale_baselines = res.sales.baselines;
				let sale_samplenumbers = res.sales.samplenumbers;
				let sale_data = {
					sale_baselines,
					sale_samplenumbers,
					yms
				};
				let sale_datas = [];
				sale_data.sale_baselines.forEach((sale_baselines,index) => {
					let item = {
						key: sale_data.yms[index],
						value: sale_data.sale_samplenumbers[index],
						value2: sale_baselines,
					}
					sale_datas.push(item);
				});
				this.set('sale_datas',sale_datas);

				let notfindhospital = res.notfindhospital;
				this.set('prodSalesValue',notfindhospital);
			} else {
				this.set('error', true);
				this.set('errorMessage', error.message);
			}

		});

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
			this.transitionToRoute('add-data.uploadfiles')
			// window.location = 'uploadfiles'
		},
		next() {
			this.transitionToRoute('add-data.calcmax')
		}
	}
});
