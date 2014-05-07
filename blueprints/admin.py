# coding=utf-8
import config

from flask import Blueprint, jsonify, \
                  request, abort, session, \
                  render_template, send_file

from business import admin
from business import post
from common import utils
from models.user import User
from . import admin_check

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
@admin_check
def admin_logout():
  session.clear()
  return utils.success()


@admin_bp.route('/update_admin_profile', methods=['POST'])
@admin_check
def update_admin_profile():
  data = request.json
  update_admin = admin.update_profile(data)
  if isinstance(update_admin, User):
    result = update_admin.get_dict()
    result.pop('password')
    return utils.success(result)
  else:  
    error = update_admin
    return utils.fail(error, 400)


@admin_bp.route('/update_admin_password', methods=['PUT'])
@admin_check
def update_admin_password():
  data = request.json
  update_admin = admin.update_password(data)
  if isinstance(update_admin, User):
    result = update_admin.get_dict()
    result.pop('password')
    return utils.success(result)
  else:  
    error = update_admin
    return utils.fail(error, 400)


@admin_bp.route('/get_db')
def get_db():
  if not session.get('is_admin'):
    return abort(404)
  else:  
    db_name = config.DB_FILE
    return send_file(db_name, as_attachment=True, attachment_filename=db_name)


@admin_bp.route('/admin')
def admin_page():
  if session.get('is_admin'):
    data = dict(posts=post.get_all_posts())
    return render_template('admin.html', **data)
  else:
    return render_template('admin_login.html')
