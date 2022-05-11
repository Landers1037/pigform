module.exports = {
  // assetsDir: 'static',
  productionSourceMap: false,
  css: {
    // css不再单独抽离，避免文件杂乱
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
          runAfterFinish: true,
          shortcutName: "医疗管理系统",
        },
        // 需要额外打包的二进制文件
        // update更新器现在合并到服务主体中
        // 一个签名校验器，用于在线激活
        // help文档
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