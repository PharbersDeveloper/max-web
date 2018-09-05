import Route from '@ember/routing/route';
import { inject } from '@ember/service';
// import {request} from '../request/model';

export default Route.extend({
    cookies: inject(),
    actions: {
        login(username,pwd) {
            let req = this.store.createRecord('request', {
				res: 'PHProfile',
			});

			let eqValues = [
				{type: 'eqcond', key: 'username', val: username, category: 'home'},
				{type: 'eqcond', key: 'password', val: pwd}
			]

			eqValues.forEach((elem, index) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
					category: elem.category || null
				}))
			})

			let result = this.store.object2JsonApi('request', req);
            this.store.queryObject('/api/v1/maxlogin/0','phauth', result ).then((result) => {
                if(result.token !== '') {
                    this.get('cookies').write('token', result.token, {path: '/'});
                    this.transitionTo('data-center')
                }
            })
        }
    }
});
