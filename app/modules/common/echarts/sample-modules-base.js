import {computed} from '@ember/object';
import Component from '@ember/component';
import echarts from 'echarts';

export default Component.extend({
    chartsName: '',
    baseOption: computed('chartsName', function() {
        return {
            // tooltip : {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'shadow'
            //     }
            // },
            grid: {
                left: '8%',
                right: '5%',
                bottom: '6%',
                top: '5%'
            },
            xAxis: {
                splitNumber : 12,
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            },
            yAxis: [
                {
                    show: true,
                    type: 'value',
                    name: this.get('chartsName')
                },
                {
                    show: false,
                    type: 'value'
                }
            ],
            series: [
                {
                    name: this.get('chartsName'),
                    type: 'bar',
                    data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    lineStyle : {normal : {color : '#60B3AD'}},
                    itemStyle : {normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(17, 168,171, 1)'
                        }, {
                            offset: 1,
                            color: 'rgba(17, 168,171, 0.5)'
                        }]),
                        barBorderRadius: 5,
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }}
                },
                {
                    name: '去年同期',
                    type: 'line',
                    data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    yAxisIndex: 0,
                    lineStyle : {normal : {color : '#b3312f', type: 'dotted'}},
                    itemStyle : {normal : {color : '#b3312f'}}
                }
            ]
        }
    }),

});
