import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import SampleObject from '../../../common/xmpp-message-object/SampleObjectMessage';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin'
import styles from '../styles';
export default Controller.extend(XMPPMixin, {
    check_sample_panel_route: service('add_data.check_sample_panel_route'),
	check_sample_panel_controller: service('add_data.check_sample_panel_controller'),
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
                    setTimeout(function () {
                        SampleObject.set('isShowProgress', false);
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
        this.set('cpafilename', this.get('cookie').read('filecpa'))
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
                    that.transitionToRoute('add-data.generate-sample.sample-finish');

                } else {
                    let newNum = panelPercentage + 10;
                    that.set('panelPercentage', newNum);
                }
            }, 600);
        },
        startParsingFile() {
            SampleObject.set('isShowProgress', true);
            localStorage.setItem('ympercentage', 0);
            let cpa = localStorage.getItem('cpa');
            let not_arrival_hosp_file = localStorage.getItem('not_arrival_hosp_file');
            let job_id = localStorage.getItem('job_id');
            let company_id = localStorage.getItem('company_id');
            let user_id = localStorage.getItem('username');
            let req = this.get('check_sample_panel_controller').createModel('Phmaxjob', {
                id: this.get('hash').uuid(),
                call: "ymCalc",
                percentage: 0,
                job_id: job_id,
                user_id: user_id,
                cpa: cpa,
                not_arrival_hosp_file: not_arrival_hosp_file,
                company_id: company_id
            })
            let result = this.get('check_sample_panel_route').object2JsonApi(req, false);
            this.get('check_sample_panel_route').queryObject('/api/v1/maxjobsend/0', 'Phmaxjob', result)
        },

        uploadFileAgain(modal) {
            modal.close()
            SampleObject.set('isShowProgress', false);
            SampleObject.set('calcPanelProgress', false);
            this.transitionToRoute('add-data.uploadfiles-panel');
        }
    }
});
