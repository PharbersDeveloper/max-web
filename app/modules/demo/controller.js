import Controller from '@ember/controller';
import { inject } from '@ember/service';
import Ember from 'ember';
// import rsvp from 'rsvp';
// import SampleGetOption from '../components/sample-line-and-bar/getOption';
// import ResuleGetOption from '../components/result-trend-line-and-bar/getOption';
// import MirrorGetOption from '../components/result-mirror-bar/getOption';
// import MapGetOption from '../components/result-map/getOption';

export default Controller.extend({
    // ajax: inject(),
    nums: [
        {value: '04/2017', check: false},
        {value: '05/2017', check: false},
        {value: '06/2017', check: false},
        {value: '07/2017', check: false}],
    progress: inject('circle-progress-serivce'),
    getAjaxOpt(data) {
        return {
            method: 'POST',
            dataType: "json",
            cache: false,
            data: JSON.stringify(data),
            contentType: "application/json,charset=utf-8",
            Accept: "application/json,charset=utf-8",
        }
    },
    init() {
        this._super(...arguments);

        // let WebIM = require('easemob-websdk');
        // let conn = new WebIM.connection({
        //     isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        //     https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        //     url: WebIM.config.xmppURL,
        //     heartBeatWait: WebIM.config.heartBeatWait,
        //     autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        //     autoReconnectInterval: WebIM.config.autoReconnectInterval,
        //     apiUrl: WebIM.config.apiURL,
        //     isAutoLogin: true
        // });
        // var options = {
        //   apiUrl: WebIM.config.apiURL,
        //   user: 'qp',
        //   pwd: 'aaaaaa',
        //   appKey: WebIM.config.appkey
        // };
        // conn.open(options);
        //
        // conn.listen({
        //     onOpened: function ( message ) {//连接成功回调
        //         window.console.log("连接成功");
        //     },
        //     onClosed: function ( message ) {},
        //     onTextMessage: function ( message ) {
        //         window.console.info(message)
        //     }
        // });

        // const ajax = this.get('ajax');
        // let condition = {
        //     "condition":{
        //         "user_id":"5ad871fe52d78f494e56e772"
        //     }
        // };
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('api/job/push',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         // this.set('hospitalOption', sampleOption.getOption(data))
        //         window.console.info(data)
        //         return resolve({resule: data});
        //     },
        //     () => {return reject("Access Error");}
        // );
        // });

        // let sampleOption = SampleGetOption.create();
        // let resultOption = ResuleGetOption.create();
        // let mirrorOption = MirrorGetOption.create();
        // let mapOption = MapGetOption.create();
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/sample/hospital-numbers',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('hospitalOption', sampleOption.getOption(data))
        //         return resolve({resule: data});
        //     },
        //     () => {return reject("Access Error");}
        // );
        // });
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/sample/product-numbers',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('productOption', sampleOption.getOption(data))
        //         return resolve({resule: data});
        //     },() => {return reject("Access Error");});
        // });
        //
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/sample/sales-numbers',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('salesOption', sampleOption.getOption(data))
        //         return resolve({resule: data});
        //     },() => {return reject("Access Error");});
        // });
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/result/trend',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('trendOption', resultOption.getOption(data))
        //         return resolve({resule: data});
        //     },() => {return reject("Access Error");});
        // });
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/result/mirror',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('mirrorOption', mirrorOption.getOption(data))
        //         return resolve({resule: data});
        //     },() => {return reject("Access Error");});
        // });
        //
        // new rsvp.Promise((resolve, reject) => {
        //     return ajax.request('/query/result/map',
        //                             this.getAjaxOpt(condition)).then((data) => {
        //         this.set('mapOption', mapOption.getOption(data))
        //         return resolve({resule: data});
        //     },() => {return reject("Access Error");});
        // });

    },
    actions: {
        go: function() {
            // let num = 10;
            // const progress = this.get('progress');
            // progress.setPercent(num);
            // this.set('option', progress.getOption());
            this.set('option', this.get('progress').getOption())
        },
        submitNum() {
            let checkedNum = [];
            // this.get('nums').forEach((item) => {
            //     if(item.check) {
            //         checkedNum.push(item.value);
            //         console.info(item.value)
            //     }
            // })
            checkedNum = this.get('nums').filterBy('check', true).map((ele,index,array)=> {
                return ele.value
            });
            console.info(checkedNum)
        },
    }
});
