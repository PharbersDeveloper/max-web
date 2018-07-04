import {computed} from '@ember/object';
import Component from '@ember/component';
import { inject } from '@ember/service';
import rsvp from 'rsvp';
import MaxCalculateObject from '../../common/xmpp-message-object/MaxCalculateMessage';

export default Component.extend({
    ajax: inject(),
    cookies: inject(),
    MaxCalculateObject,
    progress: inject('circle-progress-serivce'),
    circleProgressOption: computed('progress.option', function() {
        return this.get('progress').getOption();
    }),
    getAjaxOpt(data) {
        return {
            method: 'POST',
            dataType: "json",
            cache: false,
            data: JSON.stringify(data),
            contentType: "application/json,charset=utf-8",
            Accpt: "application/json,charset=utf-8",
        }
    },
    actions: {
        startCalcMAX() {
            let condition = {
                "condition": {
                    "job_id": this.get('cookies').read('job_id'),
                    "user_id": this.get('cookies').read('uid'),
                    "args": {
                        "panel": this.get('cookies').read('panel')
                    }
                }
            };
            new rsvp.Promise((resolve, reject) => {
                return this.get('ajax').request('api/max/calc',
                    this.getAjaxOpt(condition)).then((response) => {
                        window.console.info(response);
                        MaxCalculateObject.set('isShowCalcProgress', true);
                        return resolve({ resule: response });
                    },
                        () => {
                            return reject("Access Error");
                        }
                    );
            });
        },
    },
});
