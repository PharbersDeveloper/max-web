import Controller from '@ember/controller';
import { observer } from '@ember/object';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';

export default Controller.extend({
    actions: {
        startCalcMAX() {
            MaxCalculateObject.set('isShowCalcProgress',true);
            console.log("this is calcmax");
			this.store.peekAll('phmaxjob').lastObject.set('call','max');
			let req = this.store.peekAll('phmaxjob').lastObject;
            let result = this.store.object2JsonApi('phmaxjob', req, false);
            console.log(result);
            this.store.queryObject('/api/v1/maxjobsend/0','phmaxjob',result).then((resp) => {
                console.log(resp);
                console.log(resp.call);
            })
        }
    }
});
