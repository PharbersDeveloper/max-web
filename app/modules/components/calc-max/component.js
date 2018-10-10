import Component from '@ember/component';
import {computed} from '@ember/object';
import { inject } from '@ember/service';
import rsvp from 'rsvp';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';

export default Component.extend({
    cookies: inject(),
    MaxCalculateObject,
    actions: {
        startCalcMAX() {
            this.sendAction('startCalcMAX');
        },
    },
});
