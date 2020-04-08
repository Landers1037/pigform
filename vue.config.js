module.exports = {
  // assetsDir: 'static',
  productionSourceMap: false,
  css: {
    extract: false
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "liaorenj@gmail.com",
        productName: "pigform",
        icon: "icon.ico",
        compression: "maximum",

        nsis:{
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          runAfterFinish: false,
          shortcutName: "医疗管理系统",
        },
        extraFiles:[
          "./build/left.png",
          "./build/pigapp.exe",
          "./build/update.exe"
        ]
      }
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': '/api'
        },
      },

    },
  },
};