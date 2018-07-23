import Component from '@ember/component';
import {
    run
} from '@ember/runloop';
import {
    get
} from '@ember/object';
import d3 from 'd3';
export default Component.extend({
    tagName: 'div',
    classNames: ['multi-lines-choose', 'col-md-12', 'col-sm-12', 'col-xs-12'],
    init() {
        this._super(...arguments);
        this.color = ['#FA6F80', '#7CFFE2', '#868CE9'];
        /*    this.chooseData = [{
                    name: "USA",
                    values: [{
                            ym: "2018-01",
                            value: 100
                        },
                        {
                            ym: "2018-02",
                            value: 110
                        },
                        {
                            ym: "2018-03",
                            value: 145
                        },
                        {
                            ym: "2018-04",
                            value: 241
                        },
                        {
                            ym: "2018-05",
                            value: 101
                        },
                        {
                            ym: "2018-06",
                            value: 90
                        },
                        {
                            ym: "2018-07",
                            value: 10
                        },
                        {
                            ym: "2018-08",
                            value: 35
                        },
                        {
                            ym: "2018-09",
                            value: 21
                        },
                        {
                            ym: "2018-10",
                            value: 201
                        }
                    ]
                },
                {
                    name: "Canada",
                    values: [{
                            ym: "2018-01",
                            value: 108
                        },
                        {
                            ym: "2018-02",
                            value: 114
                        },
                        {
                            ym: "2018-03",
                            value: 144
                        },
                        {
                            ym: "2018-04",
                            value: 244
                        },
                        {
                            ym: "2018-05",
                            value: 144
                        },
                        {
                            ym: "2018-06",
                            value: 940
                        },
                        {
                            ym: "2018-07",
                            value: 140
                        },
                        {
                            ym: "2018-08",
                            value: 345
                        },
                        {
                            ym: "2018-09",
                            value: 241
                        },
                        {
                            ym: "2018-10",
                            value: 281
                        }
                    ]
                },
                {
                    name: "Maxico",
                    values: [{
                            ym: "2018-01",
                            value: 1
                        }, {
                            ym: "2018-02",
                            value: 120
                        },
                        {
                            ym: "2018-03",
                            value: 135
                        },
                        {
                            ym: "2018-04",
                            value: 281
                        },
                        {
                            ym: "2018-05",
                            value: 151
                        },
                        {
                            ym: "2018-06",
                            value: 290
                        },
                        {
                            ym: "2018-07",
                            value: 310
                        },
                        {
                            ym: "2018-08",
                            value: 135
                        },
                        {
                            ym: "2018-09",
                            value: 421
                        },
                        {
                            ym: "2018-10",
                            value: 65
                        }
                    ]
                },
                {
                    name: "China",
                    values: [{
                            ym: "2018-01",
                            value: 150
                        },
                        {
                            ym: "2018-02",
                            value: 120
                        },
                        {
                            ym: "2018-03",
                            value: 245
                        },
                        {
                            ym: "2018-04",
                            value: 341
                        },
                        {
                            ym: "2018-05",
                            value: 201
                        },
                        {
                            ym: "2018-06",
                            value: 190
                        },
                        {
                            ym: "2018-07",
                            value: 110
                        },
                        {
                            ym: "2018-08",
                            value: 135
                        },
                        {
                            ym: "2018-09",
                            value: 221
                        },
                        {
                            ym: "2018-10",
                            value: 201
                        }
                    ]
                },
            ];
            */
    },

    didReceiveAttrs() {
        this._super(...arguments);
        run.schedule('render', this, this.drawMultiLineChoose);
    },
    drawMultiLineChoose() {
        let svgContainer = d3.select(this.element);
        let svg = svgContainer.append("svg").attr('class', 'much-lines');
        let data = this.get('chooseData');
        // let chooseData = this.get('chooseData');
        console.log(data);
        console.log("frommmmmmmmmmmmmmmmmmm component")
        var width = 900;
        var height = 340;
        var margin = 20;
        var duration = 250;

        var lineOpacity = "0.25";
        var lineOpacityHover = "0.85";
        var otherLinesOpacityHover = "0.1";
        var lineStroke = "1.5px";
        var lineStrokeHover = "2.5px";

        var circleOpacity = '0.85';
        var circleOpacityOnLineHover = "0.25"
        var circleRadius = 3;
        var circleRadiusHover = 6;

        /* Format Data */
        var parseDate = d3.timeParse("%Y-%m");
        // let data = chooseData.map(function(item) {
        //     let insidedata = {};
        //     insidedata.ym = parseTime(item.ym);
        //     insidedata.value = item.value
        // })
        data.forEach(function(d) {
            d.values.forEach(function(dd) {
                d.ym = parseDate(d.ym);
                d.value = +d.value;
            });
        });

        /* Scale */
        var xScale = d3.scaleTime()
            .domain(d3.extent(data[0].values, d => d.ym))
            .range([0, width - margin]);
        let yMax = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            let max = d3.max(data[i].values, d => d.value)
            if (max > yMax) {
                yMax = max
            }
        };
        var yScale = d3.scaleLinear()
            .domain([0, yMax + yMax / 3])
            .range([height - margin, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        /* Add SVG */
        svg.attr("width", "100%")
            .attr("height", 380)
            .attr('preserveAspectRatio', 'none')
            .attr('viewBox', '-40 -10 950 380')
            .append('g')
        // .attr("transform", `translate(${margin}, ${margin})`);

        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.ym))
            .y(d => yScale(d.value));

        let lines = svg.append('g')
            .attr('class', 'lines');

        lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')
            .on("mouseover", function(d, i) {
                svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", color(i))
                    .text(d.name)
                    .attr("text-anchor", "middle")
                    .attr("x", (width - margin) / 2)
                    .attr("y", 5);
            })
            .on("mouseout", function(d) {
                svg.select(".title-text").remove();
            })
            .append('path')
            .attr('class', 'line')
            .attr('d', d => line(d.values))
            .style('stroke', (d, i) => color(i))
            .style('opacity', lineOpacity)
            .on("mouseover", function(d) {
                d3.selectAll('.much-lines .line')
                    .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.much-lines .circle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".much-lines .line")
                    .style('opacity', lineOpacity);
                d3.selectAll('.much-lines .circle')
                    .style('opacity', circleOpacity);
                d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
            });


        /* Add circles in the line */
        lines.selectAll("circle-group")
            .data(data).enter()
            .append("g")
            .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(d => d.values).enter()
            .append("g")
            .attr("class", "circle")
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.value}`)
                    .attr("x", d => xScale(d.ym) + 5)
                    .attr("y", d => yScale(d.value) - 10);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
            })
            .append("circle")
            .attr("cx", d => xScale(d.ym))
            .attr("cy", d => yScale(d.value))
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
        var xAxis = d3.axisBottom(xScale).ticks(12);
        var yAxis = d3.axisLeft(yScale).ticks(6);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height-margin})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Total values");
    }

});