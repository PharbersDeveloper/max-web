import Component from '@ember/component';
import d3 from 'd3';

export default Component.extend({
    classNames:['col-md-4','col-sm-12'],
    init() {
        this._super(...arguments)
        // window.console.info(d3)
        // this.dataValue = [1,4,6,4];
        this.legendValue= ['aa','bb','cc','dd'];
        this.colorValue = ['red','lightblue','green','orange'];
    },
    didInsertElement() {
        this._super(...arguments);
        var margin = {
                top: 40,
                right: 20,
                bottom: 30,
                left: 20
            },

            // width = document.body.clientWidth - margin.left - margin.right,
            width = this.$('#pie-chart').width()- margin.left - margin.right,
            height = 380 - margin.top - margin.bottom,
        // var width = 960,
        // height = 500,
        // radius = Math.min(width, height) / 2 - 10;
        radius = 140;

// var data = [0.3,0.2,0.2,0.3];
// var data_show = [1,7,8,6];
// var arr = ['aaa','111','222','333','444']
// window.console.info(data_show);
// var color = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",];
        let data = this.get('dataValue');
        let arr = this.get('legendValue');
        let color = this.get('colorValue');
var arc = d3.arc()
    .outerRadius(radius);

var pie = d3.pie();

var svg = d3.select(this.$('#pie-chart')[0]).append("svg")
    .datum(data)
    .attr("width", '100%')
    .attr("height", height)
    .attr('viewBox','0 0 '+500+' '+300)
    .attr('preserveAspectRatio','xMidYMid','meet')
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arcs = svg.selectAll("g.arc")
    .data(pie)
  .enter().append("g")
    .attr("class", "arc");
    var legend = d3.select(this.$('#pie-chart')[0]).append("svg")
          .attr("class", "legend")
          .attr("width", 120)
          .attr("height", 300)
        .selectAll("g")
          .data(arr.slice(1).reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; });

      legend.append("circle")
          .attr("cx", 15)
          .attr("cy", 15)
          .attr("r", 10)
          .style("fill", "red");

      legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { return d; });

arcs.append("path")
    .attr("fill", function(d, i) { return color[i]; })
  .transition()
    // .ease("bounce")
    .duration(2000)
    .attrTween("d", tweenPie)
  .transition()
    // .ease("elastic")
    .delay(function(d, i) { return 2000 + i * 50; })
    .duration(750)
    .attrTween("d", tweenDonut);

function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
  b.innerRadius = radius * .6;
  var i = d3.interpolate({innerRadius: 0}, b);
  return function(t) { return arc(i(t)); };
}


// var arr = [{age:"1",pp:"22"},{age:"2",pp:"22"},{age:"3",pp:"22"},{age:"4",pp:"22"},{age:"5",pp:"22"},{age:"6",pp:"22"},{age:"7",pp:"22"} ];
//   console.info(arr);
//   arr.forEach(function(d) {
//     var c = labelArc.centroid(d);
// //     console.log(c);
// //     console.log(d);
//     context.fillText(d.age, c[0], c[1]);
//     console.info(d.age)
//   });

    },
});
