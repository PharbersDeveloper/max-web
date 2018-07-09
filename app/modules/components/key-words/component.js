import Component from '@ember/component';

export default Component.extend({
	tagName: '',
	init() {
		this._super(...arguments);
		// this.card = {
		// 	title: "title",
		// 	subtitle: "subtitle",
		// 	city: "city",
		// 	name: "市场名称",
		// 	subname: 'subname',
		// 	value: 'value',
		// 	percent: '5.6%'
		// }
	},
});