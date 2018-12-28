import Route from '@ember/routing/route';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin';

export default Route.extend(XMPPMixin, {
	beforeModel() {
		this.xmppCallBack(this.controllerFor('add-data.generate-sample.index'));
	}
});
