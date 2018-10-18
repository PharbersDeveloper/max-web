import Component from '@ember/component';
import { run } from '@ember/runloop'
import { get } from '@ember/object'
import d3 from 'd3';

export default Component.extend({
    tagName: 'div',
    classNames: ['col-md-12', 'col-sm-12', 'col-xs-12', 'prod-sales-container'],
    width: 520,
    height: 260,
    attributeBindings: ['width', 'height'],
    init() {
        this._super(...arguments);
    },

    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawSingleLine);
    },
    drawSingleLine() {
        const singleLineData = this.get('singleLineData');
        d3.select('.prod-sales-container svg.single-line-svg').remove();

        var margin = {
    main: { // year v. innings pitched
      top: 10, right: 40, bottom: 80, left: 80
    },
    secondary: { // strikeouts, walks ...
      top: 10, right: 20, bottom: 40, left: 80
    }
  };

  var mainWidth = 625 - margin.main.left - margin.main.right;
  var mainHeight = 400 - margin.main.top - margin.main.bottom;

  var secondaryWidth = 250 - margin.secondary.left - margin.secondary.right;
  var secondaryHeight = 200 - margin.secondary.top - margin.secondary.bottom;

  // set this when you brush on the main graph
  var filterDates = [];

  /* load Verlander data */
  d3.csv("http://dhoboy.github.io/baseball/Justin_Verlander.csv", function(err, raw) {
    var data = raw.slice(0, raw.length - 1);

    // set up crossfilter
    var pitchingData = crossfilter(data);
    var years = pitchingData.dimension(function(d) {
      return +d.Year;
    });

    var metrics = {
      'BB': "Walks",
      'SO': "Strikeouts",
      'H': "Hits allowed",
      'ER': "Runs allowed",
      'W': "Wins",
      'L': "Loses",
      'ERA': "Earned Run Average",
      'CG': "Complete Games",
      //'SHO': "Shutouts"
    };

    /* make charts */
    var mainChart = d3.select("#mainChart")
      .append("svg")
      .attr("height", mainHeight + margin.main.top + margin.main.bottom)
      .attr("width", mainWidth + margin.main.left + margin.main.right)
        .append("g")
        .attr("transform", "translate(" + margin.main.left + "," + margin.main.top + ")");

    var secondaryCharts = Object.keys(metrics).map(function(metric) {
      var x = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return +d.Year; }))
                .range([0, secondaryWidth]);

      var y = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return +d[metric]; }))
                .range([secondaryHeight, 0]);

      return (
        { metric: metric,
          svg: d3.select("#secondaryCharts")
                   .append("svg")
                   .attr("class", "secondaryChart " + metric)
                   .attr("height", secondaryHeight + margin.secondary.top + margin.secondary.bottom)
                   .attr("width", secondaryWidth + margin.secondary.left + margin.secondary.right)
                     .append("g")
                     .attr("transform", "translate(" + margin.secondary.left + "," + margin.secondary.top + ")"),
          x: x,
          y: y,
          xAxis: d3.axisBottom(x).ticks(2).tickFormat(d3.format("")),
          yAxis: d3.axisLeft(y).ticks(5)
      });
    });

    /* for hovering on secondary charts */
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

    /* setup main chart */
    var mainX = d3.scaleBand()
      .domain(data.map(function(d) {
        return d.Year;
      }))
      .range([0, mainWidth])
      .padding(0.2);

    var mainY = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.IP; })])
      .range([mainHeight, 0]);

    // for getting dates out of brush on main graph
    var reverseMainX = d3.scaleLinear()
      .domain([0, mainWidth])
      .range(d3.extent(data, function(d) {
        return +d.Year;
      }));

    /* setup main axes */
    var mainXAxis = d3.axisBottom(mainX);
    var mainYAxis = d3.axisLeft(mainY);

    /* draw main graph */
    (function drawMainGraph() {
      mainChart.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) {
          return "bar yr" + d.Year;
        })
        .attr("x", function(d) {
          return mainX(d.Year);
        })
        .attr("y", function(d) {
          return mainY(+d.IP);
        })
        .attr("width", mainX.bandwidth())
        .attr("height", function(d) {
          return mainHeight - mainY(+d.IP);
        });

      /* draw axes */
      var mainXAxisG = mainChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + mainHeight + ")")
        .call(mainXAxis);

      mainXAxisG.append("text")
         .attr("transform", "translate(490,45)")
         .attr("class", "axis_title")
         .text("Year");

      mainChart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0" + ",0)")
        .call(mainYAxis)
        .append("text")
          .attr("transform", "translate(-50,0) rotate(-90)")
          .attr("class", "axis_title")
          .text("Innings Pitched");
      })();

      /* setup brush on main graph */
      var brush = d3.brushX()
        .extent([[0,-10],[mainWidth, mainHeight]])

      var mainBrush = mainChart.append("g")
        .attr("class", "brush")
        .call(brush);

      brush.on("brush end", function() {
        var brushSection = d3.brushSelection(this);

        if (brushSection === null) { // clear the brush
          d3.selectAll(".bar")
            .attr("class", function(d) {
              return "bar yr" + d.Year;
            });

          redrawSecondaryCharts(data, true);
        } else { // filter data for secondary graphs
          var f = d3.timeFormat("%Y");

          // set filterDates for secondary graphs
          filterDates = [
            Math.round(reverseMainX(brushSection[0])),
            Math.round(reverseMainX(brushSection[1])) + 1
          ];

          // clear all bar highlighting
          d3.selectAll(".bar")
            .attr("class", function(d) {
              return "bar yr" + d.Year + " unselected";
            });

          // highlight selected bars
          d3.range(filterDates[0], filterDates[1]).map(function(yr) {
            d3.select(".bar.yr" + yr)
              .attr("class", "bar yr" + yr + " selected");
          });

          // filter the data on the years selected
          years.filterRange(filterDates);
          redrawSecondaryCharts(years.bottom(pitchingData.size()));
        }
      });

    // draw secondary charts
    (function initializeSecondaryCharts() {
      secondaryCharts.forEach(function(chart) {
        var metric = chart.metric;
        var svg = chart.svg;
        var x = chart.x;
        var y = chart.y;
        var xAxis = chart.xAxis;
        var yAxis = chart.yAxis;

        // draw the points
        svg.selectAll(".point")
          .data(data, function(d) { return d.Year; })
          .enter()
          .append("circle")
          .attr("class", "point")
          .attr("cx", function(d) {
            return x(+d.Year);
          })
          .attr("cy", function(d) {
            return y(+d[metric]);
          })
          .attr("r", 5);

        // draw the axes
        svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0" + ",0)")
          .call(yAxis)
          .append("text")
            .attr("transform", "translate(-40,0) rotate(-90)")
            .attr("class", "axis_title")
            .text(metrics[metric]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + secondaryHeight + ")")
          .call(xAxis)
          .append("text")
            .attr("transform", "translate(150,40)")
            .attr("class", "axis_title")
            .text("Year");
      });
    })();

    function redrawSecondaryCharts(data, reset) {
      secondaryCharts.forEach(function(chart) {
        var metric = chart.metric;
        var svg = chart.svg;
        var x = chart.x;
        var y = chart.y;
        var xAxis = chart.xAxis;
        var yAxis = chart.yAxis;

        x.domain(d3.extent(data, function(d) { return +d.Year; }));
        y.domain(d3.extent(data, function(d) { return +d[metric]; }));

        svg.select(".x.axis")
          .transition()
          .duration(reset ? 0 : 750)
          .call(xAxis);

        svg.select(".y.axis")
          .transition()
          .duration(reset ? 0 : 750)
          .call(yAxis);

        var points = svg.selectAll(".point")
          .data(data, function(d) { return d.Year; })

        points
          .exit()
          .transition()
          .duration(reset ? 0 : 400)
          .remove();

        points
          .transition()
          .delay(reset ? 0 : 400)
          .duration(reset ? 0 : 500)
          .attr("cx", function(d) {
            return x(d.Year);
          });

        points
          .transition()
          .delay(reset ? 0 : 900)
          .duration(reset ? 0 : 500)
          .attr("cy", function(d) {
            return y(+d[metric]);
          });

        points
          .enter()
          .append("circle")
          .attr("class", "point")
          .attr("r", 5)
          .attr("cx", function(d) {
            return x(d.Year);
          })
          .attr("cy", function(d) {
            return y(+d[metric]);
          })
          .attr("fill-opacity", reset ? 1 : 0);

          // issues with the enter selection executing the
          // fill-opacity transition only when 'reseting' graph
          // graph resets on brush end where brush selection is null

        points
          .transition()
          .delay(reset ? 0 : 1400)
          .duration(reset ? 0 : 400)
          .attr("fill-opacity", 1);

        svg.selectAll(".point")
          .on("mouseover", function(d) {
            tooltip.html("");
            tooltip.append("pre")
              .text(d.Year + ": " + d[metric] + " " +  metrics[metric]);

            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", function(d) {
            return tooltip.style("top", (d3.event.pageY-20) + "px").style("left", (d3.event.pageX+10) + "px");
          })
          .on("mouseout", function(d) {
            return tooltip.style("visibility", "hidden");
          });
      });
    }

});


    }

});
