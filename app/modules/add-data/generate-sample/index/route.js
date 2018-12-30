import Route from '@ember/routing/route';
import XMPPMixin from '../../../common/xmpp-message-object/XMPPMixin';

export default Route.extend(XMPPMixin, {
	beforeModel() {
		let currentController = this.controllerFor('add-data.generate-sample.index');

		currentController.set('cpafilename', this.get('cookie').read('filecpa'));
		currentController.set('gycxfilename', this.get('cookie').read('filegycx'));
		currentController.set('SampleObject.isShowProgress', false);
		currentController.set('SampleObject.calcYearsProgress', false);
		currentController.set('SampleObject.calcPanelProgress', false);
		this.xmppCallBack(this.controllerFor('add-data.generate-sample.index'));
	}
});
