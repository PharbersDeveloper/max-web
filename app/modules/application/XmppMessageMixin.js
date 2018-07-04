import Mixin from '@ember/object/mixin';
import { later } from '@ember/runloop';
import SampleObject from '../common/xmpp-message-object/SampleObjectMessage';
import MaxCalculateObject from '../common/xmpp-message-object/MaxCalculateMessage';

// TODO: 第一波结束 重构xmpp
export default Mixin.create({
    callback(controllInstance, xmppConn, services) {
        let that = this;
        let msg = this._Msg(controllInstance, services);
        xmppConn.listen({
            onOpened: function ( message ) {window.console.log("连接成功")},
            onClosed: function ( message ) {alert("异地登入")},
            onTextMessage: function ( message ) {
                msg(JSON.parse(message.data));
                // later(this, function() { // 会造成性能损失
                //     that.Msg(controllInstance, JSON.parse(message.data), services);
                // }, 1000);
            },
            onOnline: function () {window.console.info("上线啦")}, //本机网络连接成功
            onOffline: function () {window.console.info("掉线啦")}, //本机网络掉线
            onError: function ( message ) {}           //失败回调
        });

    },
    _Msg(controllInstance, services) {
        let finish = false;
        let record = 0;
        let that = this;
        return function(message) {
            if (message.target === services.cookies.read('uid')) {
                window.console.info(message)
                let call = message.call + "Msg";
                if (!finish
                    || message.attributes.progress > record
                    && message.attributes.progress != 100
                    ) {

                    that[call](controllInstance, message, services);
                    finish = true;
                    record = message.attributes.progress;
                } else if (message.stage == 'done' || message.stage == 'error') {
                    that[call](controllInstance, message, services);
                    later(that, () => {
                        record = 0;
                        finish = false;
                    }, 1 * 1000 * 2)

                }
            }
        }
    },
    // Msg(controllInstance, message, services) {
    //     if (message.target === services.cookies.read('uid')) {
    //         let call = message.call + "Msg";
    //         if (!this.get('finish')
    //             || message.attributes.progress > this.get('record')
    //             && message.attributes.progress != 100
    //             ) {
    //             this.set('finish', true);
    //             this.set('record', message.attributes.progress)
    //             this[call](controllInstance, message, services);
    //         } else if (message.stage == 'done' || message.stage == 'error') {
    //             this.set('record', 0);
    //             this.set('finish', false)
    //             this[call](controllInstance, message, services);
    //         }
    //
    //     }
    // },
    ymCalcMsg(controllInstance, message, services) {
        SampleObject._ymCalcMsg(message, services);
    },
    panelMsg(controllInstance, message, services) {
        SampleObject._panelMsg(controllInstance, message, services);
    },
    calcMsg(controllInstance, message, services) {
        MaxCalculateObject._calcMsg(controllInstance, message, services);
    }
});
