import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    uploadfiles_panel_route: service('add_data.uploadfiles_panel_route'),
    uploadfiles_panel_controller: service('add_data.uploadfiles_panel_controller'),
    init() {
        this._super(...arguments);
        this.getData();
        this.set('marketAndTime', false);
    },
    getData() {
        let company_id = localStorage.getItem('company_id');
        let user_id = localStorage.getItem('username');
        let req = this.get('uploadfiles_panel_controller').createModel('Phmaxjob', {
            id: this.get('hash').uuid(),
            user_id: user_id,
            company_id: company_id,
        })
        let result = this.get('uploadfiles_panel_route').object2JsonApi(req);

        this.get('uploadfiles_panel_route').queryObject('api/v1/maxjobgenerate/0', 'Phmaxjob', result)
            .then((res) => {
                localStorage.setItem('job_id', res.job_id)
                localStorage.setItem('company_id', res.company_id)
            });
    },
    actions: {
        next(panel) {
            this.set('panel', panel);
            this.set('marketAndTime', true);
        },
        nextStep() {
            let panel = this.get('panel');
            let market = this.get('panelMarket');
            let month = this.get('panelMonth');
            /**
             * 原逻辑 这样写绝逼会出现问题，不过先不改，等第一波通过后重构逻辑
             */
            this.get('uploadfiles_panel_controller').queryModelByAll('Phmaxjob').lastObject.set('panel', panel);
            this.get('uploadfiles_panel_controller').queryModelByAll('Phmaxjob').lastObject.set('panelMkt', market);
            this.get('uploadfiles_panel_controller').queryModelByAll('Phmaxjob').lastObject.set('yms', month);
            this.get('uploadfiles_panel_controller').queryModelByAll('Phmaxjob').lastObject.set('call', 'ymCalc');
            let req = this.get('uploadfiles_panel_controller').queryModelByAll('Phmaxjob').lastObject;
            let result = this.get('uploadfiles_panel_route').object2JsonApi(req, false);

            this.get('uploadfiles_panel_route').queryObject('api/v1/maxjobpushpanel/0', 'Phmaxjob', result)
                .then((resp) => {
                    console.log(resp);
                    console.log(resp.panel);
                    console.log(resp.panelfime);
                    localStorage.setItem('panel', resp.panel);
                    this.transitionToRoute('add-data.check-sample-panel');
                })

        }
    }
});
