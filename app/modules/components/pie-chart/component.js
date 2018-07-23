import Component from '@ember/component';
import {
	run
} from '@ember/runloop';
import {
	get
} from '@ember/object'
// import {
// 	select
// } from 'd3-selection';
import d3 from 'd3';

export default Component.extend({
	tagName: 'svg',
	classNames: ['col-md-4', 'col-sm-12', 'simple-pie'],
	width: '100%',
	height: 320,
	attributeBindings: ['width', 'height'],
	init() {
		this._super(...arguments)
		this.margin = {
			top: 40,
			right: 20,
			bottom: 30,
			left: 20
		};
	},
	didReceiveAttrs() {
		run.scheduleOnce('render', this, this.drawPie)
	},
	drawPie() {
		let svg = d3.select(this.element)
		let width = get(this, 'width')
		let height = get(this, 'height')

		let margin = this.get('margin');
		// let width = 500 - margin.left - margin.right;
		// let height = 400 - margin.top - margin.bottom;
		let radius = 160;
		var pieData = this.get('pieData');
		var dataTitle = [];
		var pieColor = [];
		var pieValue = [];
		// console.log('this is from pie-chart')
		pieData.map(function(item, index) {
			dataTitle.push(item.prod);
		});
		pieData.map(function(item, index) {
			pieColor.push(item.color);
		});
		pieData.map(function(item, index) {
			pieValue.push(item.cont);
		});
		var outerRadius = 270 / 2;
		var innerRadius = 75;
		let data = pieValue;
		let color = pieColor
		// var arc = d3.arc()
		// 	.outerRadius(radius);

		let arc = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		let arc2 = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius + 15)
		var pie = d3.pie()
			.value(function(d) {
				return d.cont
			})

		svg.datum(pieData)
			// .datum(function() {
			// 	return d.cont
			// })
			.attr("width", width)
			.attr("height", height)
			.attr('viewBox', '0 0 ' + 300 + ' ' + 300)
			.attr('preserveAspectRatio', 'xMidYMid', 'meet')
			.append("g")
			.attr("transform", "translate(" + 150 + "," + 150 + ")");
		var arcs = svg.selectAll("g.arc")
			.data(pie)
			.enter().append("g")
			.attr("class", "arc")
			// 将g移至中间
			.attr("transform", "translate(160,150)")
			//为每一块元素添加鼠标事件
			.on("mouseover", function(d) {
				let left = 135 + arc.centroid(d)[0];
				let top = 135 + arc.centroid(d)[1];
				d3.select(this).select("path").transition().attr("d", function(d) {
					return arc2(d);
				})
				// tooltip
				// d3.select(".tooltip")
				// 	.style("left", left + "px")
				// 	.style("top", top + "px")
				// 	.style("opacity", 1)
				// 	.text(d.data.prod);
			})

			.on("mouseout", function(d) {
				d3.select(this).select("path").transition().attr("d", function(d) {
					return arc(d);
				})
				// d3.select(".tooltip").style("opacity", 0.0);
			})
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color[i];
			})
			.transition()
			.ease(d3.easeBounce)
			.duration(2000)
			.attrTween("d", tweenPie)
			.transition()
			.ease(d3.easeElastic)
			.delay(function(d, i) {
				return 100 + i * 50;
			})
			.duration(1000)
			.attrTween("d", tweenDonut);
		arcs.append("text")
			.attr("transform", function(d) {
				//get the centroid of every arc, include x and y, 质心
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.attr('class', 'inside')
			.text(function(d) {
				// what's the difference between d.value and d.data?
				return d.value + '%';
			})

		function tweenPie(b) {
			b.innerRadius = 0;
			var i = d3.interpolate({
				startAngle: 0,
				endAngle: 0
			}, b);
			return function(t) {
				return arc(i(t));
			};
		}

		function tweenDonut(b) {
			b.innerRadius = radius * .6;
			var i = d3.interpolate({
				innerRadius: 0
			}, b);
			return function(t) {
				return arc(i(t));
			};
		}

	}
});