import Component from '@ember/component';
import { run } from '@ember/runloop';
// import china from '../common/map/china';
// import china from '../../common/map/china'
import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    classNames: ['col-md-12', 'col-sm-12', 'col-xs-12'],
    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawChart);
    },
    drawChart() {
        var margin = {top: 10, right: 10, bottom: 10, left: 10};
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
        var svg = d3.select("svg")
                    .append("g")
                    .attr("width", width)
                    .attr("height", height);
        var tooltip = d3.select("div.tooltip");
        d3.json("../common/map/china.geojson", function(error, china) {
          if (error) throw error;
          svg.selectAll("path")
        			.data(china.features)
        			.enter()
        			.append("path")
        			.attr("stroke","grey")
        			.attr("stroke-width",1)
                    .attr("fill", function(d,i){
        				return color(i);
        			})
        			.attr("d", path )
        			.on("mouseover",function(d,i){
                        d3.select(this).attr("fill","grey").attr("stroke-width",2);
                        return tooltip.style("hidden", false).html(d.properties.name);
                    })
                    .on("mousemove",function(d){
                        tooltip.classed("hidden", false)
                               .style("top", (d3.event.pageY) + "px")
                               .style("left", (d3.event.pageX+10) + "px")
                               .html(d.properties.name);
                    })
                    .on("mouseout",function(d,i){
                        d3.select(this).attr("fill",color(i)).attr("stroke-width",1);
                        tooltip.classed("hidden", true);
                    });
        });
    }
});
