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
    classNames: ['col-md-12', 'simple-line'],
    init() {
        this._super(...arguments);
        this.data = [{
                // "date": '1-May-12',
                "date": "18-01",
                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '30-Apr-13',
                "date": "18-02",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            }, {
                // "date": '27-Apr-14',
                "date": "18-03",

                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '27-Apr-15',
                "date": "18-04",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            },
            {
                // "date": '27-Apr-15',
                "date": "18-05",
                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '27-Apr-15',
                "date": "18-06",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            }, {
                // "date": '27-Apr-15',
                "date": "18-07",
                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '27-Apr-15',
                "date": "18-08",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            }, {
                // "date": '27-Apr-15',
                "date": "18-09",
                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '27-Apr-15',
                "date": "18-10",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            }, {
                // "date": '27-Apr-15',
                "date": "18-11",
                "marketSales": 27,
                "prodSales": 15,
                "open": 5
            }, {
                // "date": '27-Apr-15',
                "date": "18-12",
                "marketSales": 26,
                "prodSales": 15,
                "open": 4
            },


        ];
    },
    didReceiveAttrs() {
        run.scheduleOnce('render', this, this.drawSimpleLine)
    },
    drawSimpleLine() {
        let data = this.get('data');
        var svg = d3.select(this.element)
        // set the dimensions and margins of the graph
        var margin = {
                top: 20,
                right: 40,
                bottom: 30,
                left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
        // var parseTime = d3.timeParse("%d-%b-%y");
        var parseTime = d3.timeParse("%y-%m");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);
        var y2 = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function(d) {
                // console.log(d)
                return x(d.date);
            })
            .y(function(d) {
                return y0(d.marketSales);
            });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y1(d.prodSales);
            });

        var valueline3 = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                // return y2(Math.log(d.open));
                return y2(d.open);
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        svg
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 1200 500')
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Get the data
        // d3.csv("data4.csv", function(error, data) {
        // if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.marketSales = +d.marketSales;
            d.prodSales = +d.prodSales;
            d.open = +d.open;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {
            return d.date;
        }));
        let y0Max = d3.max(data, function(d) {
            return Math.max(d.marketSales);
        });
        // y0.domain([0, d3.max(data, function(d) {
        //     return Math.max(d.marketSales);
        // })]);
        y0.domain([0, (y0Max / 3 + y0Max)]);
        let y1Max = d3.max(data, function(d) {
            return Math.max(d.marketSales);
        });
        y1.domain([0, (y1Max / 3 + y1Max)]);
        let y2Max = d3.max(data, function(d) {
            // return Math.max(Math.log(d.open));
            return Math.max(d.open)
        });
        y2.domain([0, (y2Max/3 + y2Max)]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#FA6F80")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#7CFFE2")
            .attr("d", valueline2);

        // Add the valueline3 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#868CE9")
            .attr("d", valueline3);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y0 Axis
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .attr("transform", 'translate(0,0)')
            .call(d3.axisLeft(y0))


        // Add the Y1 Axis
        svg.append("g")
            .attr("class", "axisRed")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(y1));

        // Add the Y2 Axis
        svg.append("g")
            .attr("class", "axisPurple")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisLeft(y2).ticks(7));

        // });
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(12)
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y0)
                .ticks(7)
        }
        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

    }
});
