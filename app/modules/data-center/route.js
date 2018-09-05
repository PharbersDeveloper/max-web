import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
    model() {
        // console.info(this.modelFor('phauth'))
        let company = '';
        let username = '';
        this.store.peekAll('phauth').forEach(ele => {
            company = ele.profile.company.companyname;
            username =  ele.profile.username;
        });
        // this.controllerFor('data-center').set('data',{company: company,username: "bbb"})
        return RSVP.hash({
             title:"Pharbers 数据平台",
             company: company,
             username: username
         });

        this.startDate = new Date('2018-01');
		this.endDate = new Date();
    }
});
