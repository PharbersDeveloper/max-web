import Component from '@ember/component';


export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('option', {
                title: {
                    text: '0%',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#0BBC96',
                        fontSize: 36,
                    }
                },
                series: [{
                        type: 'pie',
                        radius: ['57%', '60%'],
                        silent: true,
                        label: {
                            normal: {
                                show: false,
                            }
                        },
                        data: [{
                            value: 1,
                            itemStyle: {
                                normal: {
                                    color: '#DEDEDE',
                                    shadowBlur: 10,
                                    shadowColor: '#DEDEDE',
                                }
                            }
                        }],
                        animation: false
                    },{
                        type: 'pie',
                        radius: ['57%', '60%'],
                        silent: true,
                        label: {
                            normal: {
                                show: false,
                            }
                        },
                        data: [{
                            value: 1,
                            itemStyle: {
                                normal: {
                                    color: '#DEDEDE',
                                    shadowBlur: 10,
                                    shadowColor: '#DEDEDE'
                                }
                            }
                        }],
                        animation: false
                    },{
                        name: 'main',
                        type: 'pie',
                        radius: ['57%', '60%'],
                        label: {
                            normal: {
                                show: false,
                            }
                        },
                        data: [{
                            value: 0,
                            itemStyle: {
                                normal: {
                                    color: '#0BBC96',
                                    shadowBlur: 10,
                                    shadowColor: '#0BBC96'
                                }
                            }
                        }, {
                            value: 100 - 0,
                            itemStyle: {
                                normal: {
                                    color: 'transparent'
                                }
                            }
                        }],
                        hoverAnimation: false,
                        animationEasingUpdate: 'cubicInOut',
                        animationDurationUpdate: 500
                    }
                ]
        });
    }
});
