import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';
// import { select } from 'd3-selection';

export default Component.extend({
	classNames: ['mirror-bar'],
	elementId: 'mirrorChart',
	init() {
		this._super(...arguments);
		this.set('currentData', [
			{ marketSales: 3357.27, area: '江苏省', lastRank: 33 },
			{ marketSales: 2347.09, area: '山东省', lastRank: 13 },
			{ marketSales: 1345.27, area: '广东省', lastRank: 3 },
			{ marketSales: 1337.89, area: '浙江省', lastRank: 9 },
			{ marketSales: 1334.65, area: '河南省', lastRank: 7 },
			{ marketSales: 310.74, area: '河北省', lastRank: 5 },
			{ marketSales: 1331.74, area: '黑龙江省', lastRank: 1 },
			{ marketSales: 1310.74, area: '湖南省', lastRank: 2 },
			{ marketSales: 1320.74, area: '陕西省', lastRank: 8 },
			{ marketSales: 130.74, area: '新疆省', lastRank: 12 }
		]);
	},
	didReceiveAttrs() {
		run.scheduleOnce('render', this, this.drawChart);
	},
	removeExistsSvg(id) {
		d3.select(`#${id}`).select('svg').remove();
	},
	initSvgContainer(id, direction) {
		let height = this.get('height');

		if (direction === 'left') {
			return d3.select(`#${id}`).append('svg')
				.attr('width', this.get('leftWidth'))
				.attr('height', height)
				.attr('class', 'svg-container');
		}
		return d3.select(`#${id}`).append('svg')
			.attr('width', this.get('rightWidth'))
			.attr('height', height)
			.attr('class', 'svg-container');

	},
	generateRightBar(svg, data, spacing, width, x) {
		let bar = null;

		bar = svg.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', function (d, i) {
				return `translate(${spacing},${i * 50 + 20})`;
			});
		bar.append('rect')
			.transition()
			.duration(1000)
			.attr('class', 'bar bar-right')
			.attr('fill', '#5E81CF')
			.attr('width', d => x(d.marketSales))
			.attr('height', 20 - 1);
		bar.append('text')
			// .attr('x', function (d) {
			// 	return x(d.marketSales) - 3;
			// })
			.attr('x', -spacing)
			.attr('y', 20 / 2)
			.attr('dy', '.35em')
			.text(function (d, index) {
				let area = d.area.slice(0, 3),
					lastRank = d.lastRank,
					currentRank = index + 1;

				if (lastRank < 10) {
					lastRank = '0' + lastRank;
				}
				if (currentRank < 10) {
					currentRank = '0' + currentRank;
				}
				return `${lastRank}. ${area} ${currentRank}.`;
			});

	},
	generateLeftBar(svg, data, width, x) {
		svg.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', function (d, i) {
				return `translate(${width}, ${i * 50 + 20})`;
			})
			.append('rect')
			.transition()
			.duration(1000)
			.attr('class', 'bar bar-left')
			.attr('fill', '#5E81CF')
			.attr('x', (d) => {
				return x(d.marketSales) * -1;
			})
			.attr('width', (d) => {
				return x(d.marketSales);
			})
			.attr('height', 20 - 1);

	},
	drawChart() {
		let id = this.get('elementId'),
			currentData = this.get('currentData'),
			currentXData = currentData.map(ele => ele.marketSales),
			maxXData = Math.ceil(Math.max.apply(null, currentXData)),
			leftWidth = this.get('leftWidth'),
			rightWidth = this.get('rightWidth'),
			spacing = 110,
			svg = null,
			svgRight = null,
			// y = null,
			xLeft = null,
			xRight = null;

		xLeft = d3.scaleLinear()
			.domain([0, maxXData])
			.range([0, this.get('leftWidth')]);

		xRight = d3.scaleLinear()
			.domain([0, maxXData])
			.range([0, this.get('rightWidth') - spacing]);

		// y = d3.scaleBand()
		// 	.range([0, this.get('height')])
		// 	.padding(0, 4);
		d3.scaleBand()
			.range([0, this.get('height')])
			.padding(0, 4);
		// yAxisRight = d3.axisLeft()
		// 	.scale(y)
		// 	.tickSize(0)
		// 	.tickPadding(6);
		/* resort Data */

		this.removeExistsSvg(id);
		svg = this.initSvgContainer(id, 'left');

		svgRight = this.initSvgContainer(id, 'right');

		/* 右半拉 */
		this.generateRightBar(svgRight, currentData, spacing, rightWidth, xRight);

		/* 左半拉 */
		this.generateLeftBar(svg, currentData, leftWidth, xLeft);

	}

});
