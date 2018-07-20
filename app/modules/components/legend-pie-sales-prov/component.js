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
	classNames: ['legend-pie-prov'],
	width: 720,
	height: 300,
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
		run.scheduleOnce('render', this, this.drawLegendPie)
	},

	drawLegendPie() {
		let svg = d3.select(this.element)
		let width = get(this, 'width')
		let height = get(this, 'height')

		let margin = this.get('margin');
		// let width = 500 - margin.left - margin.right;
		// let height = 400 - margin.top - margin.bottom;
		let radius = 130;
		var pieData = this.get('pieData');
		var dataTitle = [];
		var pieColor = [];
		var pieValue = [];

		pieData.map(function(item, index) {
			dataTitle.push(item.prov);
		});
		pieData.map(function(item, index) {
			pieColor.push(item.color);
		});
		pieData.map(function(item, index) {
			pieValue.push(item.share);
		});
		var outerRadius = 140;
		var innerRadius = 85;
		let data = pieValue;
		let color = pieColor
		// var arc = d3.arc()
		// 	.outerRadius(radius);

		let arc = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		let arc2 = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius + 10)
		var pie = d3.pie()
			.value(function(d) {
				return d.share
			})

		svg
			.datum(pieData)
			// .datum(function() {
			// 	return d.share
			// })
			.attr("width", '100%')
			.attr("height", height)
			.attr('viewBox', '0 0 ' + 300 + ' ' + 300)
			.attr('preserveAspectRatio', 'xMidYMid', 'meet')
			.append("g")
			.attr("transform", "translate(" + 130 + "," + 150 + ")");
		var tooltip = svg
			.append("div")
			.attr("class", "tooltip");
		var arcs = svg.selectAll("g.arc")
			.data(pie)
			.enter().append("g")
			.attr("class", "arc")
			// 将g移至中间
			.attr("transform", "translate(100,150)")
			//为每一块元素添加鼠标事件
			.on("mouseover", function(d) {
				let left = arc.centroid(d)[0];
				let top = arc.centroid(d)[1];
				d3.select(this).select("path").transition().attr("d", function(d) {
					return arc2(d);
				})
				// tooltip
				d3.select(".tooltip")
					.style("left", left + "px")
					.style("top", top + "px")
					.style("opacity", 1)
					// .html(d.data.prod + '</br>' + "销售额" + d.data.sales)
					// .select("#value")
					// .append('p')
					// .attr('class', 'tip-title')
					// .append('span')
					// .attr('class', 'prod-color')
					.text(d.data.prov);
				// d3.select('.tip-title')
				// 	.append('text')
				// 	.text(d.data.prod)
			})

			.on("mouseout", function(d) {
				d3.select(this).select("path").transition().attr("d", function(d) {
					return arc(d);
				})
				d3.select(".tooltip").style("opacity", 0.0);
			});

		//绘制图例区域
		// var color = d3.scaleOrdinal(d3.schemeCategory10);
		var legendArea = svg.append("g")
			.attr("transform", "translate(80,15)");

		//绑定数据，设置每个图例的位置
		var legend = legendArea.selectAll("g")
			.data(pieData)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {
				return "translate(200," + i * 30 + ")";
			});
		//添加图例的矩形色块
		legend.append("circle")
			.attr("cx", 10)
			.attr("cy", 10)
			.attr('r', 5)
			.style("fill", function(d, i) {
				return color[i]
			});

		//添加图例文字
		legend.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr('class', 'legend-text')
			.style("fill", function(d, i) {
				// return color[i];
				return '#485465'
			})
			.style('font-size', '12px')
			.attr("dy", ".35em")
			.text(function(d, i) {
				return d.prov;
				// return "sex";

			});


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
				// console.log(arc.centroid(d));
				// console.log(d)
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