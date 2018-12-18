import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
    uploadfiles_route: service('add_data.uploadfiles_route'),
    uploadfiles_controller: service('add_data.uploadfiles_controller'),
    getData() {
        let company_id = localStorage.getItem('company_id');
        let user_id = localStorage.getItem('username');
        let req = this.get('uploadfiles_controller').createModel('Phmaxjob', {
            id: this.get('hash').uuid(),
            user_id: user_id,
            company_id: company_id,
        })
        let result = this.get('uploadfiles_route').object2JsonApi(req);

        this.get('uploadfiles_route').queryObject('api/v1/maxjobgenerate/0', 'Phmaxjob', result)
            .then((res) => {
                localStorage.setItem('job_id', res.job_id)
                localStorage.setItem('company_id', res.company_id)
            });
    },
    init() {
        this._super(...arguments);
        this.getData();
    },
    actions: {
        next(cpa, gycx) {
            this.get('uploadfiles_controller').queryModelByAll('Phmaxjob').lastObject.set('cpa', cpa);
            this.get('uploadfiles_controller').queryModelByAll('Phmaxjob').lastObject.set('gycx', gycx);
            this.get('uploadfiles_controller').queryModelByAll('Phmaxjob').lastObject.set('call', 'ymCalc');
            let req = this.get('uploadfiles_controller').queryModelByAll('Phmaxjob').lastObject;
            let result = this.get('uploadfiles_route').object2JsonApi(req, false);

            this.get('uploadfiles_route').queryObject('api/v1/maxjobpush/0', 'Phmaxjob', result)
                .then((resp) => {
                    if (!isEmpty(resp.not_arrival_hosp_file)) {
                        localStorage.setItem('not_arrival_hosp_file', resp.not_arrival_hosp_file);
                        localStorage.setItem('cpa', resp.cpa);
                        localStorage.setItem('gycx', resp.gycx);
                        this.transitionToRoute('add-data.generate-sample');
                    } else {
                        window.console.log("error route!!!!!");
                    }
                })
        }
    }
});
