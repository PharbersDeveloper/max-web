import EmberObject from '@ember/object';
import {
	later
} from '@ember/runloop';


// export default EmberObject.create({
//     years: null, // 存储xmpp返回的年月数据 type []
//     fileParsingSuccess: false, // 文件解析成功
//     fileParsingError: false,// 文件解析失败
//     isShowProgress: false, // 是否显示进度条
//
//     calcYearsProgress: false, // 计算年月的进度条
//     calcPanelProgress: false, // 计算Panel文件的进度条
//
//     calcYearsProgressOption: null, // 计算年月的进度条Option
//     calcPanelProgressOption: null, // 计算Panel文件的进度条Option
//     cantFindMonth: false,   // 未能找到月份
// });
//

export default EmberObject.create({
	isShowProgress: false, // 是否显示进度条
	calcYearsProgress: false, // 计算年月的进度条
	calcPanelProgress: false, // 计算Panel文件的进度条
	cantFindMonth: false, // 未找到月份提示

	fileParsingSuccess: false, // 文件解析成功
	fileParsingError: false, // 文件解析失败

	yearsArrayData: null,
	yearsProgressData: null,
	panelProgressData: null,



	_ymCalcMsg(message, services) {
		switch (message.stage) {
			case 'start':
				{
					break;
				}
			case 'ing':
				{
					services.progress.setPercent(message.attributes.progress);
					this.set('yearsProgressData', services.progress.getOption())
					break;
				}
			case 'done':
				{
					services.progress.setPercent(message.attributes.progress);
					let years = message.attributes.content.ymList.split("#")
						// .map((elt, i, array) => {
						.map((elt) => {
							return {
								year: elt,
								isChecked: false
							}
						});
					this.set('yearsProgressData', services.progress.getOption())
					this.set('yearsArrayData', years);
					this.set('fileParsingSuccess', true); // 解析成功 years modal
					break;
				}
			case 'error':
				{
					this.set('fileParsingError', true); // 解析失败 error modal
					break;
				}
			default:
				{
					window.console.info('default');
				}
		}
	},
	_panelMsg(controllInstance, message, services) {
		switch (message.stage) {
			case 'start':
				{
					break;
				}
			case 'ing':
				{
					services.progress.setPercent(message.attributes.progress);
					this.set('panelProgressData', services.progress.getOption())
					break;
				}
			case 'done':
				{
					services.progress.setPercent(message.attributes.progress);
					this.set('panelProgressData', services.progress.getOption())

					let panel = message.attributes.content.panel
					services.cookies.write('panel', panel, {
						path: '/'
					});
					later(controllInstance, function() {
						window.location = '/adddata/generate-sample/sample-finish'
						// controllInstance.transitionToRoute('adddata.generate-sample.sample-finish')
					}, 800);
					break;
				}
			case 'error':
				{
					this.set('fileParsingError', true);
					break;
				}
			default:
				{
					window.console.info('default');
				}
		}

	}

});