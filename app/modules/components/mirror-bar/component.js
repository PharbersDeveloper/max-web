import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';
// import { select } from 'd3-selection';

export default Component.extend({
	classNames: ['mirror-bar'],

	didReceiveAttrs() {
		let data = this.get('data');

		if (typeof data !== 'undefined') {
			run.scheduleOnce('render', this, this.drawChart);
		}
	},
	removeExistsSvg(id) {
		d3.select(`#${id}`).select('svg').remove();
	},
	initSvgContainer(id, width, height) {
		return d3.select(`#${id}`).append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'svg-container');
	},
	generateRightBar(svg, data, spacing, x, tooltip) {
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
			.attr('class', 'space-text')
			.attr('x', (spacing - 110) / 2 - spacing)
			.attr('y', 20 / 2)
			.attr('dy', '.35em')
			.text(function (d, index) {
				let area = d.area,
					lastRank = Number(d.lastYearRank) + 1,
					currentRank = index + 1;

				if (area.slice(-1) !== '市') {
					area = (area + '省').slice(0, 3);
				}
				if (lastRank < 10) {
					lastRank = '0' + lastRank;
				}
				if (currentRank < 10) {
					currentRank = '0' + currentRank;
				}
				return `${lastRank}. ${area} ${currentRank}.`;
			});
		bar.on('mouseover', (d) => {
			tooltip.html(() => {
				return `<p class='title'>${d.area}</p>
							<p class='content'>市场销售额： ${d.marketSales} Mil</p>
							<p class='content'>产品销售额： ${d.productSales} Mil</p>
							<p class='content'>份额： ${(d.percentage * 100).toFixed(2)} %</p>`;

			});
			tooltip.style('display', 'block');
			tooltip.style('opacity', 0.9);

		})
			.on('mousemove', () => {
				tooltip.style('top', d3.event.layerY + 10 + 'px')
					.style('left', d3.event.layerX - 25 + 'px');
			})
			.on('mouseout', () => {
				tooltip.style('display', 'none');
				tooltip.style('opacity', 0);
			});

	},
	generateLeftBar(svg, data, width, x, tooltip) {
		let rect = null;

		rect = svg.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', function (d, i) {
				return `translate(${width}, ${i * 50 + 20})`;
			})
			.append('rect');

		rect.transition()
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

		rect.on('mouseover', (d) => {
			tooltip.html(() => {
				return `<p class='title'>${d.area}</p>
							<p class='content'>市场销售额： ${d.marketSales} Mil</p>
							<p class='content'>产品销售额： ${d.productSales} Mil</p>
							<p class='content'>份额： ${(d.percentage * 100).toFixed(2)} %</p>`;

			});
			tooltip.style('display', 'block');
			tooltip.style('opacity', 0.9);

		})
			.on('mousemove', () => {
				tooltip.style('top', d3.event.layerY + 10 + 'px')
					.style('left', d3.event.layerX - 25 + 'px');
			})
			.on('mouseout', () => {
				tooltip.style('display', 'none');
				tooltip.style('opacity', 0);
			});
	},
	drawChart() {
		let id = this.get('elementId'),
			currentData = this.get('data.current'),
			lastData = this.get('data.last'),
			currentXData = currentData.map(ele => ele.marketSales),
			lastXData = lastData.map(ele => ele.marketSales),
			maxXData = Math.ceil(Math.max.apply(null, currentXData)),
			maxLastXData = Math.ceil(Math.max.apply(null, lastXData)),
			leftWidth = this.get('leftWidth'),
			rightWidth = this.get('rightWidth'),
			height = this.get('height'),
			spacing = 120,
			svg = null,
			svgRight = null,
			xLeft = null,
			xRight = null,
			tooltip = null;


		this.removeExistsSvg(id);

		xLeft = d3.scaleLinear()
			.domain([0, maxLastXData])
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


		svg = this.initSvgContainer(id, leftWidth, height);

		svgRight = this.initSvgContainer(id, rightWidth, height);
		tooltip = d3.select(`#${id}`).append('div')
			.attr('class', 'svg-tooltip');

		/* 右半拉 */
		this.generateRightBar(svgRight, currentData, spacing, xRight, tooltip);

		/* 左半拉 */
		this.generateLeftBar(svg, lastData, leftWidth, xLeft, tooltip);

	}

});
