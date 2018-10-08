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
        var arcGenerator = d3.arc()
        .innerRadius(80)
        .outerRadius(100)
        .startAngle(0);
        var picture = d3.select('svg')
        .append('g')
        .attr('transform','translate(290,180)');
        var backGround = picture.append("path")
            .datum({endAngle: 2 * Math.PI})
            .style("fill", "#E1E1E1")
            .attr("d", arcGenerator);
        var upperGround = picture.append('path')
          .datum({endAngle:Math.PI / 2})
          .style('fill','#60B3AD')
          .attr('d',arcGenerator)
        var dataText = d3.select('g')
            .append('text')
            .text("0%")
            .attr('text-anchor','middle')
            .attr('dominant-baseline','middle')
            .attr('font-size','38px')
        d3.interval(function(){  //每隔指定的毫秒数循环调用函数或表达式
          upperGround.transition().duration(750)  //设置了当前DOM属性过渡变化为指定DOM属性过程所需时间（毫秒）
          .attrTween('d',function(d){  //插值功能API
           var compute = d3.interpolate(d.endAngle,Math.random() * Math.PI * 2);  //实现了插值范围[当前角度值，随机角度值]
           return function(t){
            d.endAngle = compute(t);
            var data = d.endAngle / Math.PI / 2 * 100;
            //设置数值
            dataText.text(data.toFixed(0) + '%');
            //将新参数传入，生成新的圆弧构造器
            return arcGenerator(d);
           }
          })
         },2000)
    }
});
