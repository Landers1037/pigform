# -*- coding: utf-8 -*-
# Time: 2020-04-05 18:24
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: update.py

#自动更新系统
import os,sys,shutil,time

if __name__ == '__main__':
    try:
        if sys.argv[1]:
            #必须保证程序关闭后更新文件
            time.sleep(3)
            src = sys.argv[1]
            path = os.path.dirname(os.getcwd())
            print('当前路径'+path)
            print(os.path.join(path,"resources/app.asar"))
            os.remove(os.path.join(path,"resources/app.asar"))
            shutil.copy(src, os.path.join(path,"resources"))

    except Exception as e:
        print(e.args)
        print("bad")

        pass
