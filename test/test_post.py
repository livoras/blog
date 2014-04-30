import config

from app import app
from flask import session
from . import send_json
from common.utils import debug
from common import db
from models.post import Post
from models.tag import Tag

def test_new_post():
  # If administrator doesn't login, and someon wants to visist
  # the create new post page. The app will redirect to 
  # administrator's login page to require you to login first
  with app.test_client() as c:
    rv = c.get('/new_post')
    assert rv.status_code == 302

  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
    rv = c.get('/new_post')
    assert rv.status_code == 200
    assert 'new-post' in rv.data

def test_create_new_post():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data = dict(
      title='lucy is good',
      content='jerry is the king of the world',
      tags=['jerry', 'lucy']
    )
    rv = send_json('post', '/new_post', data, c)
    post = db.session.query(Post).filter_by(title='lucy is good').first()
    assert post.content == 'jerry is the king of the world'
    assert 'success' in rv.data

    tags = db.session.query(Tag.tag_name).all()
    tags = [tag[0] for tag in tags]
    assert 'jerry' in tags
    assert 'lucy' in tags

    assert post.author.username == 'admin'
