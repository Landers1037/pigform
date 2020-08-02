# -*- coding: utf-8 -*-
# Time: 2020-04-01 14:33
# Author: Landers1037
# Mail: liaorenj@gmail.com
# File: __init__.py
from flask import Blueprint
from flask_cors import CORS

api = Blueprint("api",__name__)
cors = CORS(api)

from . import login
from . import data