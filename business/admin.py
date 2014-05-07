# coding=utf-8
import config
import json

from models.user import User
from common import utils
from common.db import session
from flask import session as sess

def create_default_administrator():
  if session.query(User).count() == 0:
    new_admin = User(
      config.DEFAULT_ADMIN_LOGIN_NAME, 
      config.DEFAULT_ADMIN_NICK_NAME,
      config.DEFAULT_ADMIN_PASSWORD
    )
    session.add(new_admin)
    session.commit()
    return True


def login(data):
  username = data.get('username')
  password = data.get('password')

  if not username:
    return ['username is empty']
  if not password:
    return ['password is empty']

  password = utils.encrypt(password)
  admin = session.query(User).filter_by(username=username).first()

  if not admin: 
    return ['user not found']

  if admin.password == password:
    user_dict = admin.get_dict()
    set_session(admin)
    return user_dict
  else:  
    return ['password is not correct']


def get_current_admin():
  if sess.get('is_admin'):
    admin_dict = json.loads(sess.get('user'))
    return session.query(User).filter_by(id=admin_dict['id']).first()
  else:  
    return None


def update_profile(data):
  admin_dict = json.loads(sess.get('user'))
  admin = session.query(User).filter_by(id=admin_dict['id']).first()

  admin.username = data.get('username') or admin.username
  admin.email = data.get('email') or admin.email
  admin.name = data.get('name') or admin.name

  set_session(admin)
  session.commit()
  return admin


def update_password(data):
  admin_dict = json.loads(sess.get('user'))
  admin = session.query(User).filter_by(id=admin_dict['id']).first()

  new_password = data.get('new_password')
  if not new_password:
    return ['new password is empty']

  if admin.password != utils.encrypt(data.get('old_password')):
    return ['old password is not correct']
  else:    
    admin.password = utils.encrypt(new_password)
    set_session(admin)
    session.commit()
    return admin


def set_session(admin):
  sess['is_admin'] = True
  sess['user'] = str(admin)
  sess.update(admin.get_dict())
