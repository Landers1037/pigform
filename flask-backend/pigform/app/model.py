# -*- coding: utf-8 -*-
# Time: 2020-04-01 14:45
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: model.py
from app import db
import datetime

class Pig(db.Model):
    __tablename__ = 'pig'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    date = db.Column(db.String(50))
    time = db.Column(db.String(50)) #准确的时间
    name = db.Column(db.String(20))
    sex = db.Column(db.String(10))
    age = db.Column(db.String(10),nullable=True)
    illtime = db.Column(db.String(100),nullable=True)
    phone = db.Column(db.String(20),nullable=True)
    parent = db.Column(db.String(20),nullable=True)
    work = db.Column(db.String(100),nullable=True)
    address = db.Column(db.String(100),nullable=True)
    detail = db.Column(db.String(200),nullable=True)
    solution = db.Column(db.String(100),nullable=True)
    addon = db.Column(db.String(200),nullable=True)
    money = db.Column(db.String(50),nullable=True)
    doc = db.Column(db.String(20), nullable=True)
    def __repr__(self):
        return self.name