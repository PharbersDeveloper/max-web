import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    getData() {
        let req = this.store.createRecord('request', {
            args: 'uploadfiles',
        });

        let result = this.store.object2JsonApi('request', req);

        this.store.queryObject('/api/v1/maxjobgenerate/0','phmaxjob', result ).then((res) => {

        });
    },
    actions: {
        next(cpa,gycx) {
            console.log('is run twice ? ')
            this.store.peekAll('phmaxjob').firstObject.set('cpa',cpa);
            this.store.peekAll('phmaxjob').firstObject.set('gycx',gycx);
            this.store.peekAll('phmaxjob').firstObject.set('call','ymCalc');
            let req = this.store.peekAll('phmaxjob').firstObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            var date = new Date();
            var curDate = null;
            do { curDate = new Date(); }
            while(curDate-date < 500);
            this.store.queryObject('/api/v1/maxjobpush/0','phmaxjob',result).then((resp) => {
                console.log("response");
                console.log(resp.cpa);
                if(!isEmpty(resp.not_arrival_hosp_file)) {
                    console.log(resp.not_arrival_hosp_file)
                    console.log("correct")
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
