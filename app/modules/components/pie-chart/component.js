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
		// this.dataValue = [1,4,6,4];
		this.margin = {
			top: 40,
			right: 20,
			bottom: 30,
			left: 20
		};
		// this.pieData = [];
			/*{
					'prod': '产品一',
					'sales': 12,
					'cont': 455,
					'color': '#3399FF',
				}, {
					'prod': '产品二',
					'sales': 135,
					'cont': 845,
					'color': 'orange',
				}, {
					'prod': '产品三',
					'sales': 647,
					'cont': 256,
					'color': 'lightyellow',
				}, {
					'prod': '产品四',
					'sales': 13422,
					'cont': 452,
					'color': 'lightgreen',
				}, {
					'prod': '产品5',
					'sales': 13422,
					'cont': 411,
					'color': 'blue',
				}, {
					'prod': '产品6',
					'sales': 13422,
					'cont': 421,
					'color': 'lightblue',
				}, {
					'prod': '产品7',
					'sales': 13422,
					'cont': 444,
					'color': 'pink'
				}, {
					'prod': '产品8',
					'sales': 13422,
					'cont': 422,
					'color': 'lightgray'
				}, {
					'prod': '其他',
					'sales': 34,
					'cont': 175,
					'color': 'skyblue'
				},
			*/
		// ];
	},
	/*
		didInsertElement() {
			this._super(...arguments);

			// add tooltip
			var tooltip = d3.select(this.$('#pie-chart')[0])
				.append("div")
				.attr("class", "tooltip");
			var arcs = svg.selectAll("g.arc")
				.data(pie)
				.enter().append("g")
				.attr("class", "arc")
				// 将g移至中间
				// .attr("transform", "translate(0,0)")
				//为每一块元素添加鼠标事件
				.on("mouseover", function(d) {
					console.log(d);
					let left = 135 + arc.centroid(d)[0];
					let top = 135 + arc.centroid(d)[1];
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
						.text(d.data.prod);
					// d3.select('.tip-title')
					// 	.append('text')
					// 	.text(d.data.prod)
				})

				.on("mouseout", function(d) {
					d3.select(this).select("path").transition().attr("d", function(d) {
						return arc(d);
					})
					d3.select(".tooltip").style("opacity", 0.0);
				})
			// arcs.append('text')
			//     .attr('transform',)
			// arc.append("text")
			//      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
			//      .attr("dy", "0.35em")
			//      .text(function(d) { return d.data.age; });
			// var legend = d3.select(this.$('#pie-chart')[0]).append("svg")
			// 	.attr("class", "legend")
			// 	.attr("width", 120)
			// 	.attr("height", 300)
			// 	.selectAll("g")
			// 	.data(arr.slice(1).reverse())
			// 	.enter().append("g")
			// 	.attr("transform", function(d, i) {
			// 		return "translate(0," + i * 40 + ")";
			// 	});

			// legend.append("circle")
			// 	.attr("cx", 15)
			// 	.attr("cy", 15)
			// 	.attr("r", 10)
			// 	.style("fill", "red");
			//
			// legend.append("text")
			// 	.attr("x", 24)
			// 	.attr("y", 9)
			// 	.attr("dy", ".35em")
			// 	.text(function(d) {
			// 		return d;
			// 	});

			// var arr = [{age:"1",pp:"22"},{age:"2",pp:"22"},{age:"3",pp:"22"},{age:"4",pp:"22"},{age:"5",pp:"22"},{age:"6",pp:"22"},{age:"7",pp:"22"} ];
			//   console.info(arr);
			//   arr.forEach(function(d) {
			//     var c = labelArc.centroid(d);
			// //     console.log(c);
			// //     console.log(d);
			//     context.fillText(d.age, c[0], c[1]);
			//     console.info(d.age)
			//   });

		},
	*/
	didReceiveAttrs() {
		run.schedule('render', this, this.drawPie)
	},

	drawPie() {
		let svg = d3.select(this.element)
		// let data = get(this, 'data')
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
		console.log('this is from pie-chart')
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
