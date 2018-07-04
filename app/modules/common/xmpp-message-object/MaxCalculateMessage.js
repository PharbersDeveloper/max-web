import EmberObject from '@ember/object';

export default EmberObject.create({
    isShowCalcProgress: false, // 控制计算时进度条的显示
    calcHasDone: false, // 计算完成
    calculateState: false, // 计算状态
    _calcMsg(controllInstance, message, services) {
        switch(message.stage) {
            case 'start':
                // this.set('isShowCalcProgress', true);
                // services.progress.setPercent(message.attributes.progress);
                break;
            case 'ing':
                this.set('isShowCalcProgress', true);
                services.progress.setPercent(message.attributes.progress);
                break;
            case 'done':
                this.set('calcHasDone', true);
                services.progress.setPercent(message.attributes.progress);
                later(controllInstance, function() {
                    services.progress.setPercent(message.attributes.progress);
                }, 500);
                break;
            case 'error':
                this.set('calculateState', true);
                break;
            default:
                window.console.info('default');
        }

    }
});
