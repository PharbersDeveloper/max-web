import Service from '@ember/service';

export default Service.extend({
    init() {
        this._super(...arguments);
        this.set('option', null);
    },
    setPercent(percent) {
        this.set('option',{
            title: {
                text: percent + '%' ,
            },
            series: [{
                name: 'main',
                type: 'pie',
                radius: ['57%', '60%'],
                label: {
                    normal: {
                        show: false,
                    }
                },
                data: [{
                    value: percent,
                    itemStyle: {
                        normal: {
                            color: '#0BBC96',
                            shadowBlur: 10,
                            shadowColor: '#0BBC96'
                        }
                    }
                }, {
                    value: 100 - percent,
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    }
                }],
                hoverAnimation: false,
                animationEasingUpdate: 'cubicInOut',
                animationDurationUpdate: 500
            }]
        })
    },
    getOption() {
        return this.get('option');
    }
});
