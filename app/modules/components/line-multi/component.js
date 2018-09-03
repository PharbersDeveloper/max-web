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
	classNames: ['col-md-12', 'col-sm-12','line-multi'],
	init() {
		this._super(...arguments)
		this.lineTotalData = {
			time: ['2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08', '2018-09', '2018-10', ],
			totalData: [
				[45, 78, 89, 56, 50, 43, 45, 78, 34, 54],
				[39, 45, 78, 89, 56, 42, 79, 46, 54, 44],
				[25, 25, 25, 25, 25, 24, 25, 25, 34, 23]
			]
		};
	},
	/*
		didInsertElement() {
			this._super(...arguments);
			// var dataset = [];
			var totalData = this.get('lineTotalData');
			var lines = []; //保存折线图对象
			// var xMarks = [];
			var dataset = totalData.totalData;

			var xMarks = totalData.time;
			var lineNames = ['市场销售额', '产品销售额', '产品份额'];

			// var lineNames = []; //保存系列名称
			var lineColor = ["#FA6F80", "#7CFFE2", "#868CE9"];
			// var w = 600;
			var w = this.$('#multi-lines').width();
			var h = 300;
			var padding = 40;
			var currentLineNum = 0;
			//用一个变量存储标题和副标题的高度，如果没有标题什么的，就为0
			var head_height = padding;
			var title = "";
			var subTitle = "";
			//用一个变量计算底部的高度，如果不是多系列，就为0
			var foot_height = padding;
			//模拟数据
			// getData();
			//判断是否多维数组，如果不是，则转为多维数组，这些处理是为了处理外部传递的参数设置的，现在数据标准，没什么用
			// if (!(dataset[0] instanceof Array)) {
			// 	var tempArr = [];
			// 	tempArr.push(dataset);
			// 	dataset = tempArr;
			// }
			//保存数组长度，也就是系列的个数
			currentLineNum = dataset.length;
			//图例的预留位置
			foot_height += 25;
			//定义画布
			var svg = d3.select(this.$('#multi-lines')[0])
				.append("svg")
				.attr("width", w)
				.attr("height", h);
			//添加背景
			svg.append("g")
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", w)
				.attr("height", h)
				.style("fill", "#FFF")
				.style("stroke-width", 2)
				.style("stroke", "#E7E7E7");
			//添加标题
			if (title != "") {
				svg.append("g")
					.append("text")
					.text(title)
					.attr("class", "title")
					.attr("x", 10)
					.attr("y", head_height);
				head_height += 30;
			}
			//添加副标题
			if (subTitle != "") {
				svg.append("g")
					.append("text")
					.text(subTitle)
					.attr("class", "subTitle")
					.attr("x", 10)
					.attr("y", head_height);
				head_height += 20;
			}
			var maxdata = getMaxdata(dataset);
			var ratioMax = getRatioMaxdata(dataset[2]);
			//横坐标轴比例尺
			var xScale = d3.scaleLinear()
				.domain([0, dataset[0].length - 1])
				.range([padding, w - padding]);
			//纵坐标轴比例尺
			var yScale = d3.scaleLinear()
				.domain([0, maxdata])
				.range([h - foot_height, head_height]);
			var ySecondScale = d3.scaleLinear()
				.domain([0, ratioMax])
				.range([h - foot_height, head_height]);
			//定义横轴网格线
			var xInner = d3.axisBottom()
				.scale(xScale)
				.tickSize(-(h - head_height - foot_height), 0, 0)
				.tickFormat("")
				.ticks(dataset[0].length);
			//添加横轴网格线
			var xInnerBar = svg.append("g")
				.attr("class", "inner_line")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xInner);
			//定义纵轴网格线
			var yInner = d3.axisLeft()
				.scale(yScale)
				.tickSize(-(w - padding * 2), 0, 0)
				.tickFormat("")
				// .orient("left")
				.ticks(10);
			//添加纵轴网格线
			var yInnerBar = svg.append("g")
				.attr("class", "inner_line")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yInner);
			//定义横轴
			var xAxis = d3.axisBottom()
				.scale(xScale)
				// .orient("bottom")
				.ticks(dataset[0].length);
			//添加横坐标轴
			var xBar = svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - foot_height) + ")")
				.call(xAxis);
			//通过编号获取对应的横轴标签
			xBar.selectAll("text")
				.text(function(d) {
					return xMarks[d];
				});
			//定义纵轴
			var yAxis = d3.axisLeft()
				.scale(yScale)
				// .orient("left")
				.ticks(10);
			//添加纵轴
			var yBar = svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);
			//定义second纵轴
			var ySecondAxis = d3.axisRight()
				.scale(ySecondScale)
				// .orient("left")
				.ticks(10);
			//添加纵轴
			var yBar = svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + (w - 40) + ",0)")
				.call(ySecondAxis);
			//添加图例
			var legend = svg.append("g");
			addLegend();
			//添加折线
			lines = [];
			for (let i = 0; i < currentLineNum; i++) {
				var newLine = new CrystalLineObject();
				newLine.init(i);
				lines.push(newLine);
			}
			//重新作图
			/*
				function drawChart() {
					var _duration = 1000;
					getData();
					addLegend();
					//设置线条动画起始位置
					var lineObject = new CrystalLineObject();
					for (let i = 0; i < dataset.length; i++) {
						if (i < currentLineNum) {
							//对已有的线条做动画
							lineObject = lines[i];
							lineObject.movieBegin(i);
						} else {
							//如果现有线条不够，就加上一些
							var newLine = new CrystalLineObject();
							newLine.init(i);
							lines.push(newLine);
						}
					}
					//删除多余的线条，如果有的话
					if (dataset.length < currentLineNum) {
						for (let i = dataset.length; i < currentLineNum; i++) {
							lineObject = lines[i];
							lineObject.remove();
						}
						lines.splice(dataset.length, currentLineNum - dataset.length);
					}
					maxdata = getMaxdata(dataset);
					newLength = dataset[0].length;
					//横轴数据动画
					xScale.domain([0, newLength - 1]);
					xAxis.scale(xScale).ticks(newLength);
					xBar.transition().duration(_duration).call(xAxis);
					xBar.selectAll("text").text(function(d) {
						return xMarks[d];
					});
					xInner.scale(xScale).ticks(newLength);
					xInnerBar.transition().duration(_duration).call(xInner);
					//纵轴数据动画
					yScale.domain([0, maxdata]);
					yBar.transition().duration(_duration).call(yAxis);
					yInnerBar.transition().duration(_duration).call(yInner);
					//开始线条动画
					for (let i = 0; i < lines.length; i++) {
						lineObject = lines[i];
						lineObject.reDraw(i, _duration);
					}
					currentLineNum = dataset.length;
					dataLength = newLength;
				}
		*
			//定义折线类
			function CrystalLineObject() {
				this.group = null;
				this.path = null;
				this.oldData = [];
				this.init = function(id) {
					var arr = dataset[id];
					this.group = svg.append("g");
					var line = d3.line()
						.x(function(d, i) {
							return xScale(i);
						})
						.y(function(d) {
							return yScale(d);
						});
					//添加折线
					this.path = this.group.append("path")
						.attr("d", line(arr))
						.style("fill", "none")
						.style("stroke-width", 2)
						.style("stroke", lineColor[id])
						.style("stroke-opacity", 0.9);
					//添加系列的小圆点
					this.group.selectAll("circle")
						.data(arr)
						.enter()
						.append("circle")
						.attr("cx", function(d, i) {
							return xScale(i);
						})
						.attr("cy", function(d) {
							return yScale(d);
						})
						.attr("r", 2)
						.attr("fill", lineColor[id]);
					this.oldData = arr;
				};
				/*
					//动画初始化方法
					this.movieBegin = function(id) {
						var arr = dataset[i];
						//补足/删除路径
						var olddata = this.oldData;
						var line = d3.line()
							.x(function(d, i) {
								if (i >= olddata.length) return w - padding;
								else return xScale(i);
							})
							.y(function(d, i) {
								if (i >= olddata.length) return h - foot_height;
								else return yScale(olddata[i]);
							});
						//路径初始化
						this.path.attr("d", line(arr));
						//截断旧数据
						var tempData = olddata.slice(0, arr.length);
						var circle = this.group.selectAll("circle").data(tempData);
						//删除多余的圆点
						circle.exit().remove();
						//圆点初始化，添加圆点,多出来的到右侧底部
						this.group.selectAll("circle")
							.data(arr)
							.enter()
							.append("circle")
							.attr("cx", function(d, i) {
								if (i >= olddata.length) return w - padding;
								else return xScale(i);
							})
							.attr("cy", function(d, i) {
								if (i >= olddata.length) return h - foot_height;
								else return yScale(d);
							})
							.attr("r", 5)
							.attr("fill", lineColor[id]);
						this.oldData = arr;
					};
					//重绘加动画效果
					this.reDraw = function(id, _duration) {
						var arr = dataset[i];
						var line = d3.line()
							.x(function(d, i) {
								return xScale(i);
							})
							.y(function(d) {
								return yScale(d);
							});
						//路径动画
						this.path.transition().duration(_duration).attr("d", line(arr));
						//圆点动画
						this.group.selectAll("circle")
							.transition()
							.duration(_duration)
							.attr("cx", function(d, i) {
								return xScale(i);
							})
							.attr("cy", function(d) {
								return yScale(d);
							})
					};
					//从画布删除折线
					this.remove = function() {
						this.group.remove();
					};
				/
			}
			//添加图例
			function addLegend() {
				var textGroup = legend.selectAll("text")
					.data(lineNames);
				textGroup.exit().remove();
				legend.selectAll("text")
					.data(lineNames)
					.enter()
					.append("text")
					.text(function(d) {
						return d;
					})
					.attr("class", "legend")
					.attr("x", function(d, i) {
						return i * 100;
					})
					.attr("y", 0)
					.attr("fill", function(d, i) {
						return lineColor[i];
					});
				var rectGroup = legend.selectAll("rect")
					.data(lineNames);
				rectGroup.exit().remove();
				legend.selectAll("rect")
					.data(lineNames)
					.enter()
					.append("rect")
					.attr("x", function(d, i) {
						return i * 100 - 20;
					})
					.attr("y", -10)
					.attr("width", 12)
					.attr("height", 12)
					.attr("fill", function(d, i) {
						return lineColor[i];
					});
				legend.attr("transform", "translate(" + ((w - lineNames.length * 100) / 2) + "," + (h - 10) + ")");
			}
			//产生随机数据
			function getData() {
				// var lineNum = Math.round(Math.random() * 10) % 3 + 1;
				var lineNum = 3;
				// var dataNum = Math.round(Math.round(Math.random() * 10)) + 5;
				var oldData;
				oldData = dataset;
				dataset = [
					[45, 78, 89, 56, 23, 12, 45, 78],
					[12, 45, 78, 89, 56, 23, 79, 46],
					[25, 25, 25, 25, 25, 24, 25, 25]
				];
				xMarks = [];
				// xMarks = ['2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-10', ];
				// lineNames = ['chang市场', 'second', 'third'];

			}
			//取得多维数组最大值
			function getMaxdata(arr) {
				maxdata = 0;
				for (let i = 0; i < 2; i++) {
					maxdata = d3.max([maxdata, d3.max(arr[i])]);
				}
				// console.log(maxdata)
				maxdata = Math.floor(maxdata / 3) + maxdata;
				return maxdata;
			}

			function getRatioMaxdata(arr) {
				let ratioMaxData = 0;
				// for (let i = 0; i < 2; i++) {
				ratioMaxData = d3.max(arr);
				// }
				return ratioMaxData;
			}
		},
		*/
	didReceiveAttrs() {
		this._super(...arguments);
		run.scheduleOnce('render', this, this.drawMultiLine);
	},
	drawMultiLine() {
		let svg = d3.select(this.element);
		var totalData = this.get('lineTotalData');
		var lines = []; //保存折线图对象
		// var xMarks = [];
		var dataset = totalData.totalData;

		var xMarks = totalData.time;
		var lineNames = ['市场销售额', '产品销售额', '产品份额'];

		// var lineNames = []; //保存系列名称
		var lineColor = ["#FA6F80", "#7CFFE2", "#868CE9"];
		var w = 600;
		// var w = this.$('#multi-lines').width();
		var h = 300;
		var padding = 40;
		var currentLineNum = 0;
		//用一个变量存储标题和副标题的高度，如果没有标题什么的，就为0
		var head_height = padding;
		var title = "";
		var subTitle = "";
		//用一个变量计算底部的高度，如果不是多系列，就为0
		var foot_height = padding;
		//模拟数据
		// getData();
		//判断是否多维数组，如果不是，则转为多维数组，这些处理是为了处理外部传递的参数设置的，现在数据标准，没什么用
		// if (!(dataset[0] instanceof Array)) {
		// 	var tempArr = [];
		// 	tempArr.push(dataset);
		// 	dataset = tempArr;
		// }
		//保存数组长度，也就是系列的个数
		currentLineNum = dataset.length;
		//图例的预留位置
		foot_height += 25;
		//定义画布
		svg
			.attr("width", '100%')
			.attr("height", h);
		//添加背景
		svg.append("g")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", '100%')
			.attr("height", h)
			.style("fill", "#FFF")
			.style("stroke-width", 2)
			.style("stroke", "#E7E7E7");
		//添加标题
		if (title != "") {
			svg.append("g")
				.append("text")
				.text(title)
				.attr("class", "title")
				.attr("x", 10)
				.attr("y", head_height);
			head_height += 30;
		}
		//添加副标题
		if (subTitle != "") {
			svg.append("g")
				.append("text")
				.text(subTitle)
				.attr("class", "subTitle")
				.attr("x", 10)
				.attr("y", head_height);
			head_height += 20;
		}
		var maxdata = getMaxdata(dataset);
		var ratioMax = getRatioMaxdata(dataset[2]);
		//横坐标轴比例尺
		var xScale = d3.scaleLinear()
			.domain([0, dataset[0].length - 1])
			.range([padding, w - padding]);
		//纵坐标轴比例尺
		var yScale = d3.scaleLinear()
			.domain([0, maxdata])
			.range([h - foot_height, head_height]);
		var ySecondScale = d3.scaleLinear()
			.domain([0, ratioMax])
			.range([h - foot_height, head_height]);
		//定义横轴网格线
		var xInner = d3.axisBottom()
			.scale(xScale)
			.tickSize(-(h - head_height - foot_height), 0, 0)
			.tickFormat("")
			.ticks(dataset[0].length);
		//添加横轴网格线
		var xInnerBar = svg.append("g")
			.attr("class", "inner_line")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.call(xInner);
		//定义纵轴网格线
		var yInner = d3.axisLeft()
			.scale(yScale)
			.tickSize(-(w - padding * 2), 0, 0)
			.tickFormat("")
			// .orient("left")
			.ticks(7);
		//添加纵轴网格线
		var yInnerBar = svg.append("g")
			.attr("class", "inner_line")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yInner);
		//定义横轴
		var xAxis = d3.axisBottom()
			.scale(xScale)
			// .orient("bottom")
			.ticks(dataset[0].length);
		//添加横坐标轴
		var xBar = svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (h - foot_height) + ")")
			.call(xAxis);
		//通过编号获取对应的横轴标签
		xBar.selectAll("text")
			.text(function(d) {
				return xMarks[d];
			});
		//定义纵轴
		var yAxis = d3.axisLeft()
			.scale(yScale)
			// .orient("left")
			.ticks(7);
		//添加纵轴
		var yBar = svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);
		//定义second纵轴
		var ySecondAxis = d3.axisRight()
			.scale(ySecondScale)
			// .orient("left")
			.ticks(7);
		//添加纵轴
		var yBar = svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (w - 40) + ",0)")
			.call(ySecondAxis);
		//添加图例
		var legend = svg.append("g");
		addLegend();
		//添加折线
		lines = [];
		for (let i = 0; i < currentLineNum; i++) {
			var newLine = new CrystalLineObject();
			newLine.init(i);
			lines.push(newLine);
		}
		//重新作图
		/*
			function drawChart() {
				var _duration = 1000;
				getData();
				addLegend();
				//设置线条动画起始位置
				var lineObject = new CrystalLineObject();
				for (let i = 0; i < dataset.length; i++) {
					if (i < currentLineNum) {
						//对已有的线条做动画
						lineObject = lines[i];
						lineObject.movieBegin(i);
					} else {
						//如果现有线条不够，就加上一些
						var newLine = new CrystalLineObject();
						newLine.init(i);
						lines.push(newLine);
					}
				}
				//删除多余的线条，如果有的话
				if (dataset.length < currentLineNum) {
					for (let i = dataset.length; i < currentLineNum; i++) {
						lineObject = lines[i];
						lineObject.remove();
					}
					lines.splice(dataset.length, currentLineNum - dataset.length);
				}
				maxdata = getMaxdata(dataset);
				newLength = dataset[0].length;
				//横轴数据动画
				xScale.domain([0, newLength - 1]);
				xAxis.scale(xScale).ticks(newLength);
				xBar.transition().duration(_duration).call(xAxis);
				xBar.selectAll("text").text(function(d) {
					return xMarks[d];
				});
				xInner.scale(xScale).ticks(newLength);
				xInnerBar.transition().duration(_duration).call(xInner);
				//纵轴数据动画
				yScale.domain([0, maxdata]);
				yBar.transition().duration(_duration).call(yAxis);
				yInnerBar.transition().duration(_duration).call(yInner);
				//开始线条动画
				for (let i = 0; i < lines.length; i++) {
					lineObject = lines[i];
					lineObject.reDraw(i, _duration);
				}
				currentLineNum = dataset.length;
				dataLength = newLength;
			}
	*/
		//定义折线类
		function CrystalLineObject() {
			this.group = null;
			this.path = null;
			this.oldData = [];
			this.init = function(id) {
				var arr = dataset[id];
				this.group = svg.append("g");
				var line = d3.line()
					.x(function(d, i) {
						return xScale(i);
					})
					.y(function(d) {
						return yScale(d);
					});
				//添加折线
				this.path = this.group.append("path")
					.attr("d", line(arr))
					.style("fill", "none")
					.style("stroke-width", 2)
					.style("stroke", lineColor[id])
					.style("stroke-opacity", 0.9);
				//添加系列的小圆点
				this.group.selectAll("circle")
					.data(arr)
					.enter()
					.append("circle")
					.attr("cx", function(d, i) {
						return xScale(i);
					})
					.attr("cy", function(d) {
						return yScale(d);
					})
					.attr("r", 2)
					.attr("fill", lineColor[id]);
				this.oldData = arr;
			};
			/*
				//动画初始化方法
				this.movieBegin = function(id) {
					var arr = dataset[i];
					//补足/删除路径
					var olddata = this.oldData;
					var line = d3.line()
						.x(function(d, i) {
							if (i >= olddata.length) return w - padding;
							else return xScale(i);
						})
						.y(function(d, i) {
							if (i >= olddata.length) return h - foot_height;
							else return yScale(olddata[i]);
						});
					//路径初始化
					this.path.attr("d", line(arr));
					//截断旧数据
					var tempData = olddata.slice(0, arr.length);
					var circle = this.group.selectAll("circle").data(tempData);
					//删除多余的圆点
					circle.exit().remove();
					//圆点初始化，添加圆点,多出来的到右侧底部
					this.group.selectAll("circle")
						.data(arr)
						.enter()
						.append("circle")
						.attr("cx", function(d, i) {
							if (i >= olddata.length) return w - padding;
							else return xScale(i);
						})
						.attr("cy", function(d, i) {
							if (i >= olddata.length) return h - foot_height;
							else return yScale(d);
						})
						.attr("r", 5)
						.attr("fill", lineColor[id]);
					this.oldData = arr;
				};
				//重绘加动画效果
				this.reDraw = function(id, _duration) {
					var arr = dataset[i];
					var line = d3.line()
						.x(function(d, i) {
							return xScale(i);
						})
						.y(function(d) {
							return yScale(d);
						});
					//路径动画
					this.path.transition().duration(_duration).attr("d", line(arr));
					//圆点动画
					this.group.selectAll("circle")
						.transition()
						.duration(_duration)
						.attr("cx", function(d, i) {
							return xScale(i);
						})
						.attr("cy", function(d) {
							return yScale(d);
						})
				};
				//从画布删除折线
				this.remove = function() {
					this.group.remove();
				};
			*/
		}
		//添加图例
		function addLegend() {
			var textGroup = legend.selectAll("text")
				.data(lineNames);
			textGroup.exit().remove();
			legend.selectAll("text")
				.data(lineNames)
				.enter()
				.append("text")
				.text(function(d) {
					return d;
				})
				.attr("class", "legend")
				.attr("x", function(d, i) {
					return i * 100;
				})
				.attr("y", 0)
				.attr("fill", function(d, i) {
					return lineColor[i];
				});
			var rectGroup = legend.selectAll("rect")
				.data(lineNames);
			rectGroup.exit().remove();
			legend.selectAll("rect")
				.data(lineNames)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return i * 100 - 20;
				})
				.attr("y", -10)
				.attr("width", 12)
				.attr("height", 12)
				.attr("fill", function(d, i) {
					return lineColor[i];
				});
			legend.attr("transform", "translate(" + ((w - lineNames.length * 100) / 2) + "," + (h - 10) + ")");
		}
		//产生随机数据
		function getData() {
			// var lineNum = Math.round(Math.random() * 10) % 3 + 1;
			var lineNum = 3;
			// var dataNum = Math.round(Math.round(Math.random() * 10)) + 5;
			var oldData;
			oldData = dataset;
			dataset = [
				[45, 78, 89, 56, 23, 12, 45, 78],
				[12, 45, 78, 89, 56, 23, 79, 46],
				[25, 25, 25, 25, 25, 24, 25, 25]
			];
			xMarks = [];
			// xMarks = ['2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-01', '2018-10', ];
			// lineNames = ['chang市场', 'second', 'third'];

		}
		//取得多维数组最大值
		function getMaxdata(arr) {
			maxdata = 0;
			for (let i = 0; i < 2; i++) {
				maxdata = d3.max([maxdata, d3.max(arr[i])]);
			}
			// console.log(maxdata)
			maxdata = Math.floor(maxdata / 3) + maxdata;
			return maxdata;
		}

		function getRatioMaxdata(arr) {
			let ratioMaxData = 0;
			// for (let i = 0; i < 2; i++) {
			ratioMaxData = d3.max(arr);
			// }
			return ratioMaxData;
		}
	}

});
