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
    classNames: ['mixed-graph'],
    init() {
        this._super(...arguments);
        // this.mixedGraphData = [{
        //     'province': 'aa',
        //     'scale': 22,
        //     'sales': 20,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.09,
        //
        // }, {
        //     'province': 'bb',
        //     'scale': 55,
        //     'sales': 50,
        //     'market_growth': 0.09,
        //     'prod_growth': -0.04,
        //
        // }, {
        //     'province': 'cc',
        //     'scale': 66,
        //     'sales': 60,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.17,
        //
        // }, {
        //     'province': 'dd',
        //     'scale': 55,
        //     'sales': 50,
        //     'market_growth': 0.09,
        //     'prod_growth': -0.04,
        //
        // }, {
        //     'province': 'ee',
        //     'scale': 22,
        //     'sales': 20,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.29,
        //
        // }, {
        //     'province': 'ff',
        //     'scale': 66,
        //     'sales': 60,
        //     'market_growth': 0.09,
        //     'prod_growth': -0.04,
        //
        // }, {
        //     'province': 'gg',
        //     'scale': 55,
        //     'sales': 50,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.23,
        //
        // }, {
        //     'province': 'hh',
        //     'scale': 16,
        //     'sales': 7,
        //     'market_growth': 0.09,
        //     'prod_growth': -0.04,
        //
        // }, {
        //     'province': 'ii',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'jj',
        //     'scale': 70,
        //     'sales': 20,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'kk',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'll',
        //     'scale': 70,
        //     'sales': 20,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'mm',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'nn',
        //     'scale': 72,
        //     'sales': 40,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'oo',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'pp',
        //     'scale': 70,
        //     'sales': 60,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'qq',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'rr',
        //     'scale': 70,
        //     'sales': 40,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'ss',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'tt',
        //     'scale': 70,
        //     'sales': 30,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'uu',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'vv',
        //     'scale': 74,
        //     'sales': 40,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'ww',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'xx',
        //     'scale': 70,
        //     'sales': 60,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'yy',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'zz',
        //     'scale': 70,
        //     'sales': 10,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'aaa',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'bbb',
        //     'scale': 70,
        //     'sales': 45,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'ccc',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'ddd',
        //     'scale': 70,
        //     'sales': 24,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'eee',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.01,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'fff',
        //     'scale': 70,
        //     'sales': 54,
        //     'market_growth': -0.01,
        //     'prod_growth': 0.25,
        //
        // }, {
        //     'province': 'ggg',
        //     'scale': 77,
        //     'sales': 70,
        //     'market_growth': -0.03,
        //     'prod_growth': 0.85,
        //
        // }, {
        //     'province': 'hhh',
        //     'scale': 70,
        //     'sales': 36,
        //     'market_growth': -0.01,
        //     'prod_growth': 0.25,
        //
        // }, ];
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
        // 显示多少个柱状
        let numBars = 14;

        //     var x = d3.scale.ordinal()
        // .rangeRoundBands([0, width], .1);
        var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(.1)

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var y1 = d3.scaleLinear()
            // .domain([20, 80])
            .rangeRound([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x)

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(10);
        // create right yAxis
        var yAxisRight = d3.axisRight()
            .scale(y1)
            .ticks(10, '%');
        let diagram = svg
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", '100%')
            .attr('height', 400)
            .attr('preserveAspectRatio', 'none')
            .attr('viewBox', '-20 0 950 400')
            .append("g")
            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            .attr("transform", "translate(" + 0 + "," + 0 + ")");


        // d3.tsv("data.tsv", type, function(error, data) {
        // if (error) throw error;

        // x.domain(data.map(function(d) {
        //     return d.province;
        // }));
        x.domain(data.slice(0, numBars).map(function(d) {
            return d.province;
        }))
        // 左Y轴的最大值
        // 市场规模
        let scaleMax = d3.max(data, function(d) {
            return d.scale;
        })
        // y.domain([0,(scaleMax+scaleMax/3)]);
        // y.domain([0, d3.max(data, function(d) {
        //     return d.scale;
        // })]);
        //  市场销售额
        let salesMax = d3.max(data, function(d) {
            return d.sales;
        });
        if (scaleMax > salesMax) {
            y.domain([0, (scaleMax + scaleMax / 3)]);
            // y1.domain([0,(scaleMax+scaleMax/3)])
        } else {
            y.domain([0, (salesMax + salesMax / 3)]);
            // y1.domain([0,(salesMax+salesMax/3)])
        }
        //  右Y轴的最大值以及最小值
        let marketMax = d3.max(data, function(d) {
            return d.market_growth;
        });
        let marketMin = d3.min(data, function(d) {
            return d.market_growth;
        });
        let prodMax = d3.max(data, function(d) {
            return d.prod_growth;
        })
        let prodMin = d3.min(data, function(d) {
            return d.prod_growth;
        });
        let minimum = 0;
        if (marketMin < prodMin) {
            minimum = marketMin;
        } else {
            minimum = prodMin;
        };
        if (marketMax > prodMax) {
            if (minimum < 0) {
                y1.domain([minimum / 3 + minimum, (marketMax + marketMax / 3)]);
            } else {
                y1.domain([minimum - minimum / 3, (marketMax + marketMax / 3)]);
            }
        } else {
            if (minimum < 0) {
                y1.domain([minimum / 3 + minimum, (prodMax + prodMax / 3)]);
            } else {
                y1.domain([minimum - minimum / 3, (prodMax + prodMax / 3)]);
            }
        }
        // y1.domain([0,(salesMax+salesMax/3)])
        // y1.domain([0, d3.max(data, function(d) {
        //     return d.sales;
        // })]);
        svg.append("g")
            .attr("class", "x axis xaxis")
            // .attr("transform", "translate(-3," + height + ")")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // let bars = svg.append("g");
        svg.append("g").attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("scale");

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
        let bars = svg.append("g");
        // svg.selectAll(".bar")
        bars.selectAll(".bar")
            // .data(data)
            .data(data.slice(0, numBars), function(d) {
                return d.province;
            })
            .enter().append("rect")
            .attr("y", 500)
            .transition().duration(1000)
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.province);
            })
            .attr("width", 18)
            // .attr('width', x.bandwidth()/2)
            .attr("y", function(d) {
                return y(d.scale);
            })
            .attr("height", function(d) {
                return height - y(d.scale);
            });

        // svg.selectAll(".bar")
        bars.selectAll('.bar')
            // .data(data)
            .data(data.slice(0, numBars), function(d) {
                return d.province;
            })
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) {
                // return x(d.province) + x.bandwidth() / 2;
                return x(d.province) + 18;
            })
            // .attr("width", x.bandwidth() / 2)
            .attr("width", 18)
            .attr("y", function(d) {
                return y(d.sales);
            })
            .attr("height", function(d, i, j) {
                return height - y(d.sales);
            });
        // });
        // 绘制市场增长折线图
        let marketGrowth = d3.line()
            .x(function(d) {
                return x(d.province);
            })
            .y(function(d) {
                return y1(d.market_growth);
            });
        let prodGrowth = d3.line()
            .x(function(d) {
                return x(d.province);
            })
            .y(function(d) {
                return y1(d.prod_growth);
            });

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#FA6F80")
            .attr("transform", "translate(18," + 0 + ")")
            // .style("filter", "url(#drop-shadow)")
            .attr("d", marketGrowth);

        // 绘制产品增长折线图
        svg.append("path")
            .data([data])
            .attr("class", "line2")
            .style("stroke", "#7CFFE2")
            .attr("transform", "translate(18," + 0 + ")")
            // .style("filter", "url(#drop-shadow)")
            .attr("d", prodGrowth);


        function type(d) {
            d.sales = +d.sales;
            return d;
        }
        // 设置滑动区域
        if (true) {
            var xOverview = d3.scaleBand()
                .domain(data.map(function(d) {
                    return d.province;
                }))
                .rangeRound([0, width])
                .padding(0.2);
            let yOverview = d3.scaleLinear().range([30, 0]);
            yOverview.domain(y.domain());

            var subBars = diagram.selectAll('.subBar')
                .data(data)

            subBars.enter().append("rect")
                .classed('subBar', true)
                .attr({
                    height: function(d) {
                        return 30 - yOverview(d.scale);
                    },
                    width: function(d) {
                        // return xOverview.rangeBand()
                        return 6;
                    },
                    x: function(d) {

                        return xOverview(d.province);
                    },
                    y: function(d) {
                        // return height + 30 + yOverview(d.scale)
                        return height + 30 + yOverview(d.scale)
                    }
                })

            var displayed = d3.scaleQuantize()
                .domain([0, width])
                .range(d3.range(data.length));

            diagram.append("rect")
                .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                .attr("class", "mover")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 40)
                .attr("width", Math.round(parseFloat(numBars * width) / data.length))
                .attr("pointer-events", "all")
                .attr("cursor", "ew-resize")
                .call(d3.drag().on("drag", display));
        }

        function display() {
            var displayed = d3.scaleQuantize()
                .domain([0, width])
                .range(d3.range(data.length));
            var xinside = parseInt(d3.select(this).attr("x")),
                nx = xinside + d3.event.dx,
                w = parseInt(d3.select(this).attr("width")),
                f, nf, new_data;
            if (nx < 0 || nx + w > width) return;

            d3.select(this).attr("x", nx);

            f = displayed(xinside);
            nf = displayed(nx);

            if (f === nf) return;
            new_data = data.slice(nf, nf + numBars);
            // console.log(new_data);
            // console.log(x)

            x.domain(new_data.map(function(d) {
                return d.province;
            }));
            svg.select(".x.axis").call(xAxis);

            // let rects = bars.selectAll("rect")
            let rects = bars.selectAll(".bar")
                .data(new_data, function(d) {
                    return d.province;
                });
            let rects2 = bars.selectAll('.bar2')
                .data(new_data, function(d) {
                    return d.province
                });

            rects.attr("x", function(d) {
                return x(d.province);
            });
            rects2.attr("x", function(d) {
                return x(d.province) + 18;
            });
            svg.selectAll('.line')
                .data([new_data])
                .attr("class", "line")
                .style("stroke", "#FA6F80")
                .attr("transform", "translate(18," + 0 + ")")
                // .style("filter", "url(#drop-shadow)")
                .attr("d", marketGrowth);
            // svg.append("path")
            svg.selectAll('.line2')
                .data([new_data])
                .attr("class", "line2")
                .style("stroke", "#7CFFE2")
                .attr("transform", "translate(18," + 0 + ")")
                // .style("filter", "url(#drop-shadow)")
                .attr("d", prodGrowth);

            rects.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.province);
                })
                .attr("y", function(d) {
                    return y(d.scale);
                })
                .attr("width", 18)
                .attr("height", function(d) {
                    return height - y(d.scale);
                });
            rects2.enter().append("rect")
                .attr("class", "bar2")
                .attr("x", function(d) {
                    return x(d.province) + 18;
                })
                .attr("y", function(d) {
                    return y(d.sales);
                })
                .attr("width", 18)
                .attr("height", function(d) {
                    return height - y(d.sales);
                });

        }

    }

});
