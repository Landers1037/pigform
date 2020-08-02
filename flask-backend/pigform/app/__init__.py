# -*- coding: utf-8 -*-
# Time: 2020-04-01 14:31
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: __init__.py

from flask import Flask

from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
import os,sys


db = SQLAlchemy()
# migrate = Migrate()

def create_app():
    app = Flask(__name__,static_url_path='/static',template_folder='./templates')

    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(sys.argv[0]).replace("pigapp.exe",""), 'pig.db')
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'pig.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.getcwd(), 'pig.db')
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # 关闭对模型修改的监控
    app.config["SECRET_KEY"] = "GEI LAOZI PA"
    app.debug = False
    app.jinja_env.variable_start_string = "{["
    app.jinja_env.variable_end_string = "]}"

    from .views import api as api


    app.register_blueprint(api)

    db.init_app(app)
    # migrate.init_app(app,db)

    return app
