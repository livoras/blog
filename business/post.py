import config

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
    session.add(post)
    session.commit()

    post.tags = [Tag(post.id, tag) for tag in tags if tag != '']
    post.author = current_admin
    session.commit()

    return post

def get_post_by_id(post_id):
  post = session.query(Post).filter_by(id=post_id).first()
  if post.status == 'public':
    return post
  else:  
    return post if sess.get('is_admin') else None


def get_all_posts():
  query = session.query(Post) 
  if not sess.get('is_admin'):
    query = query.filter_by(status='public')
  return query.order_by(Post.update_time.desc()).all()
