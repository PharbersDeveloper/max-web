import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	tagName: 'div',
	classNames: ['col-md-12', 'col-sm-12', 'col-xs-12'],
	didReceiveAttrs() {
		let data = this.get('dataset');

		if (data !== undefined) {
			run.scheduleOnce('render', this, this.drawChart);
		}
	},
	drawChart() {
		d3.select('.market-trend-bar-line').select('svg').remove();
		let dataset = this.get('dataset'),
			barColor = '#5E81CF',
			width = 900,
			height = 200,
			margin = { top: 20, right: 20, bottom: 30, left: 30 },
			xDatas = dataset.map(elem => elem.date),
			values = dataset.map(elem => elem.marketSales * (4 / 3)),
			values2 = dataset.map(elem => elem.percentage * (4 / 3)),
			xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
			yScale = d3.scaleLinear().rangeRound([height, 0]),
			yScale2 = d3.scaleLinear().rangeRound([height, 0]),
			svgContainer = null,
			svg = null,
			g = null,
			chart = null,
			line = null;

		xScale.domain(xDatas);
		yScale.domain([0, d3.max(values)]);
		yScale2.domain([0, d3.max(values2)]);

		svgContainer = d3.select('.market-trend-bar-line');
		svgContainer.append('div').attr('class', '_tooltip_1mas67').style('opacity', 0.0);
		svg = svgContainer.append('svg')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', '0 0 970 250');

		g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		g.append('g')
			.attr('class', 'axisX')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(xScale))
			.attr('font-weight', 'bold');

		// g.append('g')
		//     .attr('class', 'axisY')
		//     .call(d3.axisLeft(yScale).ticks(10));
		// Add the Y0 Axis
		g.append('g')
			.attr('class', 'axisY')
			.attr('transform', 'translate(0,0)')
			.call(d3.axisLeft(yScale).ticks(10));

		// Add the Y1 Axis
		g.append('g')
			.attr('class', 'axisY')
			.attr('transform', 'translate( ' + width + ', 0 )')
			.call(d3.axisRight(yScale2).ticks(10));

		chart = g.selectAll('bar')
			.data(dataset)
			.enter().append('g'); //.attr('class', '_g_1mas67');

		chart.append('rect')
			.attr('class', '_bar_1mas67')
			.attr('fill', barColor)
			.attr('x', function (d) {
				return xScale(d.date);
			})
			.attr('height', function (d) {
				return height - yScale(d.marketSales);
			})
			.attr('y', function (d) {
				return yScale(d.marketSales);
			})
			.attr('width', xScale.bandwidth());


		d3.selectAll('._container-g_1mas67')
			.selectAll('g:nth-last-of-type(3)')
			.select('rect')
			.attr('class', '_bar2_1mas67');
		d3.selectAll('._container-g_1mas67')
			.selectAll('g:nth-last-of-type(2)')
			.select('rect')
			.attr('class', '_bar2_1mas67');
		d3.selectAll('._container-g_1mas67')
			.selectAll('g:last-of-type')
			.select('rect')
			.attr('class', '_bar2_1mas67');


		line = d3.line()
			.x(function (d) {
				return xScale(d.date);
			})
			.y(function (d) {
				return yScale2(d.percentage);
			});

		// Line
		g.append('path')
			.datum(dataset)
			.attr('fill', 'none')
			.attr('stroke', '#899ED6')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('transform', 'translate(' + xScale.bandwidth() / 2 + ',0)')
			.attr('stroke-width', 1.5)
			.attr('d', line);

	}
});
