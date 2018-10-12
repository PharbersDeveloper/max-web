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
    },

    didReceiveAttrs() {
        this._super(...arguments);
        run.schedule('render', this, this.drawMultiLineChoose);
    },
    drawMultiLineChoose() {
        d3.select('svg.much-lines').remove();
        d3.select('.multi-lines-choose .legendContainer').remove();
        let svgContainer = d3.select(this.element);
        let svg = svgContainer.append("svg").attr('class', 'much-lines');
        // let data = this.get('chooseData');
        let chooseData = this.get('chooseData');
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
        var parseDate = d3.timeParse("%Y%m");
        let formatDateIntoYearMonth = d3.timeFormat('%Y-%m');

        let data = chooseData.map(function(item) {
            let proditem = {};
            proditem.name = item.name;
            let inValues = item.values.map(function(iitem, iindex) {
                var valueItem = {};
                valueItem.ym = parseDate(iitem.ym);
                valueItem.unit = iitem.unit;
                valueItem.value = iitem.value;

                return valueItem;
            })
            proditem.values = inValues;

            return proditem;
        })
        // data.forEach(function(d) {
        //     d.values.forEach(function(dd) {
        //         dd.ym = parseDate(dd.ym);
        //         dd.value = +dd.value;
        //     });
        // });
        /* Scale */
        var xScale = d3.scaleTime()
            .domain(d3.extent(data[0].values, d => d.ym))
            .range([0, width - margin]);
        let yMax = 0,
            yMin = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            let max = d3.max(data[i].values, d => d.value);
            let min = d3.min(data[i].values, d => d.value);
            if (max > yMax) {
                yMax = max
            }
            if (min < yMin) {
                yMin = min
            }
        };

        var yScale = d3.scaleLinear()
            .domain([yMin, yMax + yMax / 3])
            .range([height - margin, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        /* Add SVG */
        svg.attr("width", "90%")
            .attr("height", 300)
            .attr('preserveAspectRatio', 'none')
            .attr('viewBox', '-40 -10 950 380')
            .append('g');
        // .attr("transform", `translate(${margin}, ${margin})`);
        function make_y_gridlines() {
            return d3.axisLeft(yScale)
                .ticks(7)
        };
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            );
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
        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(formatDateIntoYearMonth);
        var yAxis = d3.axisLeft(yScale).ticks(7);

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
            .text("");
        //绘制图例区域
        let legendContainer = svgContainer.append('div').attr('class', 'legendContainer');
        var legendArea = legendContainer.append("svg")
            .attr('width', 90)
            .attr('height', 30 * data.length);
        // .attr("transform", "translate(80,15)");

        //绑定数据，设置每个图例的位置
        var legend = legendArea.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 30 + ")";
            });
        //添加图例的矩形色块
        legend.append("rect")
            .attr("x", 10)
            .attr("y", 5)
            .attr('width', 10)
            .attr('height', 10)
            .style("fill", function(d, i) {
                return color(i);
            });

        //添加图例文字
        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr('class', 'legend-text')
            .style("fill", '#485465')
            .style('font-size', '12px')
            .attr("dy", ".35em")
            .text(function(d, i) {
                return d.name;
            });
    }

});