import PharbersAdapter from 'pharbers-emberbasis-library/adapters/phadapter';
import cookie from 'pharbers-ember-util-package/cookies';

export default PharbersAdapter.extend({
	namespace: '/',
	init() {
		//cookie.create().read('token')
		this.set('headers', {
			'dataType': 'json',
			'contentType': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `bearer 5c138ef2ffc97ba8e165b5a8b256df71`
		});
	}
});
