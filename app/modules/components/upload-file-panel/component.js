import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
	remindUploadFile: false, // 用于检测提醒用户上传文件的状态
	isDisabled: true, // 下一步按钮点击状态。
	uploadError: false, // 上传Error后弹出modal
	errorMessage: '',
	filecpa: '',
	cookie: service('cookies'),
	actions: {
		// 提示用户上传文件的弹窗
		pleaseUploadFile() {
			this.set('remindUploadFile', true);
		},
		// 上传cpa文件
		uploadPanelFile(file) {
			return file.upload('/maxupload').then(({
				body: {
					result,
					error,
					status
				}
			}) => {
				if (status === 'ok') {
					// this.set('filecpa', file.get('name'));
					this.set('filepanel', file.get('name'));

					this.set('isDisabled', false);
					let success = {
						// cpa: result,
						panel: result,
						status
					};

					this.get('cookie').write('panelhash', success.panel, {
						path: '/'
					});

					this.get('cookie').write('filepanel', this.get('filepanel'), {
						path: '/'
					});
				} else {
					this.set('uploadError', true);
					this.set('errorMessage', error.message);
				}
			}, () => { });
		},
		//  删除cpa文件 （伪）只是将名字置为“”空。
		deletePanelFile() {
			this.set('filepanel', '');

			this.set('isDisabled', true);

			this.get('cookie').write('panelhash', '', {
				path: '/'
			});
			this.get('cookie').write('filepanel', '', {
				path: '/'
			});
		},


		next() {
			// let cpa = this.get('filecpa');
			let panel = this.get('filepanel');

			// TODO 改成闭包形式
			// eslint-disable-next-line ember/closure-actions
			this.sendAction('next', panel);
		}
	}
});
