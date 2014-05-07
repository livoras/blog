from flask import request, session
from common import utils
from functools import wraps

def admin_check(route_fn):
  '''
  Descorator which accpets a view fuction of flask.
  will check if the administrator of the blog has already logined.
  '''
  @wraps(route_fn)
  def _route_fn():
    if not session.get('is_admin'):
      return utils.fail(['user not login'], 401)
    else:  
      return route_fn()
  return _route_fn  
