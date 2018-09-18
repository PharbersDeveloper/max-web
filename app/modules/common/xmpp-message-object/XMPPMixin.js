import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { inject } from '@ember/service';
import conf from '../../../config/environment';

const MessageFactory = EmberObject.create({
    doCall(msg, instance, func) {
        let msg2Json = msg; //json
        instance.set('message', msg2Json)
    }
});

export default Mixin.create({
    xmpp: inject(),
    xmppCallBack(instance) {
        let that = this
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
                    // console.info()
                MessageFactory.doCall(that.get('xmpp').getText(body), instance)
                // instance.set('number', '123')
                // console.info(message)
			}
			return true;
		}
		this.get('xmpp').connect('lu', '123456', conf, onMessage);
    },
    xmppSendMessage(msg, to) {
        this.get('xmpp').send(to + '@localhost', msg)
    }
});
