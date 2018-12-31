import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import XMPPMixin from '../../common/xmpp-message-object/XMPPMixin';

export default Route.extend(XMPPMixin, {
	calcmaxRoute: service('add_data.calcmax_route'),
	calcmaxController: service('add_data.calcmax_controller'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	beforeModel() {
		this.xmppCallBack(this.controllerFor('add-data.calcmax'));
	},
	model(params) {
		this.get('logger').log(params);
		this.controllerFor('add-data.calcmax').set('panelflow', params.panelflow - 0);
		// 你的逻辑
	},
	actions: {
		// 你的动作
	}
});
