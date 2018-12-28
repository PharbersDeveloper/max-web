/* eslint-disable ember/closure-actions */
import Component from '@ember/component';
import { inject } from '@ember/service';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';

export default Component.extend({
	MaxCalculateObject,
	actions: {
		// TODO 这块儿有问题，但是不知道从哪里调用，必须改为闭包形式，这边我先暂时不检测这个问题，看到TODO不要无视，不要懒给我改了这个
		startCalcMAX() {
			this.sendAction('startCalcMAX');
		},
		viewresults() {
			this.sendAction('viewresults');
		}
	}
});
