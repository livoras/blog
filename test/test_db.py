import config
import logging
logger = logging.getLogger('blog')

config.DATABASE_URI = 'sqlite:///:memory:'
config.ECHO = False

from models.post import Post
from models.tag import Tag
from models.comment import Comment
from models.user import User
from common.db import init_db, session

def test_add_post():
  init_db()
  post = Post(**dict(
    title='hello',
    content='fucyou'
  ))

  session.add(post)
  session.commit()

  post.tags = [Tag(post.id, 'python')]
  session.commit()

  assert session.query(Tag).count() == 1
  assert session.query(Comment).count() == 0

  post.comments = [Comment(**dict(
    username='jerry',
    user_email='iammfw@163.com',
    content='fuckyou',
    post_id=post.id
  ))]

  assert session.query(Comment).first().content == 'fuckyou'
