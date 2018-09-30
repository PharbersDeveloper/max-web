import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    classNames: ['col-md-12', 'col-sm-12', 'col-xs-12'],
    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawChart);
    },
    // drawChart() {
    //
    //     const width = 500;
    //     const height = 300;
    //     const margin = {
    //       left: 300,
    //       right: 20,
    //       top: 100,
    //       bottom: 52
    //     }
    //
    //     const svg = d3.select("#chart").append("svg")
    //         .attr("width", width)
    //         .attr("height", height);
    //     //绘制区域
    //
    //     const g = svg.append('g')
    //       .attr('transform', `translate(${margin.left}, ${margin.top})`)
    //     //图表区域
    //
    //
    //     const data = [
    //       {
    //         name: "北京市",
    //         current: 1,
    //         last:2,
    //         value: -619.7
    //       },
    //       {
    //         name: "上海市",
    //         current: 2,
    //         last:2,
    //         value: 302.9
    //       },
    //       {
    //         name: "广州市",
    //         current: 3,
    //         last:5,
    //         value: 200.9
    //       },
    //         {
    //         name: "成都市",
    //         current: 4,
    //         last:5,
    //         value: 58.2
    //       },
    //         {
    //         name: "郑州市",
    //         current: 5,
    //         last:5,
    //         value: 53.6
    //       }
    //     ];
    //
    //     const innerWidth = width - margin.left - margin.right;
    //     const innerHeight = height - margin.top - margin.bottom;
    //
    //     const xValue = d => d.value;
    //     const yValue = d => d.name;
    //     const current = d => d.current;
    //
    //     const xScale = d3.scaleLinear()
    //       .domain([0, d3.max(data, xValue)]) //定义域
    //       .range([0, innerWidth]);
    //
    //     const yScale = d3.scaleBand()
    //       .domain(data.map(yValue).reverse())
    //       .range([innerHeight, 0]) //值域
    //       .padding(0.12);
    //
    //     const currents = data.map(current);
    //
    //     const groups = g.selectAll('g').data(data);
    //     const groupsEnter = groups
    //       .enter().append('g')
    //         .attr('transform', d => `translate(0, ${yScale(yValue(d))})`);
    //
    //     groupsEnter
    //       .append('rect')
    //         .attr('class', 'bar')
    //         .attr('fill','red')
    //         .attr('width', d => xScale(xValue(d))+25)
    //         .attr('height', yScale.bandwidth());
    //
    //     // groupsEnter
    //     //   .append('text')
    //     //     .attr('class', 'label')
    //     //     .attr('x', -100)
    //     //     .attr('y', yScale.bandwidth() / 2)
    //     //     .text(yValue);
    //
    //     // const percentFormat = d3.format(",.1%");
    //     // const xPercent = d => percentFormat(xValue(d) / 1235.3);
    //
    //     // groupsEnter
    //     //   .append('text')
    //     //     .attr('class', 'number')
    //     //     .attr('x', d => xScale(xValue(d)) + 33)
    //     //     .attr('y', yScale.bandwidth() / 2)
    //     //     .text(d => `${xValue(d)} (${xPercent(d)})`);
    // }
    drawChart() {
        var margin = {top: 100, right: 30, bottom: 40, left: 30},
            width = 350 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x =  d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleBand()
            .range([0, height], 0.1);

        var xAxis = d3.axisBottom()
            .scale(x)

        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(0)
            .tickPadding(6);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var data = [{
          name:"A",
          value:-15
        },{
          name:"B",
          value:-20
        },{
          name:"C",
          value:18
        },{
          name:"D",
          value:20
        }]
          x.domain(d3.extent(data, function(d) { return d.value; })).nice();
          y.domain(data.map(function(d) { return d.name; }));

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
              .attr("x", function(d) { return x(Math.min(0, d.value)); })
              .attr("y", function(d) { return y(d.name); })
              .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
              .attr("height", y.bandwidth());

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(" + x(0) + ",0)")
              .call(yAxis);

        function type(d) {
          d.value = +d.value;
          return d;
        }
    }
});
