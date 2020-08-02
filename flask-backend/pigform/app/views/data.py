# -*- coding: utf-8 -*-
# Time: 2020-04-01 15:28
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: exit.py
from . import api
from app import db
from app.model import Pig
from flask import request,jsonify
import time
import os

@api.route("/api/data")
def getdata():
    """
    获取全部数据库数据 暂时未做分片处理
    :return:
    """
    if request.args.get("id"):
        id = request.args.get("id")
        try:
            i = Pig.query.get(int(id))

            d = {
                "id":i.id,
                "date": i.date,
                "name":i.name,
                "sex":i.sex,
                "age":i.age,
                "illtime":i.illtime,
                "phone":i.phone,
                "parent":i.parent,
                "work":i.work,
                "address":i.address,
                "detail":i.detail,
                "solution":i.solution,
                "addon":i.addon,
                "money":i.money,
                "doc": i.doc
            }
            return jsonify(d)
        except:
            return jsonify("bad")
    else:
        try:
            #默认的首页只显示20条数据
            #计算任务交给前端

            # list = Pig.query.order_by(Pig.id.desc()).limit(20).all()
            list = Pig.query.order_by(Pig.id.desc()).all()
            data = []
            for i in list:
                d = {
                    "id": i.id,
                    "date": i.date,
                    "name": i.name,
                    "phone": i.phone,
                    "address": i.address,
                    "detail": i.detail
                }
                data.append(d)

            return jsonify(data)

        except:
            return jsonify("bad")


@api.route("/api/add",methods=["POST"])
def adddata():
    """
    添加一条数据
    :return:
    """
    if request.json:
        data = request.json
        now = time.strftime("%H:%M:%S",time.localtime())

        try:
            date = data["date"]
            name = data["name"]
            sex = data["sex"]
            age = data["age"]
            illtime = data["illtime"]
            phone = data["phone"]
            parent = data["parent"]
            work = data["work"]
            address = data["address"]
            detail = data["detail"]
            solution = data["solution"]
            addon = data["addon"]
            money = data["money"]
            doc = data["doc"]
            newitem = Pig(date=date,time=now,name=name,sex=sex,age=age,
                          illtime=illtime,phone=phone,parent=parent,
                          work=work,address=address,detail=detail,
                          solution=solution,addon=addon,money=money,doc=doc
                          )
            db.session.add(newitem)
            db.session.commit()

            return "ok"
        except Exception as e:
            print(e.args)

            return "bad"
    return "bad"

@api.route("/api/edit",methods=["POST"])
def edit():
    """
    修改更新数据
    :return:
    """
    if request.json:
        data = request.json
        try:
            id = data["id"]
            date = data["date"]
            name = data["name"]
            sex = data["sex"]
            age = data["age"]
            illtime = data["illtime"]
            phone = data["phone"]
            parent = data["parent"]
            work = data["work"]
            address = data["address"]
            detail = data["detail"]
            solution = data["solution"]
            addon = data["addon"]
            money = data["money"]
            doc = data["doc"]

            edititem = Pig.query.get(int(id))
            edititem.date = date
            edititem.name = name
            edititem.sex = sex
            edititem.age = age
            edititem.illtime = illtime
            edititem.phone= phone
            edititem.parent = parent
            edititem.work = work
            edititem.address = address
            edititem.detail = detail
            edititem.solution = solution
            edititem.addon = addon
            edititem.money = money
            edititem.doc = doc

            db.session.commit()

            return "ok"
        except Exception as e:
            print(e.args)

            return "bad"
    return "bad"

@api.route("/api/se",methods=["GET"])
#按名称等信息搜索
def search():
        try:
            r = request.args
            if r.get("name"):
                name = r.get("name")
                list = Pig.query.filter(Pig.name.contains(name)).all()
                data = []
                for i in list:
                    d = {
                        "id":i.id,
                        "date":i.date,
                        "name":i.name,
                        "phone":i.phone,
                        "address":i.address
                    }
                    data.append(d)

                return jsonify(data)

            elif r.get("date"):
                date = r.get("date")
                list = Pig.query.filter(Pig.date.contains(date)).all()
                data = []
                for i in list:
                    d = {
                        "id": i.id,
                        "date": i.date,
                        "name": i.name,
                        "phone": i.phone,
                        "address": i.address
                    }
                    data.append(d)

                return jsonify(data)

            elif r.get("sex"):
                sex = r.get("sex")
                list = Pig.query.filter(Pig.sex==sex).all()
                data = []
                for i in list:
                    d = {
                        "id": i.id,
                        "date": i.date,
                        "name": i.name,
                        "phone": i.phone,
                        "address": i.address
                    }
                    data.append(d)

                return jsonify(data)

            elif r.get("phone"):
                phone = r.get("phone")
                list = Pig.query.filter(Pig.name.contains(phone)).all()
                data = []
                for i in list:
                    d = {
                        "id": i.id,
                        "date": i.date,
                        "name": i.name,
                        "phone": i.phone,
                        "address": i.address
                    }
                    data.append(d)

                return jsonify(data)
            else:
                return jsonify("bad")
        except:
            return jsonify("bad")

@api.route("/api/del",methods=["POST"])
def delitem():
    """
    删除数据
    :return:
    """
    if request.json:
        id = request.json["id"]
        try:
            p = Pig.query.get(int(id))
            db.session.delete(p)
            db.session.commit()

            return jsonify("ok")
        except:
            return jsonify("bad")
    else:
        return jsonify("bad")


@api.route("/api/info")
def getinfo():
    """
    获取数据库全局信息
    :return:
    """
    try:
        db_size = os.path.getsize(os.path.join(os.getcwd(), 'pig.db'))
        db_count = Pig.query.count()
        db_backups = os.listdir(os.path.join(os.getcwd(),"backup"))
        return jsonify({
            "size": db_size//1000,
            "count": db_count,
            "new_bk": db_backups[-1].replace("pig-","").replace(".db","")
        })
    except BaseException as e:
        print(e.args)
        return jsonify("bad")