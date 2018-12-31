import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function () {
	this.route('landing');
	this.route('data-center', function () {
		this.route('overview');
		this.route('city');
		this.route('province');
		this.route('country');
	});
	this.route('add-data', function () {
		this.route('uploadfiles');
		this.route('generate-sample', function () {
			this.route('sample-finish');
		});
		this.route('calcmax', { path: '/calcmax/:panelflow' });
		this.route('viewresults', { path: '/viewresults/:panelflow' });
		this.route('uploadfiles-panel');
		this.route('check-sample-panel', function () {
			this.route('sample-finish');
		});
	});
});

export default Router;
