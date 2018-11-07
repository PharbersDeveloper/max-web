import Controller from '@ember/controller';
// import XMPPMixin from '../common/xmpp-message-object/XMPPMixin';
// import { computed } from '@ember/object';
// import { inject } from '@ember/service';
// import conf from '../../config/environment';

export default Controller.extend({
    // message: null,
    // xmpp: inject(),
    // init() {
    //     this._super(...arguments);
    //     // this.xmppCallBack(this);
    //     // xmppSendMessage('hello', 'jeorch');
    // },
    // isProgresShow: null,
    // getProgres: computed('isProgresShow', function() {
    //     // body
    //     this.get('isProgresShow')
    // }),

    // content: '',
    // init() {
	// 	let that = this;
	// 	function onMessage(msg) {
	// 		var to = msg.getAttribute('to');
	// 		var from = msg.getAttribute('from');
	// 		var type = msg.getAttribute('type');
	// 		var elems = msg.getElementsByTagName('body');
    //         // debugger
	// 		if (type == "chat" && elems.length > 0) {
	// 			var body = elems[0];
    //
	// 			console.info('ECHOBOT: I got a message from ' + from + ': ' +
	// 				that.get('xmpp').getText(body));
    //                 // console.info()
    //
    //             that.set('message', that.get('xmpp').getText(body));
    //             // console.info(message)
	// 		}
	// 		// we must return true to keep the handler alive.
	// 		// returning false would remove it after it finishes.
	// 		return true;
	// 	}
	// 	this.get('xmpp').
	// 		connect('lu', '123456', conf, onMessage);
	// },
    // actions: {
	// 	send() {
	// 		this.get('xmpp').send(this.get('to') + '@localhost', this.get('content'))
	// 	}
	// }

});
