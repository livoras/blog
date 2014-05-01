# coding=utf-8
import config

from business import post
from common import utils
from models.post import Post

from flask import \
Blueprint, jsonify, request, \
abort, session, render_template, \
redirect, url_for

post_bp = Blueprint('post', __name__)

@post_bp.route('/new_post')
def show_create_new_post_page():
  if session.get('is_admin'):
    return render_template('new_post.html')
  else:  
    return redirect('/admin')

@post_bp.route('/new_post', methods=['POST'])
def create_new_post():
  if session.get('is_admin'):
    data = request.json
    new_post = post.create_new_post(data)

    if not isinstance(new_post, Post):
      error = new_post
      return utils.fail(error, 400)
    else:  
      return utils.success(new_post.get_dict())
  else:  
    return 'fuck you', 400


@post_bp.route('/post/<int:post_id>')
def show_post(post_id):
  the_post = post.get_post_by_id(post_id)
  if not the_post: abort(404)

  data = dict(post=the_post)
  return render_template('post_detail.html', **data)


@post_bp.route('/page/<int:page_count>')
def show_post_by_page(page_count):
  POSTS_PER_PAGE = config.POSTS_PER_PAGE
  start = (page_count - 1) * POSTS_PER_PAGE
  end = page_count * POSTS_PER_PAGE
  posts = post.get_all_posts()
  target_posts = posts[start:end]
  if len(target_posts) == 0: abort(404)
  data = dict(
    title=config.TITLE,
    posts=target_posts,
    pages=range(1, len(posts) / POSTS_PER_PAGE + 1),
    active_page=page_count
  )
  return render_template('index.html', **data)
