import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    getData() {
        let company_id = localStorage.getItem('company_id');
		let user_id = localStorage.getItem('username');
        let req = this.store.createRecord('phmaxjob',{
			res: "uploadfiles",
			user_id: user_id,
			company_id: company_id,
		})
        let result = this.store.object2JsonApi('phmaxjob', req);

        this.store.queryObject('/api/v1/maxjobgenerate/0','phmaxjob', result ).then((res) => {
            console.log("this is upload")
            console.log(res);
            localStorage.setItem('job_id',res.job_id)
            localStorage.setItem('company_id',res.company_id)
        });
    },
    actions: {
        next(cpa,gycx) {
            console.log("next");
            this.store.peekAll('phmaxjob').firstObject.set('cpa',cpa);
            this.store.peekAll('phmaxjob').firstObject.set('gycx',gycx);
            this.store.peekAll('phmaxjob').firstObject.set('call','ymCalc');
            let req = this.store.peekAll('phmaxjob').firstObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            // var date = new Date();
            // var curDate = null;
            // do { curDate = new Date(); }
            // while(curDate-date < 500);
            this.store.queryObject('/api/v1/maxjobpush/0','phmaxjob',result).then((resp) => {
                console.log(resp.cpa);
                if(!isEmpty(resp.not_arrival_hosp_file)) {
                    console.log("uploadfiles is ok");
                    localStorage.setItem('not_arrival_hosp_file',resp.not_arrival_hosp_file);
                    localStorage.setItem('cpa',resp.cpa);
                    localStorage.setItem('gycx',resp.gycx);
                    this.transitionToRoute('/add-data/generate-sample');
                } else {
                    console.log("error route");
                }
            })

        }
    },
    init() {
        this._super(...arguments);
        this.getData();
    },
});
