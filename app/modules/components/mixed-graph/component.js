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
    classNames: ['col-md-12', 'col-sm-12', 'col-xs-12', 'mixed-graph'],
    init() {
        this._super(...arguments);
        this.mixedGraphData = [{
            'province': 'aa',
            'scale': 13,
            'frequency': 0.08,
        }, {
            'province': 'bb',
            'scale': 12,
            'frequency': 0.09
        }, {
            'province': 'cc',
            'scale': 13,
            'frequency': 0.09
        }, {
            'province': 'dd',
            'scale': 12,
            'frequency': 0.09
        }, {
            'province': 'ee',
            'scale': 13,
            'frequency': 0.08
        }, {
            'province': 'ff',
            'scale': 12,
            'frequency': 0.09
        }, {
            'province': 'gg',
            'scale': 12,
            'frequency': 0.09
        }, ];
    },
    didReceiveAttrs() {
        this._super(...arguments);
        run.schedule('render', this, this.drawMixedGraph);
    },
    drawMixedGraph() {
        let data = this.get('mixedGraphData');
        let svg = d3.select(this.element);
        let margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        let width = 900;
        let height = 360;
        //     var x = d3.scale.ordinal()
        // .rangeRoundBands([0, width], .1);
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)

        var y = d3.scaleLinear()
            .range([height, 0]);

        var y1 = d3.scaleLinear()
            // .domain([20, 80])
            .range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x)

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(10, "%");
        // create right yAxis
        var yAxisRight = d3.axisRight().scale(y1).ticks(10);
        svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // d3.tsv("data.tsv", type, function(error, data) {
        // if (error) throw error;

        x.domain(data.map(function(d) {
            return d.province;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.frequency;
        })]);
        y1.domain([0, d3.max(data, function(d) {
            return d.scale;
        })]);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(-3," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.append("g")
            .attr("class", "y axis axisRight")
            .attr("transform", "translate(" + (width) + ",0)")
            .call(yAxisRight)
            .append("text")
            .attr("y", 6)
            .attr("dy", "-2em")
            .attr("dx", "2em")
            .style("text-anchor", "end")
            .text("#");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("y", 500)
            .transition().duration(1000)
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.province);
            })
            // .attr("width", x.rangeBand())
            .attr('width', x.bandwidth()/2)
            .attr("y", function(d) {
                return y(d.frequency);
            })
            .attr("height", function(d) {
                return height - y(d.frequency);
            });

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) {
                return x(d.province) + x.bandwidth() / 2;
                // return x(d.province)
            })
            .attr("width", x.bandwidth() / 2)
            .attr("y", function(d) {
                return y1(d.scale);
            })
            .attr("height", function(d, i, j) {
                return height - y1(d.scale);
            });
        // });

        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
    }

});
