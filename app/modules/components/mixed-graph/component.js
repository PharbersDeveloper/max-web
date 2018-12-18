import Component from '@ember/component';
import { run } from '@ember/runloop';
import { inject } from '@ember/service';
import d3 from 'd3';

export default Component.extend({
	i18n: inject(),
	tagName: 'div',
	classNames: ['mixed-graph'],
	init() {
		this._super(...arguments);
	},
	didReceiveAttrs() {
		this._super(...arguments);
		run.scheduleOnce('render', this, this.drawMixedGraph);
	},
	drawMixedGraph() {
		if (this.get('mixedGraphData').length === 0) {
			return;
		}
		d3.select('svg.mixed-graph-svg').remove();
		d3.select('.tooltips').remove();

		let svgContainer = d3.select(this.element),
			svg = svgContainer.append('svg')
				.attr('class', 'mixed-graph-svg'),
			data = this.get('mixedGraphData'),
			handledData = [],
			tempInside = null,
			margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 40
			},
			// let legendTitle = [
			// 	// '市场规模',
			// 	String(this.i18n.t('biDashboard.common.marketSize')),
			// 	// '产品销售额',
			// 	String(this.i18n.t('biDashboard.common.prodSales')),
			// 	// '市场增长率',
			// 	String(this.i18n.t('biDashboard.common.marketGrowth')),
			// 	// '产品增长率'
			// 	String(this.i18n.t('biDashboard.common.prodGrowth'))
			// ];
			legendColor = ['#53A8E2', '#58D8FC', '#FA687A', '#76FFE0'],
			width = 900,
			height = 360,
			// 显示多少个柱状
			numBars = 14,

			x = d3.scaleBand()
				.rangeRound([0, width])
				.padding(0.1),

			y = d3.scaleLinear()
				.rangeRound([height, 0]),

			y1 = d3.scaleLinear()
				.rangeRound([height, 0]),

			xAxis = d3.axisBottom()
				.scale(x),

			yAxis = d3.axisLeft()
				.scale(y)
				.ticks(10),
			yAxisRight = null,
			diagram = null,
			scaleMax = null,
			salesMax = null,
			marketMax = null,
			marketMin = null,
			prodMax = null,
			prodMin = null,
			minimum = 0,
			bars = null,
			// svg.selectAll(".bar")
			scaleBar = null,
			marketGrowth = null,
			prodGrowth = null,
			initLine = null,
			legendArea = null,
			// xOverview = null,
			yOverview = null;

		data.forEach(function (d) {
			tempInside = {
				province: '',
				scale: '',
				sales: '',
				'market_growth': '',
				'prod_growth': ''
			};

			tempInside.province = String(d.province);
			tempInside.scale = d.scale;
			tempInside.sales = d.sales;
			tempInside['market_growth'] = Number(d.market_growth);
			tempInside['prod_growth'] = Number(d.prod_growth);
			handledData.push(tempInside);
		});

		// 定义提示区
		svgContainer
			.append('div')
			.attr('class', 'tooltips');
		// 添加网格线

		function makeYGridlines() {
			return d3.axisLeft(y)
				.ticks(7);
		}
		// create right yAxis
		yAxisRight = d3.axisRight()
			.scale(y1)
			.ticks(10);
		diagram = svg
			// .attr("height", height + margin.top + margin.bottom)
			.attr('width', '100%')
			.attr('height', 420)
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', '-20 0 950 420')
			.append('g')
			// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

		x.domain(handledData.slice(0, numBars).map(function (d) {
			return d.province;
		}));
		// 左Y轴的最大值
		// 市场规模
		scaleMax = d3.max(handledData, function (d) {
			return d.scale;
		});
		//  市场销售额
		salesMax = d3.max(handledData, function (d) {
			return d.sales;
		});

		if (scaleMax > salesMax) {
			y.domain([0, scaleMax + scaleMax / 3]);
		} else {
			y.domain([0, salesMax + salesMax / 3]);
		}
		//  右Y轴的最大值以及最小值
		marketMax = d3.max(handledData, function (d) {
			return d.market_growth;
		});
		marketMin = d3.min(handledData, function (d) {
			return d.market_growth;
		});
		prodMax = d3.max(handledData, function (d) {
			return d.prod_growth;
		});
		prodMin = d3.min(handledData, function (d) {
			return d.prod_growth;
		});
		minimum = 0;

		if (marketMin < prodMin) {
			minimum = marketMin;
		} else {
			minimum = prodMin;
		}
		if (marketMax > prodMax) {
			if (minimum < 0) {
				y1.domain([minimum / 3 + minimum, marketMax + marketMax / 3]);
			} else {
				y1.domain([minimum - minimum / 3, marketMax + marketMax / 3]);
			}
		} else if (minimum < 0) {
			y1.domain([minimum / 3 + minimum, prodMax + prodMax / 3]);
		} else {
			y1.domain([minimum - minimum / 3, prodMax + prodMax / 3]);
		}
		svg.append('g')
			.attr('class', 'x axis xaxis')
			// .attr("transform", "translate(-3," + height + ")")
			.attr('transform', 'translate(-10,' + height + ')')
			.call(xAxis);

		svg.append('g').attr('class', 'y axis')
			.call(yAxis)
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('scale');
		svg.append('g')
			.attr('class', 'grid')
			.call(makeYGridlines().tickSize(-width)
				.tickFormat('')
			);
		svg.append('g')
			.attr('class', 'y axis axisRight')
			.attr('transform', 'translate(' + width + ',0)')
			.call(yAxisRight)
			.append('text')
			.attr('y', 6)
			.attr('dy', '-2em')
			.attr('dx', '2em')
			.style('text-anchor', 'end')
			.text('#');
		svg.selectAll('.bar');
		bars = svg.append('g');
		// svg.selectAll(".bar")
		scaleBar = bars.selectAll('.bar')
			// .data(data)
			.data(handledData.slice(0, numBars), function (d) {
				return d.province;
			})
			.enter().append('rect')
			.attr('y', 500)
			// .transition().duration(1000)
			.attr('class', 'bar')
			.attr('x', function (d) {
				return x(d.province);
			})
			.attr('width', 18)
			// .attr('width', x.bandwidth()/2)
			.attr('y', function (d) {
				return y(d.scale);
			})
			.attr('height', function (d) {
				return height - y(d.scale);
			});

		scaleBar.transition()
			.duration(1000);

		function makeTooltip(d, xPosition, yPosition) {
			let scale = null,
				sales = null,
				market = null,
				prod = null;

			d3.select('.tooltips')
				.style('left', xPosition + 'px')
				.style('top', yPosition + 'px')
				.html("<p class='' >" + d.province + '</p>' +
					"<p class='scale-bar'>" + '<span>市场规模</span>' + '<span>' + d.scale + 'Mil</span></p>' +
					"<p class='sales-bar'>" + '<span>产品销售额</span>' + '<span>' + d.sales + 'Mil</span></p>' +
					"<p class='market_line'>" + '<span>市场增长率</span>' + '<span>' + d.market_growth + '%</span></p>' +
					"<p class='prod_line'>" + '<span>产品增长率</span>' + '<span>' + d.prod_growth + '%</span></p>')
				.style('opacity', 0.65);
			scale = d3.selectAll('.scale-bar').insert('svg', '.scale-bar span:first-child').attr('class', 'little-legend');

			scale.append('g').selectAll('rect')
				.data(['scale'])
				.enter().append('rect')
				.attr('class', 'scale-icon')
				.attr('x', 5)
				.attr('width', 10)
				.attr('height', 20)
				.attr('fill', legendColor[0]);
			sales = d3.selectAll('.sales-bar').insert('svg', '.sales-bar span:first-child').attr('class', 'little-legend');

			sales.append('g').selectAll('rect')
				.data(['sales'])
				.enter().append('rect')
				.attr('class', 'sales-icon')
				.attr('x', 5)
				.attr('width', 10)
				.attr('height', 20)
				.attr('fill', legendColor[1]);
			market = d3.select('.market_line').insert('svg', '.market_line span:first-child').attr('class', 'little-legend');

			market.selectAll('line')
				.data(['market_growth'])
				.enter()
				.append('line')
				.attr('x1', 5)
				.attr('x2', 15)
				.attr('y1', 15)
				.attr('y2', 15)
				.attr('stroke', legendColor[2])
				.attr('stroke-width', '3')
				.attr('fill', legendColor[2]);
			prod = d3.select('.prod_line').insert('svg', '.prod_line span:first-child').attr('class', 'little-legend');

			prod.selectAll('line')
				.data(['prod_growth'])
				.enter()
				.append('line')
				.attr('x1', 5)
				.attr('x2', 15)
				.attr('y1', 15)
				.attr('y2', 15)
				.attr('stroke', legendColor[3])
				.attr('stroke-width', '3')
				.attr('fill', legendColor[3]);
		}
		scaleBar.on('mouseover', function (d) {
			let xPosition = parseFloat(d3.select(this).attr('x')),
				yPosition = parseFloat(d3.select(this).attr('y')) / 2;

			makeTooltip(d, xPosition, yPosition);
		})
			.on('mouseout', function () {
				d3.select('.tooltips')
					.style('opacity', 0);
			});

		bars.selectAll('.bar2')
			.data(handledData.slice(0, numBars), function (d) {
				return d.province;
			})
			.enter().append('rect')
			.attr('class', 'bar2')
			.attr('x', function (d) {
				return x(d.province) + 18;
			})
			.attr('width', 18)
			.attr('y', function (d) {
				return y(d.sales);
			})
			.attr('height', function (d) {
				return height - y(d.sales);
			})
			.on('mouseover', function (d) {
				let xPosition = parseFloat(d3.select(this).attr('x')),
					yPosition = parseFloat(d3.select(this).attr('y')) / 2;

				makeTooltip(d, xPosition, yPosition);
			})
			.on('mouseout', function () {
				d3.select('.tooltips')
					.style('opacity', 0);
			});
		// 绘制市场增长折线图
		marketGrowth = d3.line()
			.x(function (d) {
				return x(d.province);
			})
			.y(function (d) {
				return y1(d.market_growth);
			});
		prodGrowth = d3.line()
			.x(function (d) {
				return x(d.province);
			})
			.y(function (d) {
				return y1(d.prod_growth);
			});

		initLine = handledData.slice(0, numBars);

		svg.append('path')
			.data([initLine])
			.attr('class', 'mixedline')
			.style('stroke', '#FA6F80')
			.attr('transform', 'translate(18,' + 0 + ')')
			// .style("filter", "url(#drop-shadow)")
			.attr('d', marketGrowth);
		// 为折线添加点
		// let circleFormarket = svg.selectAll('circle')
		//     .data(data)
		//     .enter()
		//     .append('g')
		//     .append('circle')
		//     .attr('class', 'market-circle')
		//     .attr('cx', marketGrowth.x())
		//     .attr('cy', marketGrowth.y())
		//     .attr('r', 3)
		//     .on('mouseover', function() {
		//         d3.select(this).transition().duration(500).attr('r', 5)
		//     })
		//     .on('mouseout', function() {
		//         d3.select(this).transition().duration(500).attr('r', 3)
		//     })
		// 绘制产品增长折线图
		svg.append('path')
			.data([initLine])
			.attr('class', 'mixedline2')
			.style('stroke', '#7CFFE2')
			.attr('transform', 'translate(18,' + 0 + ')')
			// .style("filter", "url(#drop-shadow)")
			.attr('d', prodGrowth);
		/**
         *   绘制提示区
         */

		/**
         * 绘制图例区域
         */
		legendArea = svg.append('g')
			.attr('transform', 'translate(' + width / 4 + ',410)')
			.attr('class', 'legendArea');

		legendArea.selectAll('rect')
			.data(['scale', 'sales'])
			.enter().append('rect')
			.attr('class', d => d)
			.attr('x', (d, i) => width / 8 * i)
			.attr('width', 10)
			.attr('height', 20)
			.attr('fill', (d, i) => legendColor[i]);

		legendArea.append('rect')
			.attr('class', 'outline')
			.attr('width', width)
			.attr('height', 20);

		legendArea.selectAll('line')
			.data(['market_growth', 'prod_growth'])
			.enter()
			.append('line')
			.attr('x1', function (d, i) {
				return width / 8 * (i + 2);
			})
			.attr('x2', function (d, i) {
				return width / 8 * (i + 2) + 10;
			})
			.attr('y1', 3)
			.attr('y2', 3)
			.attr('stroke', (d, i) => legendColor[i + 2])
			.attr('stroke-width', '3')
			.attr('fill', (d, i) => legendColor[i + 2]);

		legendArea.selectAll('text')
			.data(['市场规模', '产品销售额', '市场增长率', '产品增长率'])
			.enter().append('text')
			.attr('class', 'legend-label')
			.attr('x', (d, i) => width / 8 * i + 15)
			.attr('y', 2)
			.attr('dy', 5)
			.text(d => d);
		// 添加图例

		// function type(d) {
		// 	d.sales = Number(d.sales);
		// 	return d;
		// }
		// 设置滑动区域
		// if (true) {
		d3.scaleBand()
			.domain(handledData.map(function (d) {
				return d.province;
			}))
			.rangeRound([0, width])
			.padding(0.2);
		yOverview = d3.scaleLinear().range([30, 0]);

		yOverview.domain(y.domain());


		// }

		function display() {
			let displayed = d3.scaleQuantize()
					.domain([0, width])
					.range(d3.range(handledData.length)),
				xinside = parseInt(d3.select(this).attr('x'), 10),
				nx = xinside + d3.event.dx,
				w = parseInt(d3.select(this).attr('width'), 10),
				f = null,
				nf = null,
				newData = null,
				rects = null,
				rects2 = null;

			if (nx < 0 || nx + w > width) {
				return;
			}
			d3.select(this).attr('x', nx);

			f = displayed(xinside);
			nf = displayed(nx);

			if (f === nf) {
				return;
			}
			newData = handledData.slice(nf, nf + numBars);
			x.domain(newData.map(function (d) {
				return d.province;
			}));
			svg.select('.x.axis').call(xAxis);

			// let rects = bars.selectAll("rect")
			bars.selectAll('.bar').remove();
			rects = bars.selectAll('.bar')
				.data(newData, function (d) {
					return d.province;
				});

			bars.selectAll('.bar2').remove();

			rects2 = bars.selectAll('.bar2')
				.data(newData, function (d) {
					return d.province;
				});

			rects.attr('x', function (d) {
				return x(d.province);
			});
			rects2.attr('x', function (d) {
				return x(d.province) + 18;
			});
			svg.selectAll('.mixedline')
				.data([newData])
				.attr('class', 'mixedline')
				.style('stroke', '#FA6F80')
				.attr('transform', 'translate(18,' + 0 + ')')
				// .style("filter", "url(#drop-shadow)")
				.attr('d', marketGrowth);
			// svg.append("path")
			svg.selectAll('.mixedline2')
				.data([newData])
				.attr('class', 'mixedline2')
				.style('stroke', '#7CFFE2')
				.attr('transform', 'translate(18,' + 0 + ')')
				// .style("filter", "url(#drop-shadow)")
				.attr('d', prodGrowth);

			rects.enter().append('rect')
				.attr('class', 'bar')
				.attr('x', function (d) {
					return x(d.province);
				})
				.attr('y', function (d) {
					return y(d.scale);
				})
				.attr('width', 18)
				.attr('height', function (d) {
					return height - y(d.scale);
				}).on('mouseover', function (d) {
					let xPosition = parseFloat(d3.select(this).attr('x')),
						yPosition = parseFloat(d3.select(this).attr('y')) / 2;

					makeTooltip(d, xPosition, yPosition);
				})
				.on('mouseout', function () {
					d3.select('.tooltips')
						.style('opacity', 0);
				});
			rects2.enter().append('rect')
				.attr('class', 'bar2')
				.attr('x', function (d) {
					return x(d.province) + 18;
				})
				.attr('y', function (d) {
					return y(d.sales);
				})
				.attr('width', 18)
				.attr('height', function (d) {
					return height - y(d.sales);
				}).on('mouseover', function (d) {
					let xPosition = parseFloat(d3.select(this).attr('x')),
						yPosition = parseFloat(d3.select(this).attr('y')) / 2;

					makeTooltip(d, xPosition, yPosition);
				})
				.on('mouseout', function () {
					d3.select('.tooltips')
						.style('opacity', 0);
				});

		}
		diagram.append('rect')
			.attr('transform', 'translate(0, ' + (height + margin.bottom) + ')')
			.attr('class', 'mover')
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', 10)
			.attr('width', Math.round(parseFloat(numBars * width) / handledData.length))
			.attr('pointer-events', 'all')
			.attr('cursor', 'ew-resize')
			.call(d3.drag().on('drag', display));
	}


});