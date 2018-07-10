import Controller from '@ember/controller';

export default Controller.extend({
	activeCi: true,
	init() {
		this._super(...arguments);
		this.markets = ['first chosse', 'second'];
		this.cards = [{
			title: "title",
			subtitle: "subtitle",
			city: "city",
			name: "市场名称",
			subname: 'subname',
			value: 'value',
			percent: '5.6%'
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}, {
			title: "产品下滑",
			subtitle: "2018-04",
			city: "",
			name: "商品名称",
			subname: '市场名',
			value: '94.83Mil',
			percent: '56.6%'
		}]
	},
});