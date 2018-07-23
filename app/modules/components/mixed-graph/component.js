import Component from '@ember/component';
import { run, later } from '@ember/runloop';
import { get } from '@ember/object';
import d3 from 'd3';
export default Component.extend({
    tagName: 'div',
    classNames: ['mixed-graph'],
    init() {
        this._super(...arguments);
    },
    didReceiveAttrs() {
        this._super(...arguments);
        run.scheduleOnce('render', this, this.drawMixedGraph);
    },
    drawMixedGraph() {
        // console.info(this.get('mixedGraphData'));
        // if(this.get('mixedGraphData').length ==0) {
        // 	return;
        // }
        d3.select('svg.mixed-graph-svg').remove();
        let svg = d3.select(this.element).append('svg')
            .attr('class', 'mixed-graph-svg')
        let data = this.get('mixedGraphData');
        let margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        let legendTitle = ['市场规模', '产品销售额', '市场增长率', '产品增长率'];
        let width = 900;
        let height = 360;
        // 显示多少个柱状
        let numBars = 14;

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
            .ticks(10);
        let diagram = svg
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", '100%')
            .attr('height', 420)
            .attr('preserveAspectRatio', 'none')
            .attr('viewBox', '-20 0 950 420')
            .append("g")
            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

        x.domain(data.slice(0, numBars).map(function(d) {
            return d.province;
        }))
        // 左Y轴的最大值
        // 市场规模
        let scaleMax = d3.max(data, function(d) {
            return d.scale;
        })
        //  市场销售额
        let salesMax = d3.max(data, function(d) {
            return d.sales;
        });
        if (scaleMax > salesMax) {
            y.domain([0, (scaleMax + scaleMax / 3)]);
        } else {
            y.domain([0, (salesMax + salesMax / 3)]);
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
        svg.append("g")
            .attr("class", "x axis xaxis")
            // .attr("transform", "translate(-3," + height + ")")
            .attr("transform", "translate(-10," + height + ")")
            .call(xAxis);

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

        bars.selectAll('.bar')
            .data(data.slice(0, numBars), function(d) {
                return d.province;
            })
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) {
                return x(d.province) + 18;
            })
            .attr("width", 18)
            .attr("y", function(d) {
                return y(d.sales);
            })
            .attr("height", function(d, i, j) {
                return height - y(d.sales);
            });
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
            .attr("class", "mixedline")
            .style("stroke", "#FA6F80")
            .attr("transform", "translate(18," + 0 + ")")
            // .style("filter", "url(#drop-shadow)")
            .attr("d", marketGrowth);

        // 绘制产品增长折线图
        svg.append("path")
            .data([data])
            .attr("class", "mixedline2")
            .style("stroke", "#7CFFE2")
            .attr("transform", "translate(18," + 0 + ")")
            // .style("filter", "url(#drop-shadow)")
            .attr("d", prodGrowth);

        /**
         * 绘制图例区域
         */
        let legendArea = svg.append('g')
            .attr('transform', 'translate(0,410)')
            .attr('class', 'legendArea');
        // 绑定数据
        let legend = legendArea.selectAll('text')
            .data(legendTitle)
            .enter()
            .append('text')
            .text(function(d) {
                return d;
            })
            .attr('class', 'legend-text')
            .attr('x', function(d, i) {
                return i * 100;
            })
            .attr('y', 6)
            .attr('fill', 'red')
        // 添加图例

        // legend.append('rect')
        //     .attr('height',10)
        // 	.attr('width',5)
        // 	.style('fill')

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

            // var subBars = diagram.selectAll('.subBar')
            //     .data(data)
            //
            // subBars.enter().append("rect")
            //     .classed('subBar', true)
            //     .attr('height',function(d){
            //         return 30 - yOverview(d.scale)
            //     })
            //     .attr('width',6)
            //     .attr('x',function(d) {
            //         return xOverview(d.province);
            //     })
            //     .attr('y',function(d) {
            //         return height + 30 + yOverview(d.scale)
            //     })
            // .attr({
            //     height: function(d) {
            //         return 30 - yOverview(d.scale);
            //     },
            //     width: function(d) {
            //         // return xOverview.rangeBand()
            //         return 6;
            //     },
            //     x: function(d) {
            //
            //         return xOverview(d.province);
            //     },
            //     y: function(d) {
            //         // return height + 30 + yOverview(d.scale)
            //         return height + 30 + yOverview(d.scale)
            //     }
            // })

            // var displayed = d3.scaleQuantize()
            //     .domain([0, width])
            //     .range(d3.range(data.length));
            // console.log('ttttttttttttttttest')
            // console.log(d3.range(data.length));
            // console.log(parseFloat(numBars * width));
            // console.log(Math.round(parseFloat(numBars * width) / data.length))
            diagram.append("rect")
                .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                .attr("class", "mover")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 10)
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
            svg.selectAll('.mixedline')
                .data([new_data])
                .attr("class", "mixedline")
                .style("stroke", "#FA6F80")
                .attr("transform", "translate(18," + 0 + ")")
                // .style("filter", "url(#drop-shadow)")
                .attr("d", marketGrowth);
            // svg.append("path")
            svg.selectAll('.mixedline2')
                .data([new_data])
                .attr("class", "mixedline2")
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