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
        var color = d3.scaleOrdinal(d3.schemeCategory20c);
        var projection = d3.geoMercator()
                           .center([110, 25])
                           .scale([800])
                           .translate([550,550])
                           .precision([.1]);
        var path = d3.geoPath()
                     .projection(projection);
        let svgContain = d3.select('.map-area');
        // let tooltip = svgContain.append('div').attr("class", "tooltip").style("opacity", 1);
        var svg = svgContain.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('viewBox', '0 0 960 600');
        let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        let tooltip = d3.select("div.tooltip");

        var url = "http://jeorch.top/ChindMapD3/china.geojson";
        d3.json(url, function(error, china) {
          if (error) throw error;
          svg.selectAll("path")
        			.data(china.features)
        			.enter()
        			.append("path")
        			.attr("stroke","gray")
        			.attr("stroke-width",1)
                    .attr("fill", function(d,i){
        				return color(i);
        			}) //map border color
        			.attr("d", path )
        			.on("mouseover",function(d,i){
                        d3.select(this).attr("fill","#2DD2C2").attr("stroke-width",2);
                        return tooltip.style("hidden", false).html("this");
                    })
                    .on("mousemove",function(d){
                        console.log(d)
                        tooltip.classed("hidden", false)
                               .style("top", (d3.event.offsetY) + "px")
                               .style("left", (d3.event.offsetX+30) + "px")
                               .html(function(){
                                   return d.properties.name
                               });
                    }) //鼠标当前区域现实文字
                    .on("mouseout",function(d,i){
                        d3.select(this).attr("fill",color(i)).attr("stroke-width",1);
                        tooltip.classed("hidden", true);
                    }); //鼠标移开后恢复
        });
    }
});
