'use strict'

import { app, protocol, BrowserWindow,Menu,MenuItem,Tray ,Notification,dialog} from 'electron'
let appname = app.getName()+".exe";
let appPath = app.getPath('exe').replace(appname,"")+"build/";

let cmd = require("node-cmd");
let tray = null;
let notify = Notification;
let n = notify.isSupported();

Menu.setApplicationMenu(null);
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import da from "element-ui/src/locale/lang/da";
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let w;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    icon:"./build/left.png", width: 800, height: 600,
    show: false,
    webPreferences: {
    nodeIntegration: true
  },
    defaultFontFamily:{
      standard: "微软雅黑",
      sansSerif: "微软雅黑",
      serif: "微软雅黑",
      monospace: "Consolas",
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  win.once('ready-to-show',()=>{
    win.show();
  });
  win.on('closed', () => {
    win = null
  })
}

function createsetting(){
  w = new BrowserWindow({
    icon:"./build/left.png",
    width: 640,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      defaultFontSize: 15,
      defaultFontFamily: "sansSerif"
    },
  });
  const wurl = isDevelopment? 'http://localhost:8080/#/settingpage':"app://./index.html#/settingpage";
  w.loadURL(wurl);
  w.once('ready-to-show',()=>{
    w.show();
  });
  w.on('close',()=>{
    w = null;
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    if(n){
      let noti = new notify({
        title: "程序退出",
        body: "退出"
      });
      noti.show();
    }
    app.quit()
  }
})

app.on('before-quit', (event) => {
  cmd.run("taskkill /f /t /im pigapp.exe");

});
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow();
  tray = new Tray("./build/left.png");
  let trayContextMenu = Menu.buildFromTemplate([
    {
      label: "打开主程序",
      click: () => {
        win.show()
      }
    },
    {
      label: "退出主程序",
      click: () => {
        app.quit();
      }
    },
    { type: 'separator' },
    {
      label: "启动后台",
      click: () => {
        cmd.run(appPath+"pigapp.exe");
      }
    },
    {
      label: "关闭后台",
      click: () => {
        cmd.run("taskkill /f /t /im pigapp.exe");
      }
    },
    {
      label: "调试模式",
      click: () => {
        win.webContents.openDevTools();
      }
    },

  ]);
  trayContextMenu.append(new MenuItem({type: "separator"}));
  trayContextMenu.append(new MenuItem({label:"设置",click(){createsetting()}}));
  tray.setToolTip("医疗管理系统");
  tray.setContextMenu(trayContextMenu);
  let log= null;
  cmd.get(appPath+"pigapp.exe",function (err,data) {
    log = err;
    if(n){
      let noti = new notify({
        title: "程序启动失败",
        body: "日志:" + log
      });
      noti.show();
      console.log(dialog.showMessageBoxSync({title:"后台启动异常",type:"error", message:log.toString()}))
    }
  });
});

app.on('unresponsive',()=>{
  console.log(dialog.showMessageBoxSync({title:"后台启动异常",type:"error", message:"当前页面未响应"}))
});
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
