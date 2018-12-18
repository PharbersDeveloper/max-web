import Component from '@ember/component';
import { inject } from '@ember/service';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';

export default Component.extend({
	cookies: inject(),
	MaxCalculateObject,
	actions: {
		startCalcMAX() {
			this.sendAction('startCalcMAX');
		},
		viewresults() {
			this.sendAction('viewresults');
		}
	}
});
