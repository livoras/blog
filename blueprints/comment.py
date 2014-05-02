# coding=utf-8
import config

from flask import Blueprint, jsonify, request, \
                  render_template, session, abort

from business import comment
from common import utils
from models.post import Post
from models.comment import Comment

comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/new_comment', methods=["POST"])
def create_new_comment():
  data = request.json
  new_comment = comment.create_new_comment(data)
  if isinstance(new_comment, Comment):
    return utils.success(new_comment.get_dict())
  else:  
    error = new_comment
    return utils.fail(error, 400)


@comment_bp.route('/delete_comment', methods=["DELETE"])
def delete_comment():
  data = request.json
  if not session.get('is_admin'):
    return abort(404)
  else:  
    error = comment.delete_comment(data)
    if error:
      return utils.error(error)
    else:
      return utils.success()
