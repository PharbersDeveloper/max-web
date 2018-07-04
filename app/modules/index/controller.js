import Controller from '@ember/controller';
import { inject } from '@ember/service';
import rsvp from 'rsvp';
import { later } from '@ember/runloop';

export default Controller.extend({
    cookies: inject(),
    ajax: inject(),
    webIm: inject('xmpp-service'),
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
        sbtInfo() {
            let condition = {
                "condition": {
                    "email": this.get('username'),
                    "password": this.get('password')
                }
            };
            new rsvp.Promise((resolve, reject) => {
                return this.get('ajax').request('api/user/login',
                    this.getAjaxOpt(condition)).then((response) => {
                        if (response.status === "ok") {
                            this.get('cookies').write('uid', response.result.uid, {path:'/'});
                            this.get('cookies').write('user_token', response.result.user_token, {path:'/'});
                            this.get('webIm').login(response.result.uid, this.get('password'));
                            later(this, () => {
                                window.location = 'data-center';
                            }, 1000)
                        } else {
                            alert('帐号或密码错误。');
                        }
                        return resolve({ result: response});
                    },
                    () => {return reject("Access Error");}
                );
            });
        }
    }
})
