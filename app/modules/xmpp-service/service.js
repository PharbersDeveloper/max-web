import Service, { inject } from '@ember/service';

import { later } from '@ember/runloop';

export default Service.extend({
    cookies: inject(),
    init() {
        this._super(...arguments);
        this.set('conn', new WebIM.connection({
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
            https: typeof WebIM.config.https === 'boolean' ?
                    WebIM.config.https : location.protocol === 'https:',
            url: WebIM.config.xmppURL,
            heartBeatWait: WebIM.config.heartBeatWait,
            autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
            autoReconnectInterval: WebIM.config.autoReconnectInterval,
            apiUrl: WebIM.config.apiURL,
            isAutoLogin: true
        }));
    },
    login(name, password) {
        const that = this;
        let options = {
            apiUrl: WebIM.config.apiURL,
            appKey: WebIM.config.appkey,
            user: name,
            pwd: password,
            success: function(token) {
              that.get('cookies').write('webim_token', token.access_token, {path:'/'});
              that.get('cookies').write('webim_user', token.user.username, {path:'/'});
            },
            error: function(m){window.console.error("Error = " + m)}
        };
        this.get('conn').open(options);
    },
    load() {
        if( this.get('cookies').read('webim_user') === undefined ) {
            return {
                result: null,
                message: "环信用户被清空，请重新登入!",
                status: "no"
            }
        } else {
            later(this, function() {
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    appKey: WebIM.config.appkey,
                    user: this.get('cookies').read('webim_user'),
                    accessToken:  this.get('cookies').read('webim_token')
                };
                this.get('conn').open(options);
            }, 2000); // 环信的该死的 Token登入，不能与login同时使用，为防止以后的人不知道这问题，再次暂时用loop later处理

            return {
                result: this.get('conn'),
                message: "环信登入成功!",
                status: "yes"
            }
        }
    },
    // getInstance() {return this.get('conn')}

    // conn.listen({
    //     onOpened: function ( message ) {//连接成功回调
    //         window.console.log("连接成功");
    //     },
    //     onClosed: function ( message ) {},
    //     onTextMessage: function ( message ) {
    //         window.console.info(message)
    //     }
    // });

});
