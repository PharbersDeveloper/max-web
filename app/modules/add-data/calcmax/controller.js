import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { observer } from '@ember/object';
import { computed } from '@ember/object';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';
import XMPPMixin from '../../common/xmpp-message-object/XMPPMixin';

export default Controller.extend(XMPPMixin,{
    cookies: inject(),
    message: '',
    MaxCalculateObject,
    fluResult: observer('message', function() {
		let msg2Json = this.get('message');
		if(msg2Json.data.attributes.call === 'calc') {
				let job_current = localStorage.getItem('job_id');
				let job_xmpp = msg2Json.data.attributes.job_id;
				let maxPercentage = msg2Json.data.attributes.percentage;
                localStorage.set('thispercentage',0);
                if(thispercentage < maxPercentage) {
                    console.log("maxpercentage is right")
                    this.set('maxPercentage',maxPercentage);
                    localStorage.set('thispercentage',maxPercentage);
                }
                
                console.log("this is max controller")
                console.log(maxPercentage)

			   if (job_current === job_xmpp && msg2Json.data.attributes.percentage == 100) {
				   setTimeout(function(){
					   MaxCalculateObject.set('calcHasDone',true);
				   },1000)
			   }
			// this.transitionToRoute('add-data.viewresults');
			// this.transitionToRoute('add-data.viewresults')
		}

	}),
    init() {
        this._super(...arguments);
		this.set('cpafilename', this.get('cookies').read('filecpa'))
		this.set('gycxfilename', this.get('cookies').read('filegycx'))
        console.info('123456')
		this.xmppCallBack(this);
    },
    actions: {
        startCalcMAX() {
            MaxCalculateObject.set('isShowCalcProgress',true);
            console.log("this is calcmax");
			this.store.peekAll('phmaxjob').lastObject.set('call','max');
			let req = this.store.peekAll('phmaxjob').lastObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            console.log(result);
            this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp.call);
            })
        }
    }
});
