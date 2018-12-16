import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Route.extend({
    landing_route: service(),
    landing_controller: service(),
    setupController(controller, model) {
        this._super(controller, model);
        // this.controllerFor('application')
    },
    model() {
        // 你的逻辑
    },
    actions: {
        // 你的动作
        login(username, pwd) {
            let req = this.get('landing_controller').createModel('request', {
                id: 'phpid',
                res: 'PhProfile',
                eqcond: A([
                    this.get('landing_controller').createModel('eqcond', {
                        id: 'equsername',
                        key: 'username',
                        val: username
                    }),
                    this.get('landing_controller').createModel('eqcond', {
                        id: 'eqpassword',
                        key: 'password',
                        val: pwd
                    })
                ]),

            });
            let result = this.get('landing_route').object2JsonApi(req);

            this.get('landing_route').queryObject('api/v1/maxlogin/0', 'PhAuth', result)
                .then((data) => {
                    if (data.token !== '') {
                    	this.get('cookie').write('token', data.token, { path: '/' });
                    	this.transitionTo('data-center');
                    }
                })
        }
    }
});
