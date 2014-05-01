# coding=utf-8
from flask import Blueprint, jsonify, request, abort, session, render_template
from business import admin
from business import post
from common import utils
from models.user import User

admin_bp = Blueprint('user', __name__)

@admin_bp.route('/admin_login', methods=['POST'])
def admin_login():
  data = request.json
  result = admin.login(data)
  if session.get('is_admin'):
    return utils.success(result)
  else:  
    return utils.fail(result, 401)


@admin_bp.route('/admin_logout', methods=['POST'])
def admin_logout():
  if session.get('is_admin'):
    session.clear()
    return utils.success()
  else:
    return utils.fail(['user not login'], 400)


@admin_bp.route('/admin')
def admin_page():
  if session.get('is_admin'):
    data = dict(posts=post.get_all_posts())
    return render_template('admin.html', **data)
  else:
    return render_template('admin_login.html')


@admin_bp.route('/update_admin_profile', methods=['POST'])
def update_admin_profile():
  data = request.json
  if not session.get('is_admin'):
    return utils.fail(['user not login'], 401)
  else:  
    update_admin = admin.update_profile(data)
    if isinstance(update_admin, User):
      result = update_admin.get_dict()
      result.pop('password')
      return utils.success(result)
    else:  
      error = update_admin
      return utils.fail(error, 400)


@admin_bp.route('/update_admin_password', methods=['PUT'])
def update_admin_password():
  data = request.json
  if not session.get('is_admin'):
    return utils.fail(['user not login'], 401)
  else:  
    update_admin = admin.update_password(data)
    if isinstance(update_admin, User):
      result = update_admin.get_dict()
      result.pop('password')
      return utils.success(result)
    else:  
      error = update_admin
      return utils.fail(error, 400)
