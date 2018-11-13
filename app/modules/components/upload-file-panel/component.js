import Component from '@ember/component';
import {
    inject
} from '@ember/service';

export default Component.extend({
    cookies: inject(),
    ajax: inject(),
    remindUploadFile: false, // 用于检测提醒用户上传文件的状态
    isDisabled: true, // 下一步按钮点击状态。
    uploadError: false, // 上传Error后弹出modal
    errorMessage: '',
    filecpa: "",
    actions: {
        // 提示用户上传文件的弹窗
        pleaseUploadFile() {
            this.set('remindUploadFile', true);
        },
        // 上传cpa文件
        uploadCpaFile(file) {
            return file.upload('/upload').then(({
                body: {
                    result,
                    error,
                    status
                }
            }) => {
                if (status === 'ok') {
                    this.set('filecpa', file.get('name'));
                    this.set('isDisabled', false);
                    let success = {
                        cpa: result,
                        status
                    }
                    this.get('cookies').write('cpahash', success.cpa, {
                        path: '/'
                    });
                    this.get('cookies').write('filecpa', this.get('filecpa'), {
                        path: '/'
                    });
                } else {
                    this.set('uploadError', true);
                    this.set('errorMessage', error.message);
                }
            }, () => { });
        },
        //  删除cpa文件 （伪）只是将名字置为“”空。
        deleteCpaFile() {
            this.set('filecpa', "");
            this.set('isDisabled', true);
            this.get('cookies').write('cpahash', "", {
                path: '/'
            });
            this.get('cookies').write('filecpa', "", {
                path: '/'
            });
        },


        next() {
            let cpa = this.get('filecpa');
            this.sendAction('next', cpa);
        }
    }
});
