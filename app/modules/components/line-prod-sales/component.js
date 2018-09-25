import Component from '@ember/component';
import { run } from '@ember/runloop'
import { get } from '@ember/object'
import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    classNames: ['col-md-12', 'col-sm-12', 'col-xs-12', 'prod-sales-container'],
    width: 520,
    height: 260,
    attributeBindings: ['width', 'height'],
    init() {
        this._super(...arguments);
    },

    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawSingleLine);
    },
    drawSingleLine() {
        const singleLineData = this.get('singleLineData');
        d3.select('.prod-sales-container svg.single-line-svg').remove();
        let lineNames = ['产品销售额'];
        let lineColor = ["#FA6F80"];
        let svgContainer = d3.select(this.element);
        var svg = svgContainer.append('svg').attr('class', 'single-line-svg');
        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 40,
                bottom: 30,
                left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 360 - margin.top - margin.bottom;

        var parseTime = d3.timeParse("%Y-%m");
        let formatDateIntoYearMonth = d3.timeFormat('%Y-%m');

        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function(d) {
                return x(d.ym);
            })
            .y(function(d) {
                return y0(d.sales);
            });


        svg.attr('padding', '0 20px')
            .attr("height", 368)
            .attr('width', '100%')
            .attr('preserveAspectRatio', 'none')
            .attr('viewBox', '-40 0 950 348')
            .attr("transform", "translate(10,0)")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // format the data

        let data = singleLineData.map(function(item) {
            let lineData = {};
            lineData.ym = parseTime(item.ym);
            lineData.sales = item.sales
            return lineData
        })

        // Scale the range of the data\
        x.domain(d3.extent(data, function(d) {
            return d.ym;
        }));
        let y0Max = d3.max(data, function(d) {
            return Math.max(d.sales);
        });
        y0.domain([0, (y0Max / 3 + y0Max)]);
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
        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#FA6F80")
            .style("filter", "url(#drop-shadow)")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(formatDateIntoYearMonth));

        // Add the Y0 Axis
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .attr("transform", 'translate(0,0)')
            .call(d3.axisLeft(y0));
        svg.selectAll(".dot1")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot1")
            .attr("r", 3)
            .attr('fill', lineColor[0])
            .attr("cx", function(d) { return x(d.ym); })
            .attr("cy", function(d) { return y0(d.sales); })
            .attr("opacity", 0.6)
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 5);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 3);
            });

        /**
         * 添加图例
         */
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
                .attr("y", 6)
                .attr("fill", function(d, i) {
                    return lineColor[i];
                });
            var lineGroup = legend.selectAll('line')
                .data(lineNames);
            lineGroup.exit().remove();
            legend.selectAll("line")
                .data(lineNames)
                .enter()
                .append("line")

                .attr("x1", function(d, i) {
                    return i * 100 - 20;
                })
                .attr("x2", function(d, i) {
                    return i * 100 - 10;
                })
                .attr("y1", 3)
                .attr("y2", 3)
                .attr("stroke", function(d, i) {
                    return lineColor[i];
                })
                .attr("stroke-width", '3')

                .attr("fill", function(d, i) {
                    return lineColor[i];
                });
            legend.attr("transform", "translate(" + ((width - lineNames.length * 100) / 2) + "," + (height + 30) + ")");
            /**
             * end 添加图例
             */
            /**
             * 添加阴影
             */
            var defs = svg.append("defs");
            var filter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "130%");
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)
                .attr("result", "blur");
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)
                .attr("dy", 2)
                .attr("result", "offsetBlur");
            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur")
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");
            /**
             * end 添加阴影
             */
        }
    },

});
