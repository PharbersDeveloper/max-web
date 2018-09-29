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
        const width = 500;
        const height = 300;
        const margin = {
          left: 300,
          right: 20,
          top: 90,
          bottom: 52
        }

        const svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);
        //绘制区域

        const g = svg.append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
        //图表区域


        const data = [
          {
            name: "北京市",
            current: 1,
            last:2,
            value: 619.7
          },
          {
            name: "上海市",
            current: 2,
            last:2,
            value: 302.9
          },
          {
            name: "广州市",
            current: 3,
            last:5,
            value: 200.9
          },
            {
            name: "成都市",
            current: 4,
            last:5,
            value: 58.2
          },
            {
            name: "郑州市",
            current: 5,
            last:5,
            value: 53.6
          }
        ];

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xValue = d => d.value;
        const yValue = d => d.name;
        const current = d => d.current;

        const xScale = d3.scaleLinear()
          .domain([0, d3.max(data, xValue)])
          .range([0, innerWidth]);

        const yScale = d3.scaleBand()
          .domain(data.map(yValue).reverse())
          .range([innerHeight, 0])
          .padding(0.12);

        const currents = data.map(current);

        const groups = g.selectAll('g').data(data);
        const groupsEnter = groups
          .enter().append('g')
            .attr('transform', d => `translate(0, ${yScale(yValue(d))})`);

        groupsEnter
          .append('rect')
            .attr('class', 'bar')
            .attr('fill','red')
            .attr('width', d => xScale(xValue(d))+25)
            .attr('height', yScale.bandwidth());

        // groupsEnter
        //   .append('text')
        //     .attr('class', 'label')
        //     .attr('x', -100)
        //     .attr('y', yScale.bandwidth() / 2)
        //     .text(yValue);

        // const percentFormat = d3.format(",.1%");
        // const xPercent = d => percentFormat(xValue(d) / 1235.3);

        // groupsEnter
        //   .append('text')
        //     .attr('class', 'number')
        //     .attr('x', d => xScale(xValue(d)) + 33)
        //     .attr('y', yScale.bandwidth() / 2)
        //     .text(d => `${xValue(d)} (${xPercent(d)})`);
    }
});
