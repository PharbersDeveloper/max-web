import Component from '@ember/component';
import {
	run
} from '@ember/runloop';
import {
	get
} from '@ember/object';
import d3 from 'd3';
export default Component.extend({
	tagName: 'svg',
	classNames: ['multi-lines-choose','col-md-12'],
	init() {
		this._super(...arguments);
		this.color = ['#FA6F80','#7CFFE2','#868CE9'];
		this.data = [{
				name: "市场销售额",
				values: [{
						date: "2018-01",
						price: "100"
					},
					{
						date: "2018-02",
						price: "110"
					},
					{
						date: "2018-03",
						price: "145"
					},
					{
						date: "2018-04",
						price: "241"
					},
					{
						date: "2018-05",
						price: "101"
					},
					{
						date: "2018-06",
						price: "90"
					},
					{
						date: "2018-07",
						price: "10"
					},
					{
						date: "2018-08",
						price: "35"
					},
					{
						date: "2018-09",
						price: "20"
					},
					{
						date: "2018-10",
						price: "201"
					}
				]
			},
			{
				name: "产品销售额",
				values: [{
						date: "2018-01",
						price: "200"
					},
					{
						date: "2018-02",
						price: "120"
					},
					{
						date: "2018-03",
						price: "33"
					},
					{
						date: "2018-04",
						price: "21"
					},
					{
						date: "2018-05",
						price: "51"
					},
					{
						date: "2018-06",
						price: "190"
					},
					{
						date: "2018-07",
						price: "120"
					},
					{
						date: "2018-08",
						price: "85"
					},
					{
						date: "2018-09",
						price: "221"
					},
					{
						date: "2018-10",
						price: "101"
					}
				]
			},
			{
				name: "产品份额",
				values: [{
						date: "2018-01",
						price: "50"
					},
					{
						date: "2018-02",
						price: "10"
					},
					{
						date: "2018-03",
						price: "5"
					},
					{
						date: "2018-04",
						price: "71"
					},
					{
						date: "2018-05",
						price: "20"
					},
					{
						date: "2018-06",
						price: "9"
					},
					{
						date: "2018-07",
						price: "220"
					},
					{
						date: "2018-08",
						price: "235"
					},
					{
						date: "2018-09",
						price: "61"
					},
					{
						date: "2018-10",
						price: "10"
					}
				]
			}
		];
	},
	didInsertElement() {
		this._super(...arguments);
		console.log(this.$('.multi-lines-choose').width())
	},
	didReceiveAttrs() {
		this._super(...arguments);
		run.scheduleOnce('render', this, this.drawMultiLineChoose);
	},
	drawMultiLineChoose() {
		let data = this.get('data');
		let color = this.get('color');
		let svg = d3.select(this.element);
		var width = 800;
		// let width = this.$('.multi-lines-choose').width();

		var height = 300;
		var margin = 50;
		var duration = 250;

		var lineOpacity = "0.25";
		var lineOpacityHover = "0.85";
		var otherLinesOpacityHover = "0.1";
		var lineStroke = "1.5px";
		var lineStrokeHover = "2.5px";

		var circleOpacity = '0.65';
		var circleOpacityOnLineHover = "0.25"
		var circleRadius = 2;
		var circleRadiusHover = 4;


		/* Format Data */
		var parseDate = d3.timeParse("%Y-%m");
		data.forEach(function(d) {
			d.values.forEach(function(d) {
				d.date = parseDate(d.date);
				d.price = +d.price;
			});
		});


		/* Scale */
		var xScale = d3.scaleTime()
			.domain(d3.extent(data[0].values, d => d.date))
			.range([0, width - margin]);

		var yScale = d3.scaleLinear()
			.domain([0, d3.max(data[0].values, d => d.price)])
			.range([height - margin, 0]);
		var ySecondScale = d3.scaleLinear()
			.domain([0,d3.max(data[2].values, d => d.price)])
			.range([height - margin,0])
		// var color = d3.scaleOrdinal(d3.schemeCategory10);
		// console.log(color);
		/* Add SVG */
		// var svg = d3.select("#chart").append("svg")
		svg
			// .attr("width", (width + margin) + "px")
			// .attr("height", (height + margin) + "px")
			.attr('preserveAspectRatio','xMidYMid meet')
			.attr('viewBox','0 0 1000 550')
			.append('g')
			.attr("transform", `translate(${margin}, ${margin})`);


		/* Add line into SVG */
		var line = d3.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.price))
			.y(d => ySecondScale(d.price));
		let lines = svg.append('g')
			.attr('class', 'lines')
			.attr("transform", 'translate(20,30)');

		lines.selectAll('.line-group')
			.data(data).enter()
			.append('g')
			.attr('class', 'line-group')
			.on("mouseover", function(d, i) {
				svg.append("text")
					.attr("class", "title-text")
					// .style("fill", color(i))
					.style("fill",color[i])
					.text(d.name)
					.attr("text-anchor", "middle")
					.attr("x", (width - margin) / 2)
					.attr("y", 15);
			})
			.on("mouseout", function(d) {
				svg.select(".title-text").remove();
			})
			.append('path')
			.attr('class', 'line')
			.attr('d', d => line(d.values))
			// .style('stroke', (d, i) => color(i))
			.style("stroke",(d,i) => color[i])
			// .attr("stroke-width", 2)
			.style('opacity', 0.9)
			.on("mouseover", function(d) {
				d3.selectAll('.line')
					.style('opacity', 1);
				d3.selectAll('.circle')
					.style('opacity', circleOpacityOnLineHover);
				d3.select(this)
					.style('opacity', lineOpacityHover)
					.style("stroke-width", 2)
					.style("cursor", "pointer");
			})
			.on("mouseout", function(d) {
				d3.selectAll(".line")
					.style('opacity', 0.9);
				d3.selectAll('.circle')
					.style('opacity', circleOpacity);
				d3.select(this)
					.style("stroke-width", lineStroke)
					.style("cursor", "none");
			});


		/* Add circles in the line */
		lines.selectAll("circle-group")
			.data(data).enter()
			.append("g")
			// .style("fill", (d, i) => color(i))
			.style("fill", (d,i) => color[i])
			.selectAll("circle")
			.data(d => d.values).enter()
			.append("g")
			.attr("class", "circle")
			.on("mouseover", function(d) {
				d3.select(this)
					.style("cursor", "pointer")
					.append("text")
					.attr("class", "text")
					.text(`${d.price}`)
					.attr("x", d => xScale(d.date) + 5)
					.attr("y", d => yScale(d.price) - 10);
			})
			.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.transition()
					.duration(duration)
					.selectAll(".text").remove();
			})
			.append("circle")
			.attr("cx", d => xScale(d.date))
			.attr("cy", d => yScale(d.price))
			.attr("r", circleRadius)
			.style('opacity', circleOpacity)
			.on("mouseover", function(d) {
				d3.select(this)
					.transition()
					.duration(duration)
					.attr("r", circleRadiusHover);
			})
			.on("mouseout", function(d) {
				d3.select(this)
					.transition()
					.duration(duration)
					.attr("r", circleRadius);
			});


		/* Add Axis into SVG */
		let xlength = data[0].values.length;
		// console.log('this is x axis length')
		// console.log(data[0]);
		var xAxis = d3.axisBottom(xScale).ticks(xlength);
		var yAxis = d3.axisLeft(yScale).ticks(7);
		var ySecondAxis = d3.axisRight(ySecondScale).ticks(7)

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(20, ${height-margin+30})`)
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr('transform','translate(20,30)')
			.call(yAxis);
			// .append('text')
			// .attr("y", 15)
			// .attr("transform", "rotate(-90)")
			// .attr("fill", "#000")
			// .text("Total values");
		svg.append("g")
			.attr("class","y yscondaxis")
			.attr('transform',"translate("+ (width-30) +",30)")
			.call(ySecondAxis)
	}

});
