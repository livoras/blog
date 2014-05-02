# coding=utf-8
import sqlalchemy as sc
import json 

from sqlalchemy.orm import relationship, backref
from models.post import Post
from common.db import Base

class Tag(Base):
  __tablename__ = 'tags'

  id = sc.Column(sc.Integer, primary_key=True)
  post_id = sc.Column(sc.Integer, sc.ForeignKey('posts.id'))
  tag_name = sc.Column(sc.String)

  def __init__(self, post_id, tag_name):
    self.post_id = post_id
    self.tag_name = tag_name

  def get_dict(self):
    return self.tag_name

  def __repr__(self):
    return self.tag_name
