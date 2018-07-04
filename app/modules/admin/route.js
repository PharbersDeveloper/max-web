import Route from '@ember/routing/route';
import {
	inject
} from '@ember/service';

export default Route.extend({
	cookies: inject(),

	beforeModel() {
		let role = this.get('cookies').read('user_role');

		if (role === "0") {
			this.transitionTo('data-center');
		} else if (role === undefined) {
			this.transitionTo('/');
		}
	},

});