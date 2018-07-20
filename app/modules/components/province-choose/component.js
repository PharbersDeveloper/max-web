import Component from '@ember/component';

export default Component.extend({
    tagName: "",
    showMarkerChoose: true,
    prov: '北京',
    init() {
        this._super(...arguments);
        this.provs = ['北京', '上海'],
            this.defaultDate = new Date('2018-04');
    },
    actions: {

        getProv(prov) {
            console.log(prov)
            this.set('prov', prov);
        }
    }
});