import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';
import XMPPMixin from '../../common/xmpp-message-object/XMPPMixin';

export default Controller.extend(XMPPMixin, {
    calcmax_route: service('add_data.calcmax_route'),
    calcmax_controller: service('add_data.calcmax_controller'),

    message: '',
    MaxCalculateObject,
	init() {
		this._super(...arguments);
        this.set('cpafilename', this.get('cookie').read('filecpa'))
        this.set('gycxfilename', this.get('cookie').read('filegycx'))
        this.xmppCallBack(this);
    },
    fluResult: observer('message', function () {
        let msg2Json = this.get('message');
        if (msg2Json.data.attributes.call === 'calc') {
            let job_current = localStorage.getItem('job_id');
            let job_xmpp = msg2Json.data.attributes.job_id;
            let maxPercentage = msg2Json.data.attributes.percentage;
            if (maxPercentage > localStorage.getItem('maxpercentage')) {
                this.set('maxPercentage', maxPercentage);
                localStorage.setItem('maxpercentage', maxPercentage);
            }
            console.log("this is in max controller")
            console.log(maxPercentage)
            if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
                setTimeout(function () {
                    MaxCalculateObject.set('calcHasDone', true);
                }, 1000)
            }
        }

    }),
	actions: {
        startCalcMAX() {
            MaxCalculateObject.set('isShowCalcProgress', true);
            console.log("this is calcmax");
            localStorage.setItem('maxpercentage', 0);
            this.get('calcmax_controller').queryModelByAll('Phmaxjob').lastObject.set('call', 'max');
            let req = this.get('calcmax_controller').queryModelByAll('Phmaxjob').lastObject;
            let result = this.get('calcmax_route').object2JsonApi(req, false);
            this.get('calcmax_route').queryObject('api/v1/maxjobsend/0', 'Phmaxjob', result)
        },
        viewresults() {
            this.transitionToRoute('add-data.viewresults');
        }
	}
});
