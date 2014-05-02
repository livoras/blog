# coding=utf-8
import sqlalchemy as sc
import json

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
  update_time = sc.Column(sc.DateTime)
  create_time = sc.Column(sc.DateTime)

  author = relationship('User', backref=backref('posts'))
  comments = relationship('Comment', \
                           backref='post', \
                           order_by='Comment.create_time.desc()',
                           cascade='all, delete, delete-orphan')
  tags = relationship('Tag', \
                           backref='post', \
                           order_by='Tag.tag_name',
                           cascade='all, delete, delete-orphan')

  def __init__(self, title=None, content=None, status=None):
    self.update_time = datetime.utcnow()
    self.create_time = self.update_time
    self.title = title or 'Untitled'
    self.content = content or ''
    self.status = status or 'public'

  def get_dict(self):
    attrs = ('id', 'title', 'content', 'status')
    post_dict = {attr: getattr(self, attr) for attr in attrs}
    post_dict['tags'] = [tag.tag_name for tag in self.tags]
    return post_dict

  def __repr__(self):
    return json.dumps(self.get_dict())
