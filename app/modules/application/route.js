import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    cookies: inject(),
    actions: {
        start() {
            let req = this.store.createRecord('request', {
				res: 'PHProfile',
			});
			let eqValues = [
				{type: 'eqcond', key: 'user_id', val: user_id, category: 'home'},
				{type: 'eqcond', key: 'company_id', val: company_id},
                {type: 'eqcond', key: 'job_id', val: job_id},
                {type: 'eqcond', key: 'message', val: message},
			]

			eqValues.forEach((elem, index) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
					category: elem.category || null
				}))
			})

			let result = this.store.object2JsonApi('request', req);
            console.log(request);
            // this.store.queryObject('/api/v1/maxlogin/0','phauth', result ).then((result) => {
            //     if(result.token !== '') {
            //         this.get('cookies').write('token', result.token, {path: '/'});
            //         this.transitionTo('data-center')
            //     }
            // })
        }
    }
});
