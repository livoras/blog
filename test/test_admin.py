import config

from app import app
from flask import session
from . import send_json
from business import admin

def test_admin_login_page():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = False
    rv = c.get('/admin')
    assert 'admin-login-form' in rv.data

    with c.session_transaction() as sess:
      sess['is_admin'] = True
    rv = c.get('/admin')
    assert 'admin-content' in rv.data


def test_admin_login_success():
  with app.test_client() as c:
    data = dict(
      username=config.DEFAULT_ADMIN_LOGIN_NAME, 
      password=config.DEFAULT_ADMIN_PASSWORD
    )
    rv = send_json('post', '/admin_login', data, c)
    assert session.get('is_admin', False) == True
    assert 'success' in rv.data
    assert rv.status_code == 200


def test_admin_login_fail():
  with app.test_client() as c:
    data = dict(
      username='jerry', 
      password='nopassword'
    )
    rv = send_json('post', '/admin_login', data, c)
    assert session.get('is_admin', False) == False
    assert 'failed' in rv.data
    assert 'user not found' in rv.data
    assert rv.status_code == 401

  with app.test_client() as c:
    data = dict(
      username=config.DEFAULT_ADMIN_LOGIN_NAME, 
      password='nopassword'
    )
    rv = send_json('post', '/admin_login', data, c)
    assert session.get('is_admin', False) == False
    assert 'failed' in rv.data
    assert 'password is not correct' in rv.data
    assert rv.status_code == 401


def test_admin_logout():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
    rv = send_json('post', '/admin_logout', {}, c)  
    assert session.get('is_admin', False) == False
    assert rv.status_code == 200

    rv = send_json('post', '/admin_logout', {}, c)  
    assert session.get('is_admin', False) == False
    assert rv.status_code == 400


def test_get_current_admin():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    rv = c.get('/')  
    current_admin = admin.get_current_admin()
    assert current_admin.id == 1
