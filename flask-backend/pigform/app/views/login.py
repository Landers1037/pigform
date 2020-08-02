# -*- coding: utf-8 -*-
# Time: 2020-04-01 14:36
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: login.py

from . import api
from flask import request,jsonify,render_template,current_app
from app import db
import os,shutil,time


@api.route("/api/login",methods=["POST"])
def login():
    res = {"data": "sb"}
    code = request.json["code"] if request.json != "sb" else ""
    if code != "":
        res = {"data":"ok"}
        return jsonify(res)

    return jsonify(res)

@api.route("/api/createdb",methods=["POST"])
def create():
    uri = current_app.config.get("SQLALCHEMY_DATABASE_URI")
    try:
        db.create_all()
        return jsonify({"uri": uri})

    except Exception as e:

        return jsonify("bad")


@api.route("/api/drop",methods=["POST"])
def drop():
    db.drop_all()

    return "ok"

@api.route("/api/backup",methods=["POST"])
def bacjup():
    #数据库备份
    type = request.json["type"]
    try:
        path = os.getcwd()
        if os.path.exists(os.path.join(path,"backup")):
            #备份文件夹存在
            currentdb = os.path.join(path,"pig.db")
            new = "pig{}.db".format(time.strftime("-%Y-%m-%d",time.localtime()))
            dbpath = os.path.join(path, "backup",new)

            shutil.copy(currentdb,dbpath)
        else:
           #新建
            os.mkdir(os.path.join(path,"backup"))
            currentdb = os.path.join(path, "pig.db")
            new = "pig{}.db".format(time.strftime("-%Y-%m-%d", time.localtime()))
            dbpath = os.path.join(path, "backup", new)

            shutil.copy(currentdb, dbpath)
        #是否在备份后清空当前数据库
        if int(type) > 0:
            db.drop_all()

        return jsonify("ok")

    except Exception as e:
        # print(e.args)
        return jsonify("bad")