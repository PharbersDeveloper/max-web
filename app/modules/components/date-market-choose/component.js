import Component from '@ember/component';

export default Component.extend({
	tagName: '',
	showMarkerChoose: true,
	market: 'INF',
	chooseTime: '2018-04',
	// defaultDate: new Date('2018-01'),

	init() {
		this._super(...arguments);
		// this.market = ['等待数据'];
		this.defaultDate = new Date('2018-04');
		this.item = ['11','22'];
	},
	actions: {
		// getValue: function(params) {
        //     console.log(params);
		// 	// var opt = this.get(params);
        // },
		//
        // submit() {
        //     Ember.Logger.log(123);
		// 	var aaa = "a";
		// 	console.info(aaa);
		// 	// this.set()
        // },

    }
});
