# coding=utf-8
from flask import Blueprint, jsonify, request, abort, session, render_template
from business import admin
from common import utils

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
    return render_template('admin.html')
  else:
    return render_template('admin_login.html')
