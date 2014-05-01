# coding=utf-8
import config

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
    sess['is_admin'] = True
    sess['user'] = str(user_dict)
    return user_dict
  else:  
    return ['password is not correct']


def get_current_admin():
  if sess.get('is_admin'):
    admin_dict = eval(sess.get('user'))
    return session.query(User).filter_by(id=admin_dict['id']).first()
  else:  
    return None
