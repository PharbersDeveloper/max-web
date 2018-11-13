import Component from '@ember/component';
import {
    run
} from '@ember/runloop';
import {
    get
} from '@ember/object'

import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    classNames: ['legend-pie-market'],
    width: 720,
    height: 300,
    attributeBindings: ['width', 'height'],
    init() {
        this._super(...arguments)
        this.margin = {
            top: 40,
            right: 20,
            bottom: 30,
            left: 20
        };
    },

    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawLegendPie)
    },

    drawLegendPie() {
        d3.select('.legend-pie-market svg.market-pie').remove();
        d3.select('.legend-pie-market .sales-tooltips').remove();
        d3.select('.legend-pie-market .legendContainer').remove();
        let svgContainer = d3.select(this.element);
        let svg = svgContainer.append("svg").attr('class', "market-pie");
        let width = get(this, 'width')
        let height = get(this, 'height')

        let margin = this.get('margin');
        let radius = 130;
        var pieData = this.get('pieData');
        var dataTitle = [];
        var pieColor = [];
        var pieValue = [];
        let pieTips = [];

        let handledData = [];
        pieData.map(function(d,index){
            let tempData = [];
            d.TipDetail.map(function(t,index){
                let temp = {
                    key:"",
                    value:"",
                    unit:"",
                }
                temp.key = t.key;
                temp.value = t.value;
                temp.unit = t.unit;
                tempData.push(temp);
            });
            let temp = {
                show_value:"",
                show_unit:"",
                title:"",
                color:"",
                TipDetail:[],
            }
            temp.show_value = d.show_value;
            temp.show_unit = d.show_unit;
            temp.title = d.title;
            temp.color = d.color;
            temp.TipDetail = tempData;
            handledData.push(temp);
        });
        pieData = handledData;
        
        pieData.map(function(item, index) {
            dataTitle.push(item.title);
        });
        pieData.map(function(item, index) {
            pieColor.push(item.color);
        });
        pieData.map(function(item, index) {
            pieValue.push(item.show_value);
        });
        pieData.map((item, index) => pieTips.push(item.TipDetail));
        var outerRadius = 140;
        var innerRadius = 85;
        let data = pieValue;
        let color = pieColor
        let arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        let arc2 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius + 10)
        var pie = d3.pie()
            .value(function(d) {
                return d.show_value
            })

        svg.datum(pieData)
            .attr("width", '100%')
            .attr("height", height)
            .attr('viewBox', '0 0 ' + 300 + ' ' + 300)
            .attr('preserveAspectRatio', 'xMidYMid', 'meet')
            .append("g")
            .attr("transform", "translate(" + 130 + "," + 150 + ")");
        var tooltip = svgContainer
            .append("div")
            .attr("class", "sales-tooltips");

        function htmlText(d, i) {
            let tips = d.data.TipDetail;
            let tipsStr = "";
            for (let m = 0, len = tips.length; m < len; m++) {
                tipsStr += "<p class='tipsline'><span>" + tips[m].key + "</span><span>" + tips[m].value + tips[m].unit + "</span></p>";
            }
            return tipsStr;
        };
        var arcs = svg.selectAll("g.arc")
            .data(pie)
            .enter().append("g")
            .attr("class", "arc")
            // 将g移至中间
            .attr("transform", "translate(100,150)")
            //为每一块元素添加鼠标事件
            .on("mouseover", function(d, i) {
                let containerWidth = svgContainer.style('width');
                let currentWidth = Number(containerWidth.slice(0, (containerWidth.length - 2)));
                let left = arc.centroid(d)[0] + currentWidth / 3;
                let top = arc.centroid(d)[1] + 100;
                let html = htmlText(d, i);
                d3.select(this).select("path").transition().attr("d", function(d) {
                    return arc2(d);
                });
                // tooltip
                d3.select(".sales-tooltips")
                    .style("left", left + "px")
                    .style("top", top + "px")
                    .html("<p class='pie-title'><span>" + d.data.title + "</span></p>" +
                        html)
                    .style("opacity", 1);
                let titleDot = d3.select('.pie-title').insert("svg", ".pie-title span:first-child").attr("class", "pie-dots");
                titleDot.append("g").selectAll('circle')
                    .data(['color'])
                    .enter().append('circle')
                    .attr('class', 'dot-circle')
                    .attr('cx', 10)
                    .attr('cy', 16)
                    .attr('r', 4)
                    .attr("fill", d.data.color)

            })

            .on("mouseout", function(d) {
                d3.select(this).select("path").transition().attr("d", function(d) {
                    return arc(d);
                })
                d3.select(".sales-tooltips").style("opacity", 0);
            });

        //绘制图例区域
        let legendContainer = svgContainer.append('div').attr('class', 'legendContainer');
        var legendArea = legendContainer.append("svg")
            .attr('width', 400)
            .attr('height', 30 * pieData.length);
        //绑定数据，设置每个图例的位置
        var legend = legendArea.selectAll("g")
            .data(pieData)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 30 + ")";
            });
        //添加图例的矩形色块
        legend.append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr('r', 5)
            .style("fill", function(d, i) {
                return color[i]
            });

        //添加图例文字
        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr('class', 'legend-text')
            .style("fill", function(d, i) {
                return '#485465'
            })
            .style('font-size', '12px')
            .attr("dy", ".35em")
            .text(function(d, i) {
                return d.title;
            });
        arcs.append("path")
            .attr("fill", function(d, i) {
                return color[i];
            })
            .transition()
            .ease(d3.easeBounce)
            .duration(2000)
            .attrTween("d", tweenPie)
            .transition()
            .ease(d3.easeElastic)
            .delay(function(d, i) {
                return 100 + i * 50;
            })
            .duration(1000)
            .attrTween("d", tweenDonut);
        arcs.append("text")
            .attr("transform", function(d) {
                //get the centroid of every arc, include x and y, 质心
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr('class', 'inside')
            .text(function(d) {
                return d.value + '%';
            })

        function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({
                startAngle: 0,
                endAngle: 0
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }

        function tweenDonut(b) {
            b.innerRadius = radius * .6;
            var i = d3.interpolate({
                innerRadius: 0
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }
    }
});