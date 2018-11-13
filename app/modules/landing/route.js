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
            //要发送的数据格式
			let eqValues = [
				{type: 'eqcond', key: 'username', val: username},
				{type: 'eqcond', key: 'password', val: pwd}
			]
            //组建的一对多的关系
			eqValues.forEach((elem, index) => {
				req.get(elem.type).pushObject(this.store.createRecord(elem.type, {
					key: elem.key,
					val: elem.val,
					category: elem.category || null
				}))
			})
            //遍历数组
			let result = this.store.object2JsonApi('request', req);
            //转成jsonAPI格式
            // result是request
            this.store.queryObject('/api/v1/maxlogin/0','phauth', result ).then((result) => {
                if(result.token !== '') {
                    this.get('cookies').write('token', result.token, {path: '/'});
                    this.transitionTo('data-center');
                }
            }) //response

        }
    }
});
