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
        var margin = {top: 0, right: 10, bottom: 10, left: 10};
        var width = 1200 - margin.left - margin.right;
        var height = 900 - margin.top - margin.bottom;
        // var color = d3.scaleOrdinal(d3.schemeCategory20c);
        //scaleOrdinal获取或指定当前比例尺的输入域
        let colorArray = ["#30d3c1","#5cd3c6","#89d4cc","#b0dad6","#d1e4e1"];
        var color = d3.scaleOrdinal(colorArray);
        var projection = d3.geoMercator() //地图的投影方法
                           .center([110, 25]) //中心设置在经度110,维度38
                           .scale([800]) //缩放因子
                            .translate([550,550]) // 坐标原点为550,550
                           .precision([.1]); //小数点后显示多少个数字
        var path = d3.geoPath()
                     .projection(projection); //创建路径并应用投影
        let svgContain = d3.select('.map-area');
        var svg = svgContain.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('viewBox', '0 0 960 600');
        let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        let tooltip = d3.select("div.tooltip"); // 各个地图信息展示区域

        var url = "http://jeorch.top/ChindMapD3/china.geojson";
        d3.json(url, function(error, china) {
          if (error) throw error;
          svg.selectAll("path")
        			.data(china.features)
        			.enter()
        			.append("path")
        			.attr("stroke","#fff") //map border color
        			.attr("stroke-width",1) // border width
                    .attr("fill", function(d,i){
                        console.log(d);
        				return color(i); // area color
        			})
        			.attr("d", path )
        			.on("mouseover",function(d,i){
                        d3.select(this).attr("fill","gray").attr("stroke-width",2);
                        return tooltip.style("hidden", false).html("this");
                    })
                    .on("mousemove",function(d){
                        tooltip.classed("hidden", false)
                               .style("top", (d3.event.offsetY) + "px")
                               .style("left", (d3.event.offsetX+30) + "px")
                               .html(function(){
                                   return d.properties.name + `<br>`
                                   + "市场销售额：" + "10000" + `<br>`
                                   + "产品销售额：" + "150000" + `<br>`
                                   + "份额：" + "15%";
                               });
                    }) //鼠标当前区域现实文字
                    .on("mouseout",function(d,i){
                        d3.select(this).attr("fill",color(i)).attr("stroke-width",1);
                        tooltip.classed("hidden", true);
                    }); //鼠标移开后恢复
        });
    }
});
