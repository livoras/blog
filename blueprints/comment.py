# coding=utf-8
import config
import thread

from flask import Blueprint, jsonify, request, \
                  render_template, session, abort, \
                  url_for

from business import comment
from common import utils
from common import mail
from models.post import Post
from models.comment import Comment

comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/new_comment', methods=["POST"])
def create_new_comment():
  data = request.json
  new_comment = comment.create_new_comment(data)
  if isinstance(new_comment, Comment):
    if not config.TESTING: 
      mail_data = new_comment.get_dict()
      thread.start_new_thread(send_mail, (mail_data, new_comment.post.id))
    return utils.success(new_comment.get_dict())
  else:  
    error = new_comment
    return utils.fail(error, 400)


def send_mail(mail_data, post_id):
  mail_data['link'] = '%s/post/%s' % (config.SITE, post_id)
  mail.send(config.MAIL_CONTENT.format(**mail_data))


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
