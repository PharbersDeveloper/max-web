import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	tagName: 'div',
	classNames: ['col-md-12', 'col-sm-12', 'col-xs-12'],
	didReceiveAttrs() {
		run.scheduleOnce('render', this, this.drawChart);
	},
	drawChart() {
		d3.select('.sample-bar-line').select('svg').remove();
		let dataset = this.get('dataset');

		if (dataset != undefined) {
			let barColor = '#5E81CF';
			let width = 820;
			let height = 200;
			let margin = { top: 20, right: 20, bottom: 30, left: 90 };
			//图表大小位置

			let xDatas = dataset.map(elem => elem.key); //Xname
			let values = dataset.map(elem => elem.value); //遍历value，最大值为y轴的最大值
			let values2 = dataset.map(elem => elem.value2);

			let xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
				yScale = d3.scaleLinear().rangeRound([height, 0]);

			let maxY = Math.max(d3.max(values), d3.max(values2)); //取遍历值的最大数字

			xScale.domain(xDatas);
			yScale.domain([0, maxY]); //将最大数字赋值给y

			// let svgContainer = d3.select('.sample-bar-line');
			let svgContainer = d3.select('.sample-bar-line');
			let tooltip = svgContainer.append('div').attr('class', '_tooltip_1mas67').style('opacity', 0.0);
			let svg = svgContainer.append('svg')
				.attr('preserveAspectRatio', 'xMidYMid meet')
				.attr('viewBox', '0 0 960 300');
			//绘制图表的区域

			let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			//x轴
			g.append('g')
				.attr('class', 'axisX')
				.attr('transform', 'translate(0,' + height + ')')
				.call(d3.axisBottom(xScale))
				.attr('font-weight', 'bold');
			//y轴
			g.append('g')
				.attr('class', 'axisY')
				.call(d3.axisLeft(yScale).ticks(5));

			let chart = g.selectAll('bar')
				.data(dataset)
				.enter().append('g'); //.attr('class', '_g_1mas67');

			chart.append('rect')
				.attr('class', '_bar_1mas67')
				.attr('fill', barColor)
				.attr('x', function (d) {
					return xScale(d.key);
				})
				.attr('height', function (d) {
					return height - yScale(d.value);
				})
				.attr('y', function (d) {
					return yScale(d.value);
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


			let line = d3.line()
				.x(function (d) {
					return xScale(d.key);
				})
				.y(function (d) {
					return yScale(d.value2);
				});

			// Line
			g.append('path')
				.datum(dataset)
				.attr('fill', 'none')
				.attr('stroke', '#FF7D7E')
				.attr('stroke-linejoin', 'round')
				.attr('stroke-linecap', 'round')
				.attr('transform', 'translate(' + xScale.bandwidth() / 2 + ',0)')
				.attr('stroke-width', 1.5)
				.attr('stroke-dasharray', 2.5)
				.attr('d', line);
		}
	}
});
