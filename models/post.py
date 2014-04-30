import sqlalchemy as sc

from sqlalchemy.orm import relationship, backref
from datetime import datetime
from common.db import Base

class Post(Base):
  __tablename__ = 'posts'

  id = sc.Column(sc.Integer, primary_key=True)
  author_id = sc.Column(sc.Integer, sc.ForeignKey('users.id'))

  title = sc.Column(sc.String)
  content = sc.Column(sc.String)
  status = sc.Column(sc.String)
  update_time = sc.Column(sc.Date)

  author = relationship('User', backref=backref('posts'))

  def __init__(self, title=None, content=None, status=None):
    self.update_time = datetime.now()
    self.title = title or 'Untitled'
    self.content = content or ''
    self.status = status or 'public'

  def get_dict(self):
    attrs = ('id', 'title', 'content', 'status')
    post_dict = {attr: getattr(self, attr) for attr in attrs}
    post_dict['tags'] = [tag.tag_name for tag in self.tags]
    return post_dict

  def __repr__(self):
    return str(self.get_dict())
