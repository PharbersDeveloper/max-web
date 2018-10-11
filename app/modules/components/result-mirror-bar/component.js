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
        var margin = {top: 100, right: 50, bottom: 40, left: -30},
            width = 150 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x =  d3.scaleLinear() //返回一个线性比例尺
            .range([0, width]); //设定比例尺的值域

        var y = d3.scaleBand() //d3.scaleBand()并不是一个连续性的比例尺
            .range([0, height])
            .padding(0.2); // y轴之间的值的间隙

        var yRight = d3.scaleBand() //d3.scaleBand()并不是一个连续性的比例尺
            .range([0, height])
            .padding(0.2);

        var xAxis = d3.axisBottom()
            .scale(x) // x坐标轴

        var yAxis = d3.axisRight()
            .scale(y)
            .tickSize(0)
            .tickPadding(6);
        let yAxisRight = d3.axisLeft()
            .scale(yRight)
            .tickSize(0)
            .tickPadding(6);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr('class','lastYearSvg')
            .append("g")
            .attr("transform", "translate(-95," + margin.top + ")");
        var svgRight = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class','currentYearSvg')
                .append("g")
                .attr("transform", "translate(-130," + margin.top + ")");
        var data = [{
          name:"A",
          value:-15,
          province:"北京",
        },{
          name:"B",
          value:-20,
          province:"北京",
        },{
          name:"C",
          value:-18,
          province:"北京",
        },{
          name:"D",
          value:-30,
          province:"北京",
        }];
        var currentData = [{
            name:" . A",
            value:15,
            province:"北京",
          },{
            name:"B",
            value:20,
            province:"北京",
          },{
            name:"C",
            value:18,
            province:"北京",
          },{
            name:"D",
            value:30,
            province:"北京",
        }];
        x.domain(d3.extent(data, function(d) { return d.value; })).nice(); // X定义域取数组中的最大值和最小值，并取整
        y.domain(data.map(function(d) { return d.name +  d.province; })); // Y轴定义域
        yRight.domain(data.map(function(d) { return d.name; }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(Math.min(0, d.value)); })
            .attr("y", function(d) { return y(d.name + d.province); })
            .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
            .attr("height", y.bandwidth());
        svgRight.selectAll(".bar")
            .data(currentData)
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(Math.min(0, d.value)); })
            .attr("y", function(d) { return y(d.name + d.province); })
            .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
            .attr("height", y.bandwidth());

        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(xAxis);

        svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(" + x(0) + ",0)")
              .call(yAxis)
              .selectAll("text")
              .attr("transform", "translate(40,0)");
        svgRight.append("g")
              .attr("class", "yRight axisRight")
              .attr("transform", "translate(" + x(0) + ",0)")
              .call(yAxisRight)
              .selectAll("text")
              .attr("transform", "translate(-30,0)");

        function type(d) {
          d.value = +d.value;
          return d;
        }
    }


});
