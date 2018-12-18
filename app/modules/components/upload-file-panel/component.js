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
	filecpa: '',
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
					// this.get('cookies').write('cpahash', success.cpa, {
					//     path: '/'
					// });

					this.get('cookies').write('panelhash', success.panel, {
						path: '/'
					});
					// this.get('cookies').write('filecpa', this.get('filecpa'), {
					//     path: '/'
					// });
					this.get('cookies').write('filepanel', this.get('filepanel'), {
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
			// this.set('filecpa', "");
			this.set('filepanel', '');

			this.set('isDisabled', true);
			// this.get('cookies').write('cpahash', "", {
			//     path: '/'
			// });
			// this.get('cookies').write('filecpa', "", {
			//     path: '/'
			// });
			this.get('cookies').write('panelhash', '', {
				path: '/'
			});
			this.get('cookies').write('filepanel', '', {
				path: '/'
			});
		},


		next() {
			// let cpa = this.get('filecpa');
			let panel = this.get('filepanel');

			this.sendAction('next', panel);
		}
	}
});
