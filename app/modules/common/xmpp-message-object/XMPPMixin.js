import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { inject } from '@ember/service';
import conf from '../../../config/environment';

const MessageFactory = EmberObject.create({
	stack: [],
	register(instance) {
		// this.get('logger').info('push fuck pick up instance ====> ' + instance);
		this.stack.pushObject(instance);
		// this.get('logger').info('register instances ====>' + this.stack);
	},
	unregisterLast() {
		this.stack.popObject();
	},
	doCall(msg) {
		try {
			let msg2Json = JSON.parse(msg); //json

			this.stack.lastObject.set('message', msg2Json);
		} catch (error) {
			window.console.log(error);
		}
	}
});

export default Mixin.create({
	xmpp: inject(),
	// isConnected: computed(function () {
	// 	window.console.info(this.xmpp.getConnection);
	// 	return typeof this.xmpp.getConnection === 'undefined';
	// }),
	xmppCallBack(instance) {
		// this.get('logger').info('xmppCallBack instance ====> ' + instance);
		let that = this;

		MessageFactory.register(instance);

		function onMessage(msg) {
			// let from = msg.getAttribute('from'),
			let type = msg.getAttribute('type'),
				elems = msg.getElementsByTagName('body');

			if (type === 'chat' && elems.length > 0) {
				let body = elems[0];

				// this.get('logger').info('ECHOBOT: I got a message from ' + from + ': ' +
				// 	that.get('xmpp').getText(body));
				MessageFactory.doCall(that.get('xmpp').getText(body));
			}
			return true;
		}

		if (typeof this.get('xmpp').getConnection === 'undefined') {
			let user = localStorage.getItem('username');

			this.get('xmpp').connect(user, '123123', conf, onMessage);
		}
	},
	xmppSendMessage(msg, to) {
		this.get('xmpp').send(to + '@max.logic', msg);
	},
	unregisterLast() {
		MessageFactory.unregisterLast();
	}
});
