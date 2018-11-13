import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    getData() {
        let company_id = localStorage.getItem('company_id');
        let user_id = localStorage.getItem('username');
        let req = this.store.createRecord('phmaxjob', {
            user_id: user_id,
            company_id: company_id,
        })
        let result = this.store.object2JsonApi('phmaxjob', req);

        this.store.queryObject('/api/v1/maxjobgenerate/0', 'phmaxjob', result).then((res) => {
            localStorage.setItem('job_id', res.job_id)
            localStorage.setItem('company_id', res.company_id)
        });
    },
    actions: {
        next(cpa, gycx) {
            this.store.peekAll('phmaxjob').lastObject.set('cpa', cpa);
            this.store.peekAll('phmaxjob').lastObject.set('gycx', gycx);
            this.store.peekAll('phmaxjob').lastObject.set('call', 'ymCalc');
            let req = this.store.peekAll('phmaxjob').lastObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            // TODO：Alex这块儿可能有问题
            this.store.peekAll('phmaxjob').lastObject.set('cpa', '');
            this.store.peekAll('phmaxjob').lastObject.set('gycx', '');

            this.store.queryObject('/api/v1/maxjobpush/0', 'phmaxjob', result).then((resp) => {
                if (!isEmpty(resp.not_arrival_hosp_file)) {
                    localStorage.setItem('not_arrival_hosp_file', resp.not_arrival_hosp_file);
                    localStorage.setItem('cpa', resp.cpa);
                    localStorage.setItem('gycx', resp.gycx);
                    this.transitionToRoute('/add-data/generate-sample');
                } else {
                    console.log("error route!!!!!");
                }
            })

        }
    },
    init() {
        this._super(...arguments);
        this.getData();
    },
});
