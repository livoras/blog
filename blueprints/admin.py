from flask import Blueprint, jsonify, request, abort, session
from business import admin

admin_bp = Blueprint('user', __name__)

@admin_bp.route('/admin_login', methods=['POST'])
def login(self):
  pass
