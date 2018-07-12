import Component from '@ember/component';
import d3 from 'd3';

export default Component.extend({
	tagName: 'div',
	classNames: ['prod-sales-container'],
	init() {
		this._super(...arguments);
		// this.line = {
		// 	title: '辉瑞产品选择',
		// 	time: '2018.01-2018.07',
		// 	currentMonth: '2018-04',
		// 	curMoSales: 9935.4,
		// 	yearYear: 4.3,
		// 	ring: 4.3,
		// 	totle: 146534563,
		// 	ave: 34572452,
		// };
		this.testData = [{
			date: '2018-01',
			sales: '400'
		}, {
			date: '2018-02',
			sales: '700'
		}, {
			date: '2018-03',
			sales: '500'
		}, {
			date: '2018-04',
			sales: '500'
		}, {
			date: '2018-05',
			sales: '700'
		}, {
			date: '2018-06',
			sales: '500'
		}, {
			date: '2018-07',
			sales: '800'
		}, {
			date: '2018-08',
			sales: 0
		}, {
			date: '2018-09',
			sales: 0
		}, {
			date: '2018-10',
			sales: 0
		}, {
			date: '2018-11',
			sales: 0
		}, {
			date: '2018-12',
			sales: 0
		}, ]
	},
	didInsertElement() {
		this._super(...arguments);
		let predata = this.get('tableData');

		let data = [];
		predata.map(function(item, index) {
			let itemObject = {};
			itemObject.date = new Date(item.date);
			itemObject.sales = item.sales;
			data.push(itemObject)
		})
		// 定义circle的半径
		let r0 = 2,
			r1 = 5;
		// 定义动画持续时间
		var duration = 300;
		var margin = {
				top: 40,
				right: 20,
				bottom: 30,
				left: 20
			},

			// width = document.body.clientWidth - margin.left - margin.right,
			width = this.$('#prod-sales').width() - margin.left - margin.right,
			// height = 380 - margin.top - margin.bottom;
			height = 210;
		//	var parseDate = d3.time.format('%Y-%m-%d').parse;	//v3
		var parseDate = d3.timeFormat('%Y-%m'); //v4

		// var x = d3.time.scale()
		var x = d3.scaleTime()
			// .domain([0, 100])
			.range([0, width - 20]);

		// var y = d3.scale.linear()	//v3
		var y = d3.scaleLinear()

			// .domain([0, 100])
			.range([height, 0]);

		// var xAxis = d3.svg.axis()		//v3
		var xAxis = d3.axisBottom()
			.scale(x)
			// .orient('bottom')
			// .tickFormat(function(d, i) {
			//   // return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
			//   // return [d.getMonth() + 1, d.getDate()].join('-');
			//   var date = d.getDate();
			//   return date < 10 ? '0' + date : date;
			// })
			// 相同的效果
			.tickFormat(d3.timeFormat('%Y-%m'))
			.ticks(data.length);

		var yAxis = d3.axisLeft()
			.scale(y)
			// .orient('left')
			.ticks(6);

		var xGridAxis = d3.axisBottom()
			.scale(x)
		// .orient('bottom');

		var yGridAxis = d3.axisLeft()
			.scale(y)
		// .orient('left');

		// 	var line = d3.svg.line()	//v3
		var line = d3.line()

			.x(function(d) {
				return x(d.date);
			})
			.y(function(d) {
				// return y(d.pv);
				return y(d.sales)
			})
			.curve(d3.curveLinear)
		// .attr('box-shadow', '0 2px 3px 0 rgba(0,0,0,0.50)')
		// .interpolate('monotone');

		var flagLine = d3.line()
			.x(function(d) {
				return x(d.x);
			})
			.y(function(d) {
				return y(d.y);
			});

		var container = d3.select(this.$('#prod-sales')[0])
			.append('svg')
			.attr("width", '100%')
			.attr('height', height + margin.top + margin.bottom)
			.attr('viewBox', '0 0 560 280')
			.attr('preserveAspectRatio', 'xMinYMid', 'meet')
		// .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');

		var svg;

		show();

		function show() {

			svg = container.append('g')
				.attr('class', 'content')
				.attr('class', 'col-md-12')
				.attr('transform', 'translate(' + 30 + ',' + margin.top + ')');

			function draw() {
				data.forEach(function(d) {
					d.dayText = parseDate(d.date);
					// d.dayText = d.date
					d.date = d.date;
					// d.pv = +d.pv;
					d.sales = d.sales
				});
				let yMax = d3.max(data, function(d) {
					// return d.pv;
					return d.sales;
				});
				x.domain(d3.extent(data, function(d) {
					return d.date;
				}));
				y.domain([0, (yMax / 3 + yMax)]);

				svg.append('text')
					.attr('class', 'title')
					.text('产品销售额')
					.attr('x', width / 2)
					.attr('y', height + 30);

				svg.append('g')
					.attr('class', 'x axis')
					.attr('transform', 'translate(0,' + height + ')')
					.call(xAxis)
				// .append('text')
				// .text('日期')
				// .attr('transform', 'translate(' + (width - 20) + ', 0)');

				svg.append('g')
					.attr('class', 'y axis')
					.call(yAxis)
				// .append('text')
				// .text('次/天');

				// svg.append('g')
				//   .attr('class', 'grid')
				//   .attr('transform', 'translate(0,' + height + ')')
				//   .call(xGridAxis.tickSize(-height, 0, 0).tickFormat(''));

				// svg.append('g')
				//   .attr('class', 'grid')
				//   .call(yGridAxis.tickSize(-width, 0, 0).tickFormat(''));

				var path = svg.append('path')
					.attr('class', 'line')
					.attr('d', line(data));

				var g = svg.selectAll('circle')
					.data(data)
					.enter()
					.append('g')
					.append('circle')
					.attr('class', 'linecircle')
					.attr('cx', line.x())
					.attr('cy', line.y())
					.attr('r', r0)
					.on('mouseover', function() {
						d3.select(this).transition().duration(duration).attr('r', r1);
					})
					.on('mouseout', function() {
						d3.select(this).transition().duration(duration).attr('r', r0);
					});

				// svg.append('line')
				//   .attr('class', 'flag')
				//   .attr('x1', 0)
				//   .attr('y1', 0)
				//   .attr('x2', 0)
				//   .attr('y2', y(0));

				var tips = svg.append('g').attr('class', 'tips');

				tips.append('rect')
					.attr('class', 'tips-border')
					.attr('width', 200)
					.attr('height', 50)
					.attr('rx', 10)
					.attr('ry', 10);

				var wording1 = tips.append('text')
					.attr('class', 'tips-text')
					.attr('x', 10)
					.attr('y', 20)
					.text('');

				var wording2 = tips.append('text')
					.attr('class', 'tips-text')
					.attr('x', 10)
					.attr('y', 40)
					.text('');

				container
					.on('mousemove', function() {
						var m = d3.mouse(this),
							cx = m[0] - margin.left;

						showWording(cx);

						d3.select('.tips').style('display', 'block');
					})
					.on('mouseout', function() {
						d3.select('.tips').style('display', 'none');
					});


				function redrawLine(cx, cy) {
					if (cx < 0) d3.select('.flag').style('display', 'none');
					else
						d3.select('.flag')
						.attr('x1', cx)
						.attr('x2', cx)
						.style('display', 'block');
					showWording(cx);
				}

				function showTips(cx, cy) {
					cy -= 50;
					if (cy < 0) cy += 100;
					d3.select('.tips')
						.attr('transform', 'translate(' + cx + ',' + cy + ')')
						.style('display', 'block');
				}

				function showWording(cx) {
					var x0 = x.invert(cx);
					var i = (d3.bisector(function(d) {
						return d.date;
					}).left)(data, x0, 1);

					var d0 = data[i - 1],
						d1 = data[i] || {},
						d = x0 - d0.date > d1.date - x0 ? d1 : d0;

					function formatWording(d) {
						return '日期：' + d3.timeFormat('%Y-%m-%d')(d.date);
					}
					wording1.text(formatWording(d));
					// wording2.text('PV：' + d.pv);
					wording2.text('销售额：' + d.sales)
					var x1 = x(d.date),
						// y1 = y(d.pv);
						y1 = y(d.sales)


					// 处理超出边界的情况
					var dx = x1 > width ? x1 - width + 200 : x1 + 200 > width ? 200 : 0;

					var dy = y1 > height ? y1 - height + 50 : y1 + 50 > height ? 50 : 0;

					x1 -= dx;
					y1 -= dy;

					d3.select('.tips')
						.attr('transform', 'translate(' + x1 + ',' + y1 + ')');
				}
			}

			draw();
		}
	}
});