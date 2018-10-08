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
            localStorage.setItem('username',username);
            localStorage.setItem('company',company);
        });
        let user = localStorage.getItem('username');
        let comp = localStorage.getItem('company')
        // this.controllerFor('data-center').set('data',{company: company,username: "bbb"})
        return RSVP.hash({
             title:"Pharbers 数据平台",
             company: comp,
             username: user,
         });


        // this.startDate = new Date('2018-01');
		// this.endDate = new Date();
    }
});
