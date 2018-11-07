import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
    positionalParams: ['direction', 'split', 'mid'],
    rowpush: computed('direction', function() {
        return this.direction == 'row' && !this.rowsplit && !this.rowmid;
    }),
    rowsplit: computed('direction', 'split', function() {
        return this.direction == 'row' && this.split == true;
    }),
    rowmid: computed('direction', 'mid', function() {
        return this.direction == 'row' &&  this.mid == true;
    }),
    colpush: computed('direction', function() {
        return this.direction == 'col' && !this.colsplit && !this.colmid;
    }),
    colsplit: computed('direction', 'split', function() {
        return this.direction == 'col' && this.split == true;
    }),
    colmid: computed('direction', 'mid', function() {
        return this.direction == 'col' &&  this.mid == true;
    }),
    classNameBindings: [
                        'colpush:bm-flex-v',
                        'colsplit:bm-flex-vs',
                        'colmid:bm-flex-vc',
                        'rowpush:bm-flex-h',
                        'rowsplit:bm-flex-hs',
                        'rowmid:bm-flex-hc',
                    ],
});
