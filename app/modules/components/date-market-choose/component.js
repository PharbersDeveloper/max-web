import Component from '@ember/component';

export default Component.extend({
	tagName: '',
	showMarkerChoose: true,
	// defaultDate: new Date('2018-01'),
	init() {
		this._super(...arguments);
		// this.market = ['等待数据'];
		this.defaultDate = new Date('2018-04');
	},
	actions: {
        submit() {
            Ember.Logger.log(123);
			var market = this.get('ALl');

			console.info(market);
			// var time = this.get('')
        },
		getValue: function(params) {
            //  获取选中的值
            console.log(params);
        }
    }
});
