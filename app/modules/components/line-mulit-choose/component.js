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
    classNames: ['multi-lines-choose', 'col-md-12','col-sm-12','col-xs-12'],
    init() {
        this._super(...arguments);
        this.color = ['#FA6F80', '#7CFFE2', '#868CE9'];
        this.chooseData = [{
                name: "USA",
                values: [{
                        date: "2018-01",
                        mainValue: 100
                    },
                    {
                        date: "2018-02",
                        mainValue: 110
                    },
                    {
                        date: "2018-03",
                        mainValue: 145
                    },
                    {
                        date: "2018-04",
                        mainValue: 241
                    },
                    {
                        date: "2018-05",
                        mainValue: 101
                    },
                    {
                        date: "2018-06",
                        mainValue: 90
                    },
                    {
                        date: "2018-07",
                        mainValue: 10
                    },
                    {
                        date: "2018-08",
                        mainValue: 35
                    },
                    {
                        date: "2018-09",
                        mainValue: 21
                    },
                    {
                        date: "2018-10",
                        mainValue: 201
                    }
                ]
            },
            {
                name: "Canada",
                values: [{
                        date: "2018-01",
                        mainValue: 108
                    },
                    {
                        date: "2018-02",
                        mainValue: 114
                    },
                    {
                        date: "2018-03",
                        mainValue: 144
                    },
                    {
                        date: "2018-04",
                        mainValue: 244
                    },
                    {
                        date: "2018-05",
                        mainValue: 144
                    },
                    {
                        date: "2018-06",
                        mainValue: 940
                    },
                    {
                        date: "2018-07",
                        mainValue: 140
                    },
                    {
                        date: "2018-08",
                        mainValue: 345
                    },
                    {
                        date: "2018-09",
                        mainValue: 241
                    },
                    {
                        date: "2018-10",
                        mainValue: 281
                    }
                ]
            },
            {
                name: "Maxico",
                values: [{
                        date: "2018-01",
                        mainValue: 1
                    }, {
                        date: "2018-02",
                        mainValue: 120
                    },
                    {
                        date: "2018-03",
                        mainValue: 135
                    },
                    {
                        date: "2018-04",
                        mainValue: 281
                    },
                    {
                        date: "2018-05",
                        mainValue: 151
                    },
                    {
                        date: "2018-06",
                        mainValue: 290
                    },
                    {
                        date: "2018-07",
                        mainValue: 310
                    },
                    {
                        date: "2018-08",
                        mainValue: 135
                    },
                    {
                        date: "2018-09",
                        mainValue: 421
                    },
                    {
                        date: "2018-10",
                        mainValue: 65
                    }
                ]
            },
            {
                name: "China",
                values: [{
                        date: "2018-01",
                        mainValue: 150
                    },
                    {
                        date: "2018-02",
                        mainValue: 120
                    },
                    {
                        date: "2018-03",
                        mainValue: 245
                    },
                    {
                        date: "2018-04",
                        mainValue: 341
                    },
                    {
                        date: "2018-05",
                        mainValue: 201
                    },
                    {
                        date: "2018-06",
                        mainValue: 190
                    },
                    {
                        date: "2018-07",
                        mainValue: 110
                    },
                    {
                        date: "2018-08",
                        mainValue: 135
                    },
                    {
                        date: "2018-09",
                        mainValue: 221
                    },
                    {
                        date: "2018-10",
                        mainValue: 201
                    }
                ]
            },
        ];
    },

    didReceiveAttrs() {
        this._super(...arguments);
        run.schedule('render', this, this.drawMultiLineChoose);
    },
    drawMultiLineChoose() {

        let svg = d3.select(this.element);
        let data = this.get('chooseData');

        var width = 900;
        var height = 300;
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
        data.forEach(function(d) {
            d.values.forEach(function(d) {
                d.date = parseDate(d.date);
                d.mainValue = +d.mainValue;
            });
        });


        /* Scale */
        var xScale = d3.scaleTime()
            .domain(d3.extent(data[0].values, d => d.date))
            .range([0, width - margin]);
        let yMax = 0;
        for(let i = 0,len=data.length;i<len;i++) {
            let max = d3.max(data[i].values, d => d.mainValue)
            if(max > yMax) {
                yMax = max
            }
        };
        var yScale = d3.scaleLinear()
            .domain([0,yMax+yMax/3])
            .range([height - margin, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        /* Add SVG */
        svg
            // .attr("width", (width + margin) + "px")
            .attr('padding','20px 20px')
            .attr("height", (height + 40) + "px")
            .attr('preserveAspectRatio','none')
            .attr('viewBox','-40 -10 1000 300')
            .append('g')
            .attr("transform", `translate(${margin}, ${margin})`);


        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.mainValue));

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
                d3.selectAll('.line')
                    .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.circle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line")
                    .style('opacity', lineOpacity);
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
                    .text(`${d.mainValue}`)
                    .attr("x", d => xScale(d.date) + 5)
                    .attr("y", d => yScale(d.mainValue) - 10);
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
            .attr("cy", d => yScale(d.mainValue))
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
