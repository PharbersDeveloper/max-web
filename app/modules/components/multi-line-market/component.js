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
    classNames: ['col-md-12','col-sm-12','col-xs-12', 'simple-line'],
    init() {
        this._super(...arguments);
        // this.data = [];
    },
    didReceiveAttrs() {
        run.schedule('render', this, this.drawSimpleLine)
    },
    drawSimpleLine() {
        let data = this.get('mulitLineData');
        let lineNames = ['市场销售额', '产品销售额', '产品份额'];
        let lineColor = ["#FA6F80", "#7CFFE2", "#868CE9"];
        var svg = d3.select(this.element)
        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 40,
                bottom: 30,
                left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 360 - margin.top - margin.bottom;

        // parse the date / time
        // var parseTime = d3.timeParse("%d-%b-%y");
        var parseTime = d3.timeParse("%Y-%m");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);
        var y2 = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function(d) {
                // console.log(d)
                return x(d.date);
            })
            .y(function(d) {
                return y0(d.marketSales);
            });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y1(d.prodSales);
            });

        var valueline3 = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                // return y2(Math.log(d.share));
                return y2(d.share);
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        svg
            // .attr("width",'100%')
            .attr('padding','0 20px')
            .attr('min-width',553)
            .attr("height", 368)
            // .attr('preserveAspectRatio', 'xMidYMid','meet')
            .attr('preserveAspectRatio','none')
            .attr('viewBox', '-20 0 900 348')
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        // Get the data
        // d3.csv("data4.csv", function(error, data) {
        // if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.marketSales = +d.marketSales;
            d.prodSales = +d.prodSales;
            d.share = +d.share;
        });

        // Scale the range of the data\
        x.domain(d3.extent(data, function(d) {
            // console.log(d.date)
            return d.date;
        }));
        let y0Max = d3.max(data, function(d) {
            return Math.max(d.marketSales);
        });
        // y0.domain([0, d3.max(data, function(d) {
        //     return Math.max(d.marketSales);
        // })]);
        y0.domain([0, (y0Max / 3 + y0Max)]);
        let y1Max = d3.max(data, function(d) {
            return Math.max(d.marketSales);
        });
        y1.domain([0, (y1Max / 3 + y1Max)]);
        let y2Max = d3.max(data, function(d) {
            // return Math.max(Math.log(d.share));
            return Math.max(d.share)
        });
        y2.domain([0, (y2Max/3 + y2Max)]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#FA6F80")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#7CFFE2")
            .attr("d", valueline2);

        // Add the valueline3 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#868CE9")
            .attr("d", valueline3);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y0 Axis
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .attr("transform", 'translate(0,0)')
            .call(d3.axisLeft(y0))


        // Add the Y1 Axis
        svg.append("g")
            .attr("class", "axisRed")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(y2));

        // Add the Y2 Axis
        // svg.append("g")
        //     .attr("class", "axisPurple")
        //     .attr("transform", "translate( " + width + ", 0 )")
        //     .call(d3.axisLeft(y2).ticks(7));

        // });
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(12)
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y0)
                .ticks(7)
        }
        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            );
        //   绘制图例
        //添加图例
		var legend = svg.append("g");
		addLegend();
		function addLegend() {
			var textGroup = legend.selectAll("text")
				.data(lineNames);
			textGroup.exit().remove();
			legend.selectAll("text")
				.data(lineNames)
				.enter()
				.append("text")
				.text(function(d) {
					return d;
				})
				.attr("class", "legend")
				.attr("x", function(d, i) {
					return i * 100;
				})
				.attr("y", 0)
				.attr("fill", function(d, i) {
					return lineColor[i];
				});
			var rectGroup = legend.selectAll("rect")
				.data(lineNames);
			rectGroup.exit().remove();
			legend.selectAll("rect")
				.data(lineNames)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return i * 100 - 20;
				})
				.attr("y", -10)
				.attr("width", 12)
				.attr("height", 12)
				.attr("fill", function(d, i) {
					return lineColor[i];
				});
			legend.attr("transform", "translate(" + ((width - lineNames.length * 100) / 2) + "," + (height +30) + ")");
		}
    }
});
