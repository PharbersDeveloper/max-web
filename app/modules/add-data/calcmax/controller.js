import Controller from '@ember/controller';
import { observer } from '@ember/object';

export default Controller.extend({
    fluResult: observer('message', function() {
        let msg2Json = this.get('message');
        console.log(msg2Json);
        if(msg2Json.data.attributes.call === 'calc') {
			this.transitionToRoute('add-data.viewresults');
			// this.transitionToRoute('add-data.viewresults')
		}
    }),
    actions: {
        startCalcMAX() {
            console.log("this is calcmax");
			this.store.peekAll('phmaxjob').lastObject.set('call','max');
			let req = this.store.peekAll('phmaxjob').lastObject;

            // let cpa = localStorage.getItem('cpa');
			// let gycx = localStorage.getItem('gycx');
			// let job_id = localStorage.getItem('job_id');
			// let company_id = localStorage.getItem('company_id');
			// let user_id = localStorage.getItem('username');
			// let req = this.store.createRecord('phmaxjob',{
			// 	call: "max",
			// 	job_id: job_id,
			// 	user_id: user_id,
			// 	cpa: cpa,
			// 	gycx: gycx,
			// 	company_id: company_id
			// })
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            console.log(result);
            this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp);
                console.log(resp.call);
            })
        }
    }
});
