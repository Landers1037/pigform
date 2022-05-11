import * as path from "path";
import process from "process";
import {remote} from 'electron';
const fs = require('fs');
const fsPromise = require('fs').promises;
const APPData = "pigform";
const PIGAPP = "pigapp.exe";
const DB = "pig.db";
const CONFIG = "config.json";

/**
 * 配置文件
 */

const APP_NAME = 'pigform.exe';
const APP_NAME_DEV = 'electron.exe';
const defaultConf = {
    "appname": "医疗管理系统",
    "work": [{"value": "职工"}, {"value": "学生"}, {"value": "其他"}],
    "doc": [{"value": "廖世利"}, {"value": "专家"}],
    "solution": [],
    "page": 10,
    "updateChannel": "http://file.mgek.cc/pigform"
};

export const SYSTEM_NAME = '医疗管理系统';

export function readConfigPromise() {
    return new Promise(((resolve, reject) => {
        const p = getConfigPath();
        fs.readFile(p,
            (err, data) => {
                if (!err) {
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
    return path.join(getAppPath(), "build", PIGAPP);
}

export function getConfigPath() {
    return path.join(process.env.USERPROFILE, APPData, CONFIG);
}

export function getConfigPathOld() {
    return path.join(getAppPath(), CONFIG);
}

export function getDBPath() {
    return path.join(process.env.USERPROFILE, APPData, DB);
}

export function getDBPathOld() {
    return path.join(process.env.USERPROFILE, DB);
}

export async function readConfig() {
    const res = await Promise.all([readConfigPromise()]);
    return res;
}

export function readConfigExtra() {
    const data = fs.readFileSync(getConfigPath())
    if (data) {
        return JSON.parse(data.toString());
    }
    return null;
}

function createDataWork() {
    if (!fs.existsSync(path.join(process.env.USERPROFILE, APPData))) {
        fs.mkdirSync(path.join(process.env.USERPROFILE, APPData));
    }
}

// 从旧版本迁移配置文件
export function migrateConfig() {
    // 如果存在旧的配置文件则复制到新配置路径下
    createDataWork();
    if (fs.existsSync(getConfigPathOld())) {
        fs.copyFileSync(getConfigPathOld(), getConfigPath());
    } else {
        writeConfig(defaultConf);
    }
    return true;
}

// 迁移数据库
export function migrateDB() {
    createDataWork();
    if (fs.existsSync(getDBPathOld())) {
        fs.copyFileSync(getDBPathOld(), getDBPath());
    }
    return true;
}

export function migrate() {
    migrateDB();
    migrateConfig();
}

// 检查是否迁移完毕
export function checkMigrateDone() {
    const dbDone = fs.existsSync(getDBPath());
    const ConfigDone = fs.existsSync(getConfigPath());
    if (dbDone && ConfigDone) {
        return true;
    } else {
        return false;
    }
}


export function genDefaultConfig() {
    writeConfig(defaultConf);
}

export function writeConfig(conf) {
    const str = JSON.stringify(conf, undefined, 2);
    const p = getConfigPath()
    fs.writeFileSync(p, str);
}

export function getAppPath() {
    const app = remote.app;
    const appPath = app.getPath('exe').replace(APP_NAME, '').replace(APP_NAME_DEV, '');
    return appPath || '';
}