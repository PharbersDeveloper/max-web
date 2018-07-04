import Component from '@ember/component';

export default Component.extend({

    init(){
        this._super(...arguments);
        this.set('option', {
            title: {
                itemGap: 30,
                left: 'center',
                textStyle: {
                    color: '#1a1b4e',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 30

                },
                subtextStyle: {
                    color: '#58d9df',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                textStyle: {align: 'left'},
                formatter: function (v) {
                    let tip_content = '省份：'+ v.data.name +'<br/>';
                    tip_content += '市场销量：'+ v.data.value +'(Mil)' +'<br/>';
                    tip_content += '产品销量：'+ v.data.productSales +'(Mil)'  +'<br/>';
                    tip_content += '份额：'+ (parseFloat(v.data.percentage) * 100).toFixed(2) +'%';
                    return tip_content;
                }
            },
            visualMap: {
                min: 0,
                max: 20000,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                inRange: {
                    color: ['#EBF0EF', '#37D1C1']
                },
                calculable : true
            },
            series: [{
                name: '中国',
                type: 'map',
                zoom: 1.2,
                mapType: 'china',
                roam: false,
                label: {normal: {show: false}},
                data: []
            }]
        });
    }
});
