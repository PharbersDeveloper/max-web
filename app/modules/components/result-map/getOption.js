import EmberObject from '@ember/object';

export default EmberObject.extend({
	getOption(data) {
		// let sortArray = data.map((ele, index, array) => parseFloat(ele.value))
		let sortArray = data.map((ele) => parseFloat(ele.value))
			.toArray()
			.sort((p, n) => p - n)

		return {
			visualMap: {
				min: sortArray.get('firstObject'),
				max: sortArray.get('lastObject') + 10,
				left: 'left',
				top: 'bottom',
				text: ['高', '低'],
				inRange: {
					color: ['#EBF0EF', '#37D1C1']
				},
				calculable: true
			},
			series: [{
				name: '中国',
				type: 'map',
				zoom: 1.2,
				mapType: 'china',
				roam: false,
				label: {
					normal: {
						show: false
					}
				},
				data: data
			}]
		}
	}
});