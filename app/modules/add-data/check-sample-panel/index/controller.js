import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { observer } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin'
import styles from '../styles';
export default Controller.extend(XMPPMixin, {

    cookies: inject(),
    styles,
    message: '',
    SampleObject,
    fluResult: observer('message', function () {
        let msg2Json = this.get('message');
        if (msg2Json.data.attributes.call === 'ymCalc') {
            let job_current = localStorage.getItem('job_id');
            let job_xmpp = msg2Json.data.attributes.job_id;
            let ymPercentage = msg2Json.data.attributes.percentage;
            if (ymPercentage > localStorage.getItem('ympercentage')) {
                this.set('ymPercentage', ymPercentage);
                localStorage.setItem('ympercentage', ymPercentage);
                if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
                    // let ymArray = msg2Json.data.attributes.message.split('#');
                    // let checkArray = ymArray.map((item) => {
                    //     return {
                    //         isChecked: false,
                    //         value: item,
                    //         id: item,
                    //     }
                    // });
                    // this.set('ymList', checkArray)
                    setTimeout(function () {
                        // SampleObject.set('fileParsingSuccess', true);
                        SampleObject.set('isShowProgress', false);
                        // SampleObject.set('calcYearsProgress', false);
                    }, 1000)

                }
            }
        } else if (msg2Json.data.attributes.call === 'panel') {
            let job_current = localStorage.getItem('job_id');
            let job_xmpp = msg2Json.data.attributes.job_id;
            let panelPercentage = msg2Json.data.attributes.percentage;
            if (panelPercentage > localStorage.getItem('panelpercentage')) {
                this.set('panelPercentage', panelPercentage);
                localStorage.setItem('panelpercentage', panelPercentage);
            }
            let that = this;
            if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
                setTimeout(function () {
                    that.transitionToRoute('add-data.generate-sample.sample-finish');
                }, 1000)
            }
        }
    }),
    init() {
        this._super(...arguments);
        this.set('cpafilename', this.get('cookies').read('filecpa'))
        this.xmppCallBack(this);
    },

    actions: {
        startPanel() {
            SampleObject.set('isShowProgress', true);
            SampleObject.set('calcPanelProgress', true);
            localStorage.setItem('panelpercentage', 0);
            let that = this;
            let mockPercent = setInterval(() => {
                let panelPercentage = that.get('panelPercentage') || 0;
                if (panelPercentage > localStorage.getItem('panelpercentage')) {
                    localStorage.setItem('panelpercentage', panelPercentage);
                }
                if (panelPercentage > 99) {
                    clearInterval(mockPercent);
                    // that.transitionToRoute('add-data.check-sample-panel.sample-finish');
                    that.transitionToRoute('add-data.generate-sample.sample-finish');

                } else {
                    let newNum = panelPercentage + 10;
                    that.set('panelPercentage', newNum);
                }
            }, 600);
        },
        startParsingFile() {
            SampleObject.set('isShowProgress', true);
            // SampleObject.set('calcYearsProgress', true);
            localStorage.setItem('ympercentage', 0);
            // let req = this.store.peekAll('phmaxjob').lastObject;
            let cpa = localStorage.getItem('cpa');
            // let gycx = localStorage.getItem('gycx');
            let not_arrival_hosp_file = localStorage.getItem('not_arrival_hosp_file');
            let job_id = localStorage.getItem('job_id');
            let company_id = localStorage.getItem('company_id');
            let user_id = localStorage.getItem('username');
            let req = this.store.createRecord('phmaxjob', {
                call: "ymCalc",
                percentage: 0,
                job_id: job_id,
                user_id: user_id,
                cpa: cpa,
                // gycx: gycx,
                not_arrival_hosp_file: not_arrival_hosp_file,
                company_id: company_id
            })
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            this.store.queryObject('/api/v1/maxjobsend/0', 'phmaxjob', result).then((resp) => {
            })
        },
        // startGenerateSample() {
        //     SampleObject.set('calcYearsProgress', false);
        //     SampleObject.set('isShowProgress', true);
        //     SampleObject.set('calcPanelProgress', true);
        //     localStorage.setItem('panelpercentage', 0);
        // let ymList = this.get('ymList');
        // let years = ymList.filterBy('isChecked', true);
        // let year = [];
        // years.forEach((k) => {
        //     year.push(k.value)
        // });
        // if (year.length === 0) {
        //     this.set('yearsNullError', true);
        // } else {
        //     let yearsString = year.join('#');

        //     this.store.peekAll('phmaxjob').lastObject.set('yms', yearsString);
        //     this.store.peekAll('phmaxjob').lastObject.set('call', 'panel');
        //     let req = this.store.peekAll('phmaxjob').lastObject;
        //     let result = this.store.object2JsonApi('phmaxjob', req, false);
        //     this.store.queryObject('/api/v1/maxjobsend/0', 'phmaxjob', result).then((resp) => {
        //         if (resp.call === 'panel') {
        //             SampleObject.set('calcYearsProgress', false);
        //             SampleObject.set('calcPanelProgress', true);
        //         } else {
        //             SampleObject.set('fileParsingError', false);
        //         }
        //     })
        // }
        // },

        // 未显示要计算的月份
        // cantFindMonth: function () {
        //     SampleObject.set('fileParsingSuccess', false);
        //     SampleObject.set('cantFindMonth', true);
        // },
        uploadFileAgain(modal) {
            modal.close()
            SampleObject.set('isShowProgress', false);
            // SampleObject.set('fileParsingSuccess', false);
            // SampleObject.set('calcYearsProgress', false);
            SampleObject.set('calcPanelProgress', false);
            this.transitionToRoute('add-data.uploadfiles-panel')
        }
    }
});
