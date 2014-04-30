import config

from app import app
from flask import session
from . import send_json
from common.utils import debug
from common import db
from models.post import Post
from models.tag import Tag

def setup():
  post = Post('title', 'moon and sixpence', 'public')
  post.post_id = 1
  db.session.add(post)
  db.session.commit()

def test_home():
  with app.test_client() as c:
    rv = c.get('/')
    assert 'moon and sixpence' in rv.data
