import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import styles from './styles';
import { later } from '@ember/runloop';
const { keys } = Object;
import $ from 'jquery';

export default Controller.extend({
    data_center_route: service(),
    data_center_controller: service(),
    i18n: service(),
    ajax: service(),
    styles,
    output: false,
    currentPage: 1,
    fullName: '', // 这应该后端返回firstName与lastName 有前端计算出来
    account: '',
    outputTypeValue: '',
    market: 'INF',
    markets: ["麻醉市场", "INF"],

    init() {
        this._super(...arguments);
        this.startDate = new Date('2018-01');
        this.endDate = new Date();
        this.outputStartData = new Date('2018-01');
        this.outputEndData = new Date();
        this.outputType = [];
    },

    formatDateyyyymm(date) {
        return date.getFullYear() + "" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    },

    queryData(parameters) {
        this.set('loading', true);
        this.get('data_center_route').queryMultipleObject('data-center', parameters).
            then((resolve) => {
                this.set('loading', false);
                this.set('model', resolve);
            }, () => {
                this.set('loading', false);
                this.set('model', null);
                this.set('error', true);
                this.set('errorMessage', '查询超时，请重新查询！');
            })
    },

    actions: {
        search() {
            let market = this.get("market");
            let startTime = this.formatDateyyyymm(this.get('startDate'))
            let endTime = this.formatDateyyyymm(this.get('endDate'))
            this.queryData({
                condition: {
                    user_id: this.get('cookie').read('uid'),
                    market: market,
                    startTime: startTime,
                    endTime: endTime,
                    currentPage: 1,
                    pageSize: 10,
                    mode: 'search'
                }
            })
        },

        addData() {
			this.set('chooseAddData', true);
        },

		originalFile() {
			this.transitionToRoute('add-data.uploadfiles');
        },

		panelFile() {
			this.transitionToRoute('add-data.uploadfiles-panel');
        },

        doPageSearch(currentPage, pn) {
			this.set('currentPage', currentPage)
			this.set('modalTablePageObj', pn);
			typeof this.get('modalTablePageObj') === 'undefined' ?
				'' : this.get('modalTablePageObj').gotoCustomPage(currentPage)

			let market = this.get("market");
			let startTime = this.formatDateyyyymm(this.get('startDate'))
			let endTime = this.formatDateyyyymm(this.get('endDate'))
			this.queryData({
				condition: {
					user_id: this.get('cookies').read('uid'),
					market: market,
					startTime: startTime,
					endTime: endTime,
					currentPage: currentPage,
					pageSize: 10,
					mode: 'page'
				}
			})
        },

        outputFile() {
			this.set('output', false);
			let type = this.get('outputTypeValue')
			this.set('loading', true);
			if (type === "Max格式" || type === "") {
				this.exportMax();
			} else {
				this.exportOther();
			}
		},

		outputData() {
			// this.queryOutputType();
        },

        changeStartMonth(date) {
			let end_date = this.get('endDate');
			this.set('startDate', date);
			if (date.getFullYear() > end_date.getFullYear()) {
				this.set('endDate', date)
			} else if (date.getFullYear() === end_date.getFullYear()) {
				if (date.getMonth() > end_date.getMonth()) {
					this.set('endDate', date)
				}
			}
			$('input[name="endDate"]').focus(); // 畸形code
		},

		changeEndMonth(date) {
			let start_date = this.get('startDate');
			this.set('endDate', date);
			if (date.getFullYear() === start_date.getFullYear()) {
				if (date.getMonth() < start_date.getMonth()) {
					this.set('startDate', date)
				}
			} else if (date.getFullYear() < start_date.getFullYear()) {
				this.set('startDate', date)
			}
        },

        changeOutputStartMonth(date) {
			let end_date = this.get('outputEndData');
			this.set('outputStartData', date);
			if (date.getFullYear() > end_date.getFullYear()) {
				this.set('outputEndData', date)
			} else if (date.getFullYear() === end_date.getFullYear()) {
				if (date.getMonth() > end_date.getMonth()) {
					this.set('outputEndData', date)
				}
			}
		},

		changeOutputEndMonth(date) {
			let start_date = this.get('outputStartData');
			this.set('outputEndData', date);
			if (date.getFullYear() === start_date.getFullYear()) {
				if (date.getMonth() < start_date.getMonth()) {
					this.set('outputStartData', date)
				}
			} else if (date.getFullYear() < start_date.getFullYear()) {
				this.set('outputStartData', date)
			}
        },

        logut() {
			keys(this.get('cookie').read()).forEach(item => {
				this.get('cookie').clear(item)({ path: '/' })
			});
			later(this, () => {
				window.location = "/";
			}, 1000)
		}
    }
});
