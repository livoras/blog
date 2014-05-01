# coding=utf-8
import config
import datetime

from models.post import Post
from common import utils
from common.db import session
from flask import session as sess
from business import admin
from common import utils
from models.tag import Tag

def create_new_post(data):
  current_admin = admin.get_current_admin()

  if not current_admin:
    return ['please login first']
  else:
    title = data.get('title')
    content = data.get('content')
    status = data.get('status')
    tags = data.get('tags')

    post = Post(title, content, status)
    post.tags = parse_tags(post.id, tags)
    post.author = current_admin

    session.add(post)
    session.commit()

    return post


def parse_tags(post_id, tags):
  return [Tag(post_id, tag) for tag in tags if tag != '']


def get_post_by_id(post_id):
  post = session.query(Post).filter_by(id=post_id).first()
  if post and post.status == 'public':
    return post
  else:  
    return post if sess.get('is_admin') else None


def get_all_posts():
  query = session.query(Post) 
  if not sess.get('is_admin'):
    query = query.filter_by(status='public')
  return query.order_by(Post.update_time.desc()).all()


def update_post(data):
  post_id = data.get('id')
  current_post = get_post_by_id(post_id)
  current_admin = admin.get_current_admin()
  if not current_post: return ['post not found']
  to_set = ('content', 'title', 'status')
  for key in to_set:
    data.get(key) and setattr(current_post, key, data.get(key))
  current_post.tags = parse_tags(post_id, data.get('tags'))  
  current_post.update_time = datetime.datetime.now()
  session.commit()
  return current_post
