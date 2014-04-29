import sqlalchemy as sc

from common.db import Base
from common import utils

class User(Base):
  __tablename__ = 'users'

  id = sc.Column(sc.Integer, primary_key=True)
  username = sc.Column(sc.String)
  password = sc.Column(sc.String)

  def __init__(self, username, password):
    self.username = username
    self.password = utils.encrypt(password)

  def get_dict(self):
    attrs = ('id', 'username', 'password')
    return {attr: getattr(self, attr) for attr in attrs}

  def __repr__(self):
    return str(self.get_dict())
