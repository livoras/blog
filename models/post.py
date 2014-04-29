import sqlalchemy as sc

from datetime import datetime
from common.db import Base

class Post(Base):
  __tablename__ = 'posts'

  id = sc.Column(sc.Integer, primary_key=True)
  title = sc.Column(sc.String)
  content = sc.Column(sc.String)
  status = sc.Column(sc.String)
  update_time = sc.Column(sc.Date)

  def __init__(self, title='Untitled', content='', status='public'):
    self.update_time = datetime.now()
    self.title = title
    self.content = content
    self.status = status

  def get_dict(self):
    attrs = ('title', 'content', 'status', 'tags', 'comments')
    return {attr: getattr(self, attr) for attr in attrs}

  def __repr__(self):
    return str(self.get_dict())
