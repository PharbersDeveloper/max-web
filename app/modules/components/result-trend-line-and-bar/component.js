import Component from '@ember/component';

export default Component.extend({
    init() {
        this._super(...arguments);
        let itemStyleColor = ['#3AD1C2', '#60C6CF', '#FFFFFF', '#009992'];
        this.set('option', {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '4%',
                height: '250px',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    align: 'left'
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [
                {
                    name: '日期',
                    nameGap: 40,
                    type: 'category',
                    data: [],
                    splitLine: {
                        show:false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '市场销量(百万)',
                    // max: 10000,
                    position: "left"
                },
                {
                    type: 'value',
                    name: '份额变化趋势',
                    show: true,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    splitLine: {
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'市场销量',
                    type:'bar',
                    barWidth: '80%',
                    yAxisIndex: 0,
                    data: [],
                    label: {
                        normal: {
                            show: false,
                            color: "#FFFFFF",
                            position: 'minddle'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: itemStyleColor[0]
                        }
                    }
                },
                {
                    name:'份额占比',
                    type:'line',
                    yAxisIndex: 1,
                    data: [],
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: itemStyleColor[3]
                        }
                    }
                }
            ]
        });
    }
});
