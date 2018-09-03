import Route from '@ember/routing/route';
import {request} from '../request/model';

export default Route.extend({
    actions: {
        login() {
            let req = this.store.createRecord('request', {
                res: 'abcde',
              });
            this.store.queryObject('/api/login', 'request', req)
        }
    }
});
