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
    // 应该是插件冲突导致的字体文件导入失败
    // app.import('node_modules/bootstrap/fonts/glyphicons-halflings-regular.eot', { destDir: '/fonts' });
    // app.import('node_modules/bootstrap/fonts/glyphicons-halflings-regular.svg', { destDir: '/fonts' });
    // app.import('node_modules/bootstrap/fonts/glyphicons-halflings-regular.ttf', { destDir: '/fonts' });
    // app.import('node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff', { destDir: '/fonts' });
    // app.import('node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff2', { destDir: '/fonts' });
      // Use `app.import` to add additional libraries to the generated
      // output files.
      //
      // If you need to use different assets in different
      // environments, specify an object as the first parameter. That
      // object's keys should be the environment name and the values
      // should be the asset to use in that environment.
      //
      // If the library that you are including contains AMD or ES6
      // modules that you would like to import into your application
      // please specify an object with the list of modules as keys
      // along with the exports of each module as its value.

      return app.toTree();
};
