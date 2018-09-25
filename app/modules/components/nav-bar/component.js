import Component from '@ember/component';
// import {set} from '@ember/object';
export default Component.extend({
    isCenter: true,
    isShow: false,
    exitStep: false,    // 确认退出状态
    actions: {
        changeExitStatus() {
            this.set('exitStep', true);
        },
        exitStepFlow() {
            this.set('exitStep',false);

        }
    }
});
