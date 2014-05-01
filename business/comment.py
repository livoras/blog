# coding=utf-8
import config

from models.post import Post
from models.comment import Comment
from common import utils
from common.db import session
from flask import session as sess

def create_new_comment(data):
  post_id = data.get('post_id')
  username = data.get('username')
  user_email = data.get('user_email')
  content = data.get('content')

  if not post_id: return ['post_id is not valid']
  if not user_email: return ['user_email is empty']
  if not username: return ['username is empty']
  if not content: return ['content is empty']

  post = session.query(Post).filter_by(id=post_id).first()
  if not post: return ['post is not found']

  new_comment = Comment(**data)
  post.comments.append(new_comment)
  session.commit()
  return new_comment
