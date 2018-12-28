import { computed } from '@ember/object';
import Controller from '@ember/controller';
import styles from '../styles';
import { inject as service } from '@ember/service';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';

export default Controller.extend({
	generateSampleRoute: service('add_data.generate_sample_route'),
	generateSampleController: service('add_data.generate_sample_controller'),
	styles,
	markets: '',
	market: '',
	years: '',
	year: '',
	sampleCheckError: false,
	hospitalNumber: 0,
	lastYearHospitalNumber: 0,
	computeHospitalNumber: computed('hospitalNumber', 'lastYearHospitalNumber', function () {
		let number = (this.get('hospitalNumber') - this.get('lastYearHospitalNumber')) / this.get('lastYearHospitalNumber');

		return (parseFloat(number) * 100).toFixed(2);
	}),
	productNumber: 0,
	lastYearProductNumber: 0,
	computeProductNumber: computed('productNumber', 'lastYearProductNumber', function () {
		let number = (this.get('productNumber') - this.get('lastYearProductNumber')) / this.get('lastYearProductNumber');

		return (parseFloat(number) * 100).toFixed(2);
	}),
	salesNumber: 0,
	lastYearSalesNumber: 0,
	computeSalesNumber: computed('salesNumber', 'lastYearSalesNumber', function () {
		let number = (this.get('salesNumber') - this.get('lastYearSalesNumber')) / this.get('lastYearSalesNumber');

		return (parseFloat(number) * 100).toFixed(2);
	}),
	init() {
		this._super(...arguments);
		this.querySelectArg();
		this.prodSales = [{
			label: '序号',
			width: '200px',
			valuePath: 'index',
			classNames: 'tabl',
			align: 'center',
			sortable: false, //是否可以对列进行排序
			minResizeWidth: '70px' //列可以调整的最小宽度
		}, {
			label: '医院名称',
			valuePath: 'hospitalName',
			classNames: 'tabl',
			align: 'left',
			sortable: false,
			minResizeWidth: '70px'
		}];
		this.set('prodSalesValue', []);
	},
	querySelectArg() {
		let jobId = localStorage.getItem('job_id'),
			companyId = localStorage.getItem('company_id'),
			req = this.get('generateSampleController').createModel('SampleCheckSelecter', {
				id: this.get('hash').uuid(),
				res: 'phselecter',
				'company_id': companyId,
				'job_id': jobId
			}),
			result = this.get('generateSampleRoute').object2JsonApi(req);

		this.get('generateSampleRoute').queryObject('api/v1/samplecheckselecter/0', 'SampleCheckSelecter', result)
			.then((res) => {
				if (res !== '') {
					this.set('markets', res.mkt_list);
					this.set('years', res.ym_list);
					this.set('market', res.mkt_list[0]);
					this.set('year', res.ym_list[0]);
					localStorage.setItem('market', res.mkt_list[0]);
					localStorage.setItem('year', res.ym_list[0]);
					this.queryContentData();
				} else {
					this.set('sampleCheckError', true);
					this.set('errorMessage', 'error');
				}
			});
	},
	queryContentData() {
		let market = this.get('market') || localStorage.getItem('market'),
			year = this.get('year') || localStorage.getItem('year'),
			jobId = localStorage.getItem('job_id'),
			companyId = localStorage.getItem('company_id'),
			user = localStorage.getItem('username'),

			req = this.get('generateSampleController').createModel('SampleCheckBody', {
				id: this.get('hash').uuid(),
				'company_id': companyId,
				'job_id': jobId,
				ym: year,
				market: market,
				'user_id': user
			}),
			result = this.get('generateSampleRoute').object2JsonApi(req);

		this.get('generateSampleRoute').transaction('api/v1/samplecheckbody/0', 'SampleCheckBody', result)
			.then((res) => {
				if (res !== '') {
					let yms = ['2018 01', '2018 02', '2018 03', '2018 04', '2018 05', '2018 06', '2018 07', '2018 08', '2018 09', '2018 10', '2018 11', '2018 12'],
						hospData = {
							hospBaselines: res.hospital.baselines,
							hospSamplenumbers: res.hospital.samplenumbers,
							yms
						},
						hospDatas = [],
						proData = {
							proBaselines: res.product.baselines,
							proSamplenumbers: res.product.samplenumbers,
							yms
						},
						proDatas = [],
						saleData = {
							saleBaselines: res.sales.baselines,
							saleSamplenumbers: res.sales.samplenumbers,
							yms
						},
						saleDatas = [];

					this.set('hospitalNumber', res.hospital.currentNumber);
					this.set('lastYearHospitalNumber', res.hospital.lastYearNumber);
					this.set('productNumber', res.product.currentNumber);
					this.set('lastYearProductNumber', res.product.lastYearNumber);
					this.set('salesNumber', res.sales.currentNumber);
					this.set('lastYearSalesNumber', res.sales.lastYearNumber);

					hospData.hospBaselines.forEach((ele, index) => {
						let item = {
							key: hospData.yms[index],
							value: hospData.hospSamplenumbers[index],
							value2: ele
						};

						hospDatas.push(item);
					});
					this.set('hosp_datas', hospDatas);
					//产品折线图
					proData.proBaselines.forEach((ele, index) => {
						let item = {
							key: proData.yms[index],
							value: proData.proSamplenumbers[index],
							value2: ele
						};

						proDatas.push(item);
					});
					this.set('pro_datas', proDatas);
					//样本销售额折线图


					saleData.saleBaselines.forEach((ele, index) => {
						let item = {
							key: saleData.yms[index],
							value: saleData.saleSamplenumbers[index],
							value2: ele
						};

						saleDatas.push(item);
					});
					this.set('sale_datas', saleDatas);

					this.set('prodSalesValue', res.notfindhospital);
				} else {
					this.set('error', true);
					// this.set('errorMessage', error.message); //没搞懂error从哪里来的
				}
			});

	},

	actions: {
		// queryAll() {
		// 	this.queryContentData();
		// },
		uploadFileAgain(modal) {
			modal.close();
			SampleObject.set('isShowProgress', false);
			SampleObject.set('fileParsingSuccess', false);
			SampleObject.set('calcYearsProgress', false);
			SampleObject.set('calcPanelProgress', false);
			this.transitionToRoute('add-data.uploadfiles');
		},
		next() {
			this.transitionToRoute('add-data.calcmax');
		},
		changeMarket(value) {
			let market = this.get('market');

			if (value !== market) {
				this.set('market', value);
				this.queryContentData();
			}

		},
		changeMonth(value) {
			let year = this.get('year');

			if (value !== year) {
				this.set('year', value);
				this.queryContentData();
			}


		}
	}
});
