// import Component from '@ember/component';
import SampleBaseOptionComponent from '../../common/echarts/sample-modules-base';

export default SampleBaseOptionComponent.extend({
    init() {
        this._super(...arguments);
        this.set('option', this.get('baseOption'));
    }
});
