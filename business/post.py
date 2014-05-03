# coding=utf-8
import config
import datetime

from models.post import Post
from models.tag import Tag
from common import utils
from common.db import session
from flask import session as sess
from business import admin
from common import utils
from sqlalchemy import or_
from sqlalchemy import func

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
  tags = set(tags)
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
  return query.order_by(Post.create_time.desc()).all()


def update_post(data):
  post_id = data.get('id')
  current_post = get_post_by_id(post_id)
  current_admin = admin.get_current_admin()
  if not current_post: return ['post not found']
  to_set = ('content', 'title', 'status')
  for key in to_set:
    data.get(key) and setattr(current_post, key, data.get(key))
  tags = data.get('tags')
  if tags:
    session.query(Tag).filter_by(post_id=post_id).delete()
    current_post.tags = parse_tags(post_id, tags)
  current_post.update_time = datetime.datetime.now()
  session.commit()
  return current_post


def search_by_tag(tag=None):
  return session.query(Post) \
                .join(Tag) \
                .filter_by(tag_name=tag).all()


def search_by_keyword(keyword=None):
  if not keyword: return []
  pattern = "%" + keyword + "%"
  return session.query(Post) \
                .filter(or_(Post.title.like(pattern), Post.content.like(pattern))) \
                .all()

def get_pages_count_by_posts(posts):
  return range(1, len(posts) / config.POSTS_PER_PAGE + 2)


def get_tags():
  tags = session.query(Tag.tag_name, func.count('*')).group_by(Tag.tag_name).all()
  tags = dict(tags)
  return tags


def delete_post_by_id(post_id):
  to_delete_post = session.query(Post).filter_by(id=post_id).first()
  if not to_delete_post:
    return ['post not found']
  session.delete(to_delete_post)  
