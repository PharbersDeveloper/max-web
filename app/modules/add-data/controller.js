import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		backDC() {
			this.transitionToRoute('data-center');
		}
	}
});
