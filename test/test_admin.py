import config

from app import app
from flask import session
from . import send_json
from business import admin

from common.utils import debug, encrypt

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
    assert rv.status_code == 401


def test_get_current_admin():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    rv = c.get('/')  
    current_admin = admin.get_current_admin()
    assert current_admin.id == 1

def test_update_admin_profile():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data =  dict(
      username='lucy',
      name='jerry',
      email='livoras@163.com'
    ) 
    rv = send_json('post', '/update_admin_profile', data, c)
    current_admin = admin.get_current_admin()
    assert 'success' in rv.data
    debug(current_admin)
    assert current_admin.username == data['username']
    assert current_admin.name == data['name']
    assert current_admin.email == data['email']
    assert 'lucy' in session['user']

    with c.session_transaction() as sess:
      sess.clear()
    data =  dict(
      username='lucy',
      name='jerry',
      email='livoras@163.com'
    ) 
    rv = send_json('post', '/update_admin_profile', data, c)
    assert 'failed' in rv.data

def test_update_admin_password():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data =  dict(
      old_password='123456',
      new_password='jerry'
    ) 
    rv = send_json('put', '/update_admin_password', data, c)
    current_admin = admin.get_current_admin()
    assert 'success' in rv.data
    assert current_admin.password == encrypt(data['new_password'])


    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data = dict(
      old_password='fuckyou',
      new_password='jerry'
    ) 
    rv = send_json('put', '/update_admin_password', data, c)
    current_admin = admin.get_current_admin()
    assert 'failed' in rv.data
    assert 'not correct' in rv.data


    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data = dict(
      old_password='jerry',
      new_password=''
    ) 
    rv = send_json('put', '/update_admin_password', data, c)
    current_admin = admin.get_current_admin()
    assert 'failed' in rv.data
    assert 'empty' in rv.data


    with c.session_transaction() as sess:
      sess['is_admin'] = False
    data = dict(
      old_password='jerry',
      new_password='lucyooo'
    ) 
    debug(rv.data)
    rv = send_json('put', '/update_admin_password', data, c)
    assert 'failed' in rv.data
    assert 'not login' in rv.data
