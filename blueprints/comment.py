# coding=utf-8
import config

from flask import Blueprint, jsonify, request, render_template
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
