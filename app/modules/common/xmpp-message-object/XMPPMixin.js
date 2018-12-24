import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
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
		let msg2Json = JSON.parse(msg); //json

		// this.get('logger').info('instances ====>' + this.stack);
		// this.get('logger').info('instance ====>' + this.stack.lastObject);

		this.stack.lastObject.set('message', msg2Json);
	}
});

export default Mixin.create({
	xmpp: inject(),
	isConnected: computed(function () {
		return typeof this.xmpp.getConnection === 'undefined';
	}),
	xmppCallBack(instance) {
		// this.get('logger').info('xmppCallBack instance ====> ' + instance);
		let that = this;

		MessageFactory.register(instance);

		// eslint-disable-next-line no-undefined
		that.get('xmpp').set('connection', undefined);
		function onMessage(msg) {
			// let from = msg.getAttribute('from'),
			let type = msg.getAttribute('type'),
				elems = msg.getElementsByTagName('body');

			// debugger

			if (type === 'chat' && elems.length > 0) {
				let body = elems[0];

				// this.get('logger').info('ECHOBOT: I got a message from ' + from + ': ' +
				// 	that.get('xmpp').getText(body));
				MessageFactory.doCall(that.get('xmpp').getText(body));
			}
			return true;
		}

		if (this.isConnected) {
			this.get('xmpp').connect('lu', '123456', conf, onMessage);
		}
	},
	xmppSendMessage(msg, to) {
		this.get('xmpp').send(to + '@localhost', msg);
	}
});
