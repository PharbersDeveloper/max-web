'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
	// 判断是否需要sourceMaps
	let sourceMap = process.env.EMBER_ENV === 'production' ? 'false' : 'inline';
	console.info(sourceMap);
	let app = new EmberApp(defaults, {
		// Add options here
		// minifyCSS: {
		//   enabled: false
		// },
		// minifyJS: {
		//   enabled: false
		// },
		storeConfigInMeta: false,
		// SRI: {
		//   enabled: false
		// },
		fingerprint: {
			enabled: false
		},
		sassOptions: {
			includePaths: [
				'node_modules/bootstrap-sass/assets/stylesheets',
				'node_modules/ember-power-select/app/styles',
				'node_modules/ember-basic-dropdown/app/styles'
			]
		},
		// cssModules: {
		//     plugins: [
		//         require('postcss-import'),
		//         require('postcss-extend'),
		//         require('postcss-cssnext'),
		//         require('rucksack-css') ({
		//             alias: false,
		//             hexRGBA: false,
		//             fallbacks: true
		//         })
		//
		//     ]
		// },
		'ember-bootstrap': { // 由于使用了cssmodel 导致这个配置可能没多大用处
			'bootstrapVsesion': 3,
			'importBootstrapFont': true,
			'importBootstrapCSS': false
		},
		'ember-power-select': {
			theme: 'bootstrap'
		},
		babel: {
			sourceMaps: sourceMap
		}
	});
	app.import("vendor/echarts/echarts.js")
	app.import("vendor/echarts/china.js")
	app.import("vendor/webim/config.js")
	app.import("vendor/webim/strophe-1.2.8.min.js")
	app.import("vendor/webim/websdk-1.4.13.js")
	app.import("vendor/datepicker/datepicker.zh-CN.min.js")

	//layui-laydate
	app.import("vendor/laydate/theme/default/font/iconfont.eot", {
		destDir: '/assets/laydate/fonts'
	})
	app.import("vendor/laydate/theme/default/font/iconfont.svg", {
		destDir: '/assets/laydate/fonts'
	})
	app.import("vendor/laydate/theme/default/font/iconfont.ttf", {
		destDir: '/assets/laydate/fonts'
	})
	app.import("vendor/laydate/theme/default/font/iconfont.woff", {
		destDir: '/assets/laydate/fonts'
	})
	app.import("vendor/laydate/theme/default/laydate.css")
	app.import("vendor/laydate/laydate.js")


	return app.toTree();
};