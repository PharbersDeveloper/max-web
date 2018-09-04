import Route from '@ember/routing/route';
// import {request} from '../request/model';

export default Route.extend({
    actions: {
        login() {
            let req = this.store.createRecord('request', {
                res: 'abcde',
                fm_cond: this.store.createRecord('fm-cond', {
                    skip: 10,
                    take: 20
                })
            });
            let values = [
                {
                    key: 'phone',
                    val: '13720200856',
                    type: 'eq_cond'
                },
                {
                    key: 'name',
                    val: 'Alfred',
                    type: 'eq_cond'
                }
            ]
            values.forEach((elem, index) => {
                req.get(elem.type).pushObject(this.store.createRecord('eq-cond', {
                    id: index,
                    key: elem.key,
                    val: elem.val
                }))
            });
        
            let rqbody = this.store.object2JsonApi('request', req)
            console.info(rqbody)
            this.store.queryObject('/api/login', 'request', rqbody)
        }
    }
});
