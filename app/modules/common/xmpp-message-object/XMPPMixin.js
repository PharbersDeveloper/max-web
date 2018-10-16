import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import {computed} from '@ember/object';
import { inject } from '@ember/service';
import conf from '../../../config/environment';
import SampleObject from '../../common/xmpp-message-object/SampleObjectMessage';
import Route from '@ember/routing/route';

const MessageFactory = Service.create({
    stack: [],
    register(instance) {
        console.info('push fuck pick up instance ====> ' + instance)
        this.stack.push(instance);
    },
    unregisterLast() {
        this.stack.pop();
    },
    doCall(msg, instance) {
        let msg2Json = JSON.parse(msg); //json
        // instance.set('message', msg2Json);

        this.stack.lastObject.set('message', msg2Json);
        console.info('instance ====> ' + this.stack.lastObject)
        console.info('instance ====> ' + this.stack.firstObject)
        console.info('instance ====> ' + this.stack.length)
    }
});

export default Mixin.create({
    xmpp: inject(),
    isConnected: computed(function(){
        return this.xmpp.getConnection == true;
    }),
    xmppCallBack(instance) {
        console.info('xmppCallBack instance ====> ' + instance)
        let that = this;
        MessageFactory.register(instance);
        //TODO alex 这块需要多链接Instance或替换新的Instance
        // console.info(that.get('xmpp').get('connection'))
        // that.get('xmpp').set('connection', undefined);
        function onMessage(msg) {
			var to = msg.getAttribute('to');
			var from = msg.getAttribute('from');
			var type = msg.getAttribute('type');
			var elems = msg.getElementsByTagName('body');
            // debugger
			if (type == "chat" && elems.length > 0) {
				var body = elems[0];

				console.info('ECHOBOT: I got a message from ' + from + ': ' +
					that.get('xmpp').getText(body));
                // MessageFactory.doCall(that.get('xmpp').getText(body), instance)
                MessageFactory.doCall(that.get('xmpp').getText(body));
                // instance.set('number', '123')
                // console.info(message)
			}
			return true;
		}
        console.info('xmpps');
        if (!this.isConnected) {
            this.get('xmpp').connect('lu', '123456', conf, onMessage);
        }
    },
    xmppSendMessage(msg, to) {
        this.get('xmpp').send(to + '@localhost', msg)
    }
});
