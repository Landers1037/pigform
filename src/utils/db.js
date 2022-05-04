/**
 * 操作sqlite数据库
 */

import {getAppPath} from "@/utils/config";
import * as path from "path";
import fs from "fs";

// 数据库的默认位置来自apppath
const appPath = getAppPath();
const DB_PATH = path.join(appPath + 'pig.db');
let DB = {};
DB.name = 'pig.db';

console.log(DB_PATH);

export function createDB() {
    if (!checkExist()) {
        console.log('create db');
        try {
            fs.openSync(DB_PATH, 'w');
            return true;
        } catch {
            return false;
        }
    }
}

export function getDB() {
    return DB;
}

export function checkExist() {
    const res = fs.existsSync(path.join(appPath + 'pig.db'));
    if (!res) {
        console.log(res);
        return false;
    }
    return true;
}