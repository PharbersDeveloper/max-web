import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import {computed} from '@ember/object';
import Service, { inject } from '@ember/service';
import conf from '../../../config/environment';
// import SampleObject from '../../common/xmpp-message-object/SampleObjectMessage';
import Route from '@ember/routing/route';

const MessageFactory = EmberObject.create({
    stack: [],
    register(instance) {
        this.get('logger').info('push fuck pick up instance ====> ' + instance)
        this.stack.pushObject(instance);
        this.get('logger').info('register instances ====>' + this.stack)
    },
    unregisterLast() {
        this.stack.popObject();
    },
    doCall(msg, instance) {
        let that = this;
        let msg2Json = JSON.parse(msg); //json
        // instance.set('message', msg2Json);
        this.get('logger').info('instances ====>' + this.stack)
        this.get('logger').info('instance ====>' + this.stack.lastObject)

        this.stack.lastObject.set('message', msg2Json);

        // this.get('logger').info('instance ====> ' + this.stack.lastObject)
        // this.get('logger').info('instance ====> ' + this.stack.firstObject)
        // this.get('logger').info('instance ====> ' + this.stack.length)
    }
});

export default Mixin.create({
    xmpp: inject(),
    isConnected: computed(function(){
        return this.xmpp.getConnection === undefined;
    }),
    xmppCallBack(instance) {
        this.get('logger').info('xmppCallBack instance ====> ' + instance)
        let that = this;
        MessageFactory.register(instance);

        that.get('xmpp').set('connection', undefined);
        function onMessage(msg) {
			var to = msg.getAttribute('to');
			var from = msg.getAttribute('from');
			var type = msg.getAttribute('type');
			var elems = msg.getElementsByTagName('body');
            // debugger
			if (type == "chat" && elems.length > 0) {
				var body = elems[0];

				this.get('logger').info('ECHOBOT: I got a message from ' + from + ': ' +
					that.get('xmpp').getText(body));
                MessageFactory.doCall(that.get('xmpp').getText(body));
			}
			return true;
		}

        if (this.isConnected) {
            this.get('xmpp').connect('lu', '123456', conf, onMessage);
        }
    },
    xmppSendMessage(msg, to) {
        this.get('xmpp').send(to + '@localhost', msg)
    }
});
