import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	classNames: [],
	didReceiveAttrs() {
		run.scheduleOnce('render', this, this.drawChart);
	},
	drawChart() {
		d3.select('text').remove();
		const Pi = Math.PI;
		let newAngle = parseInt(this.get('newAngle'), 10) || 0,
			arcGenerator = d3.arc()
				.innerRadius(80)
				.outerRadius(100)
				.startAngle(0),
			picture = d3.select('svg')
				.append('g')
				.attr('transform', 'translate(576,100)'),
			// upperGround = picture.append('path')
			// 	.datum({ endAngle: newAngle / 100 * Pi * 2 })
			// 	.style('fill', '#5E81CF')
			// 	.attr('d', arcGenerator),
			upperGround = null,
			dataText = d3.select('g')
				.append('text')
				.text('0%')
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.attr('font-size', '38px');

		picture.append('path')
			.datum({ endAngle: 2 * Math.PI })
			.style('fill', '#E1E1E1')
			.attr('d', arcGenerator);
		upperGround = picture.append('path')
			.datum({ endAngle: newAngle / 100 * Pi * 2 })
			.style('fill', '#5E81CF')
			.attr('d', arcGenerator);
		upperGround.transition().duration(1000) //设置了当前DOM属性过渡变化为指定DOM属性过程所需时间（毫秒）
			.attrTween('d', function (d) { //插值功能API
				let compute = d3.interpolate(d.endAngle, newAngle / 100 * Pi * 2),//实现了插值范围[当前角度值，随机角度值]
					data = null;

				return function (t) {
					d.endAngle = compute(t);
					data = newAngle;
					dataText.text(data.toFixed(0) + '%');
					return arcGenerator(d);
				};
			});
	},
	willDestroyElement() {
		this.set('newAngle', 0);
	}
});
