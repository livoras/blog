# coding=utf-8
import sqlalchemy as sc
import json
import config

from common.db import Base
from common import utils

class User(Base):
  __tablename__ = 'users'

  id = sc.Column(sc.Integer, primary_key=True)
  username = sc.Column(sc.String)
  password = sc.Column(sc.String)
  name = sc.Column(sc.String)
  email = sc.Column(sc.String, default=config.ADMIN_EMAIL)

  def __init__(self, username, name, password):
    self.name = name
    self.username = username
    self.password = utils.encrypt(password)

  def get_dict(self):
    attrs = ('id', 'name', 'username', 'password')
    return {attr: getattr(self, attr) for attr in attrs}

  def __repr__(self):
    return json.dumps(self.get_dict())
