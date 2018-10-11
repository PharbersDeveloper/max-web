import Controller from '@ember/controller';

export default Controller.extend({
	activeCi: true,
	init() {
		this._super(...arguments);
		this.markets = ['first chosse', 'second'];
	},
});