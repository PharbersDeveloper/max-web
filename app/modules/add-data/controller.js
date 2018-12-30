import Controller from '@ember/controller';
import rsvp from 'rsvp';
const { keys } = Object;

export default Controller.extend({

	actions: {
		backDC() {
			let company = localStorage.getItem('company'),
				companyId = localStorage.getItem('company_id'),
				userName = localStorage.getItem('username'),
				xpmmjid = localStorage.getItem('xmppjid'),
				cookie = this.get('cookie'),
				token = cookie.read('token'),
				companyKind = cookie.read('process');

			new rsvp.Promise((resolve) => {
				keys(cookie.read()).forEach(item => {
					cookie.cleans(item)({ path: '/' });
				});
				localStorage.clear();
				localStorage.setItem('company', company);
				localStorage.setItem('company_id', companyId);
				localStorage.setItem('username', userName);
				localStorage.setItem('xmppjid', xpmmjid);
				cookie.write('token', token, { path: '/' });
				cookie.write('process', companyKind, { path: '/' });

				return resolve(true);
			}).then(() => {
				this.transitionToRoute('data-center');
			});
		}
	}
});
