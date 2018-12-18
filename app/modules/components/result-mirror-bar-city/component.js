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
		d3.select('#chart-city').select('svg').remove();
		let currentDataCity = this.get('currentDataCity');
		let lastDataCity = this.get('lastDataCity');

		if (currentDataCity != undefined && lastDataCity != undefined) {

			var margin = { top: 100, right: 50, bottom: 40, left: -30 },
				width = 150 - margin.left - margin.right,
				height = 550 - margin.top - margin.bottom;

			function getMaxOfArray(numArray) {
				return Math.max.apply(null, numArray);
			}
			let currentXArray = currentDataCity.map(function (ele, idx, arr) {
				return ele.marketSales;
			});
			let currentXArrayMax = Math.ceil(Math.max.apply(null, currentXArray));

			var x = d3.scaleLinear() //返回一个线性比例尺
				.range([0, currentXArrayMax]); //设定比例尺的值域

			var xRight = d3.scaleLinear() //返回一个线性比例尺
				.range([0, currentXArrayMax]); //设定比例尺的值域

			var y = d3.scaleBand() //d3.scaleBand()并不是一个连续性的比例尺
				.range([0, height])
				.padding(0.4); // y轴之间的值的间隙

			var yRight = d3.scaleBand() //d3.scaleBand()并不是一个连续性的比例尺
				.range([0, height])
				.padding(0.4);

			var xAxis = d3.axisBottom()
				.scale(x); // x坐标轴

			var xAxisRight = d3.axisBottom()
				.scale(xRight); // x坐标轴

			var yAxis = d3.axisRight()
				.scale(y)
				.tickSize(0)
				.tickPadding(6);
			let yAxisRight = d3.axisLeft()
				.scale(yRight)
				.tickSize(0)
				.tickPadding(6);

			var svg = d3.select('#chart-city').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.attr('class', 'lastYearSvg')
				.append('g')
				.attr('transform', 'translate(70,' + margin.top + ')');
			var svgRight = d3.select('#chart-city').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.attr('class', 'currentYearSvg')
				.append('g')
				.attr('transform', 'translate(70,' + margin.top + ')');

			x.domain(d3.extent(lastDataCity, function (d) {
 return d.marketSales; 
})).nice();
			xRight.domain(d3.extent(currentDataCity, function (d) {
 return d.marketSales; 
})).nice();
			// X定义域取数组中的最大值和最小值，并取整 => 柱状图长度
			y.domain(lastDataCity.map(function (d) {
 return d.keyLast + d.area; 
})); // Y轴定义域
			yRight.domain(currentDataCity.map(function (d) {
 return d.key + d.area; 
}));
			//柱状图排名和省份
			svg.selectAll('.bar')
				.data(lastDataCity)
				.enter().append('rect')
				.attr('class', function (d) {
 return 'bar bar--' + (d.marketSales < 0 ? 'negative' : 'positive'); 
})
				.attr('x', function (d) {
 return x(Math.min(0, d.marketSales)); 
}) //绘制矩形的x坐标的位置
				.attr('y', function (d) {
					return y(d.keyLast + d.area);
				}) //绘制矩形的y坐标的位置
				.attr('width', function (d) {
 return Math.abs(x(d.marketSales) - x(0)); 
})
				.attr('height', y.bandwidth());
			svgRight.selectAll('.bar')
				.data(currentDataCity)
				.enter().append('rect')
				.attr('class', function (d) {
 return 'bar bar--' + (d.marketSales < 0 ? 'negative' : 'positive'); 
})
				.attr('x', function (d) {
 return x(Math.min(0, d.marketSales)); 
})
				.attr('y', function (d, i) {
					return yRight(d.key + d.area);
				})
				.attr('width', function (d) {
 return Math.abs(x(d.marketSales) - x(0)); 
})
				.attr('height', y.bandwidth());

			// svg.append("g")
			//     .attr("class", "x axis")
			//     .attr("transform", "translate(0," + height + ")")
			//     .call(xAxis);

			svg.append('g')
				.attr('class', 'y axis')
				.attr('transform', 'translate(' + x(0) + ',0)')
				.call(yAxis)
				.selectAll('text')
				.attr('transform', 'translate(40,0)');
			svgRight.append('g')
				.attr('class', 'yRight axisRight')
				.attr('transform', 'translate(' + x(0) + ',0)')
				.call(yAxisRight)
				.selectAll('text')
				.attr('transform', 'translate(-30,0)');

			// function type(d) {
			//   d.value = +d.value;
			//   return d;
			// }
		}
	}

});
