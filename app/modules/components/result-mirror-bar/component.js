import Component from '@ember/component';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('option', {
            baseOption: {
                timeline: {show: false},//这个不能删除
                title: {
                    text: "市场规模排名",
                    left: '26%'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function(v){
                        let tip_content = '区域：'+ v[0].data.area +'<br/>';
                        tip_content += '市场销量：'+ v[0].data.value +'(Mil)' +'<br/>';
                        tip_content += '产品销量：'+ v[0].data.productSales +'(Mil)'  +'<br/>';
                        tip_content += '份额：'+ (parseFloat(v[0].data.percentage) * 100).toFixed(2) +'%';
                        return tip_content;
                    },
                    axisPointer: {
                        type: 'shadow',
                    }
                },
                grid: [
                    {
                        show: false,
                        left: '10%',
                        top: 60,
                        bottom: 60,
                        containLabel: true,
                        width: '40%',
                    },
                    {
                        show: false,
                        left: '50.5%',
                        top: 80,
                        bottom: 60,
                        width: '0%',
                    },
                    {
                        show: false,
                        right: '10%',
                        top: 60,
                        bottom: 60,
                        containLabel: true,
                        width: '40%',
                    }
                ],
                xAxis: [
                    {
                        type: 'value',
                        inverse: true,
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        position: 'top',
                        axisLabel: {
                            show: false,
                            textStyle: {
                                color: '#000000',
                                fontSize: 12,
                            },
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#1F2022',
                                width: 1,
                                type: 'solid',
                            },
                        },
                    },
                    {
                        gridIndex: 1,
                        show: false,
                    },
                    {
                        gridIndex: 2,
                        type: 'value',
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        position: 'top',
                        axisLabel: {
                            show: false,
                            textStyle: {
                                color: '#B2B2B2',
                                fontSize: 12,
                            },
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#1F2022',
                                width: 1,
                                type: 'solid',
                            },
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        inverse: true,
                        position: 'right',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            margin: 8,
                            textStyle: {
                                color: '#9D9EA0',
                                fontSize: 12,
                            },

                        },
                        data: [],//areaData,
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        inverse: true,
                        position: 'left',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                align: 'center',
                                color: '#9D9EA0',
                                fontSize: 12,
                            },

                        },
                        data: [],//areaData//
                    },
                    {
                        gridIndex: 2,
                        type: 'category',
                        inverse: true,
                        position: 'left',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            textStyle: {
                                color: '#9D9EA0',
                                fontSize: 12,
                            },

                        },
                        data: []//areaData,
                    }
                ]
            },
            options: [
                {
                    series: [
                        {
                            name: '去年同期',
                            type: 'bar',
                            barGap: 20,
                            barWidth: 20,
                            label: {
                                normal: {
                                    show: false,
                                },
                                emphasis: {
                                    show: true,
                                    position: 'left',
                                    offset: [0, 0],
                                    textStyle: {
                                        color: '#08C7AE',
                                        fontSize: 14,
                                    },
                                },
                            },
                            itemStyle: {
                                normal: {
                                    color: '#659F83',
                                },
                                emphasis: {
                                    color: '#08C7AE',
                                },
                            },
                            data: []//lastData,
                        },
                        {
                            name: '本期',
                            type: 'bar',
                            barGap: 20,
                            barWidth: 20,
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            label: {
                                normal: {
                                    show: false,
                                },
                                emphasis: {
                                    show: true,
                                    position: 'right',
                                    offset: [0, 0],
                                    textStyle: {
                                        color: '#08C7AE',
                                        fontSize: 14,
                                    },
                                },
                            },
                            itemStyle: {
                                normal: {
                                    color: '#08C7AE',
                                },
                                emphasis: {
                                    color: '#08C7AE',
                                },
                            },
                            data: []//curData,
                        }
                    ]
                }
            ]
        });
    }
});
