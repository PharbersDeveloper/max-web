import Route from '@ember/routing/route';

export default Route.extend({
	beforeModel() {
		let dataCenterController = this.controllerFor('data-center');

		dataCenterController.set('previousRoute', 'add-data');
	}
});
