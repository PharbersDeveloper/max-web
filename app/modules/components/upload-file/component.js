import Component from '@ember/component';
import { inject as service } from '@ember/service';

// TODO: 上传只有上传的与上传状态，其余的应该在扩展该component的时候在设置，譬如下一步按钮的状态
// 现在先这么写，第一版出来后立即重构,重写Job获取，不在上传文件中进行
export default Component.extend({
	remindUploadFile: false, // 用于检测提醒用户上传文件的状态
	isDisabled: true, // 下一步按钮点击状态。
	uploadError: false, // 上传Error后弹出modal
	errorMessage: '',
	filecpa: '',
	filegycx: '',
	cookie: service('cookies'),
	GetAjaxOpt(data) {
		return {
			method: 'POST',
			dataType: 'json',
			cache: false,
			data: JSON.stringify(data),
			contentType: 'application/json,charset=utf-8',
			Accpt: 'application/json,charset=utf-8'
		};
	},
	actions: {
		// 提示用户上传文件的弹窗
		pleaseUploadFile() {
			this.set('remindUploadFile', true);
		},
		// 上传cpa文件
		uploadCpaFile(file) {
			return file.upload('/maxupload').then(({
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
					};

					this.get('cookie').write('cpahash', success.cpa, {
						path: '/'
					});
					this.get('cookie').write('filecpa', this.get('filecpa'), {
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
			this.set('filecpa', '');
			this.set('isDisabled', true);
			this.get('cookie').write('cpahash', '', {
				path: '/'
			});
			this.get('cookie').write('filecpa', '', {
				path: '/'
			});
		},
		//  上传gycx文件
		uploadGycxFile(file) {

			return file.upload('/maxupload').then(({
				body: {
					result,
					error,
					status
				}
			}) => {
				if (status === 'ok') {
					this.set('filegycx', file.get('name'));
					if (this.get('filecpa') !== '') {
						this.set('isDisabled', false);
					} else {
						this.set('isDisabled', true);
					}
					let success = {
						gycx: result,
						status
					};

					this.get('cookie').write('gycxhash', success.gycx, {
						path: '/'
					});
					this.get('cookie').write('filegycx', this.get('filegycx'), {
						path: '/'
					});
				} else {
					this.set('uploadError', true);
					this.set('errorMessage', error.message);
				}
			}, () => { });
		},
		//  删除gycx 文件 （伪）只是将名字置为“”空。
		deleteGycxFile() {
			this.set('filegycx', '');
			this.get('cookie').write('gycxhash', '', {
				path: '/'
			});
			this.get('cookie').write('filegycx', '', {
				path: '/'
			});
			if (this.get('filecpa') !== '') {
				this.set('isDisabled', false);
			} else {
				this.set('isDisabled', true);
			}
		},

		next() {
			let cpa = this.get('filecpa'),
				gycx = this.get('filegycx');


			// TODO 改成闭包形式
			// eslint-disable-next-line ember/closure-actions
			this.sendAction('next', cpa, gycx);
		}
	}
});
