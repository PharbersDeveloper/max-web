import Component from '@ember/component';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Component.extend({
	classNames: ['china-map'],
	didReceiveAttrs() {
		run.scheduleOnce('render', this, this.drawChart);
	},
	drawChart() {
		d3.select('.map-area').select('svg').remove();
		// let valueName = this.get('valueName'),
		let that = this;

		if (typeof valueName === 'undefined') {
			let margin = { top: 0, right: 10, bottom: 10, left: 10 },
				width = 1200 - margin.left - margin.right,
				height = 900 - margin.top - margin.bottom,
				// let color = d3.scaleOrdinal(d3.schemeCategory20c);
				//scaleOrdinal获取或指定当前比例尺的输入域
				colorArray = ['#2568B1', '#3589D4', '#58A1DB', '#9ECDEA', '#E5F1F7', '#EFEFEF'],
				// color = d3.scaleOrdinal(colorArray),
				projection = d3.geoMercator() //地图的投影方法
					.center([110, 25]) //中心设置在经度110,维度38
					.scale([800]) //缩放因子
					.translate([550, 550]) // 坐标原点为550,550
					.precision([0.1]),//小数点后显示多少个数字
				path = d3.geoPath()
					.projection(projection), //创建路径并应用投影
				svgContain = d3.select('.map-area'),
				svg = svgContain.append('svg')
					.attr('width', width)
					.attr('height', height)
					.attr('viewBox', '0 0 960 600'),
				tooltip = d3.select('div.tooltip'), // 各个地图信息展示区域

				url = '/resource/china.geojson';

			svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			d3.json(url, function (error, china) {
				if (error) {
					throw error;
				}
				let hasValueChina = china,
					valueName = that.get('valueName');

				/**
				 * 先遍历数据，将 valueName 中的数据存入 hasValueChina
				 */

				hasValueChina.features.forEach(element => {
					valueName.forEach(ele => {
						if (element.properties.name === ele.name) {
							ele.id = element.properties.id;
							element.properties = ele;
						}
					});
				});

				svg.selectAll('path')
					.data(hasValueChina.features)
					.enter()
					.append('path')
					.attr('stroke', '#fff') //map border color
					.attr('stroke-width', 1) // border width
					.attr('fill', function (d) {

						if (d.properties.name === valueName[0].name) {
							return colorArray[0];
						} else if (d.properties.name === valueName[1].name) {
							return colorArray[1];
						} else if (d.properties.name === valueName[2].name || d.properties.name === valueName[3].name || d.properties.name === valueName[4].name) {
							return colorArray[2];
						} else if (d.properties.name === valueName[5].name || d.properties.name === valueName[6].name || d.properties.name === valueName[7].name || d.properties.name === valueName[8].name || d.properties.name === valueName[9].name || d.properties.name === valueName[10].name) {
							return colorArray[3];
						}
						return colorArray[4];

					})
					.attr('d', path)
					.on('mouseover', () => {
						d3.select(this).attr('fill', 'gray').attr('stroke-width', 2);
						tooltip.style('hidden', false).html('this');
						tooltip.style('display', 'block');

					})
					.on('mousemove', d => {
						tooltip.classed('hidden', false)
							.style('top', d3.event.offsetY + 'px')
							.style('left', d3.event.offsetX + 30 + 'px')
							.html(function () {
								// return d.properties.name + `<br>` +
								// 	'市场销售额：' + d.properties.marketSales + `<br>` +
								// 	'产品销售额：' + d.properties.productSales + `<br>` +
								// 	'份额：' + d.properties.percentage;
								return `<p class='title'>${d.properties.name}</p>
								<p class='content'>市场销售额： ${d.properties.marketSales} Mil</p>
								<p class='content'>产品销售额： ${d.properties.productSales} Mil</p>
								<p class='content'>份额： ${(d.properties.percentage * 100).toFixed(2)} %</p>`;
							});
					}) //鼠标当前区域现实文字
					.on('mouseout', () => {

						d3.select(this).attr('fill', function (d) {
							switch (d.properties.name) {
							case valueName[0]:
								return colorArray[0];
							case valueName[1]:
								return colorArray[1];
							case valueName[2]:
							case valueName[3]:
							case valueName[4]:
							case valueName[5]:
								return colorArray[2];
							case valueName[6]:
							case valueName[7]:
							case valueName[8]:
							case valueName[9]:
							case valueName[10]:
								return colorArray[3];

							default:
								return colorArray[4];
							}

						}).attr('stroke-width', 1);
						tooltip.classed('hidden', true);
					}); //鼠标移开后恢复
			});
		}
	}
});
