import EmberObject from '@ember/object';

export default EmberObject.extend({
    getOption(data) {
        let baselines = data.baselines;
        let samplenumbers = data.samplenumbers;
        return {
             series: [
                {
                    name: '当前计算',
                    type: 'bar',
                    data : samplenumbers,
                },
                {
                    name: '去年同期',
                    type: 'line',
                    data : baselines
                }
            ]
        }
    }
});
