import * as path from "path";
import process from "process";
const fs = require('fs');
const fsPromise = require('fs').promises;

/**
 * 配置文件
 */

const APP_NAME = 'pigform.exe';
const APP_NAME_DEV = 'electron.exe';
const defaultConf = {
   "appname": "医疗管理系统",
   "work": [{"value":"职工"}, {"value":"学生"}, {"value":"其他"}],
   "doc": [{"value":"廖世利"}, {"value":"专家"}],
   "solution": [],
   "page": 10,
   "updateChannel": "http://file.mgek.cc/pigform"
};

export const SYSTEM_NAME = '医疗管理系统';
export function readConfigPromise() {
   return new Promise(((resolve, reject) => {
      const p = getConfigPath();
      fs.readFile(p,
          (err,data) => {
             if(!err){
                reject(err);
             } else {
                if (data) {
                   const res = JSON.parse(data.toString());
                   resolve(res);
                } else {
                   reject('no data');
                }
             }
          });
   }));
}

export function getPigappPath() {
   return path.join(getAppPath(), "build", "pigapp.exe");
}

export function getConfigPath() {
   return path.join(getAppPath(), "config.json")
}

export function getDBPath() {
   return path.join(process.env.USERPROFILE, "pig.db");
}

export async function readConfig() {
   const res = await Promise.all([readConfigPromise()]);
   return res;
}

export async function readConfigExtra() {
   const data = fs.readFileSync(getConfigPath())
   if (data) {
      return JSON.parse(data.toString());
   }
   return null;
}

export function genDefaultConfig() {
   writeConfig(defaultConf);
}

export function writeConfig(conf) {
   const str = JSON.stringify(conf,undefined,2);
   const p = getConfigPath()
   fs.writeFileSync(p, str);
}

export function getAppPath() {
   const app = require('electron').remote.app;
   const appPath = app.getPath('exe').replace(APP_NAME, '').replace(APP_NAME_DEV, '');
   return appPath || '';
}