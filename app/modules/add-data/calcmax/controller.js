import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        startCalcMAX() {
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
