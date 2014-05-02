# coding=utf-8
import config
import json

from business import post
from common import utils
from models.post import Post

from flask import \
Blueprint, jsonify, request, \
abort, session, render_template, \
redirect, url_for

post_bp = Blueprint('post', __name__)

@post_bp.route('/')
def index():
  posts = post.get_all_posts()
  return render_pages(posts, 1)


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
  posts = post.get_all_posts()
  return render_pages(posts, page_count)


@post_bp.route('/edit_post/<int:post_id>')
def show_edit_post(post_id):
  if not session['is_admin']:
    return abort(404)
  current_post = post.get_post_by_id(post_id)
  if not current_post: return abort(404)
  data = dict(
    post=current_post, 
    post_json=json.dumps(current_post.get_dict())
  )
  return render_template('edit_post.html', **data)


@post_bp.route('/update_post', methods=['PUT'])
def update_post():
  data = request.json
  if not session['is_admin']:
    return utils.fail(['user not login'], 401)
  current_post = post.update_post(data)
  if not isinstance(current_post, Post):
    error = current_post
    return utils.fail(error, 400)
  return utils.success(current_post.get_dict())


@post_bp.route('/search_by_tag/<tag_name>/<int:page_count>')
def search_by_tag(tag_name, page_count):
  posts = post.search_by_tag(tag_name)
  link = u'/search_by_tag/{tag_name}/'.format(tag_name=tag_name)
  return render_pages(posts, page_count, link)


@post_bp.route('/search_by_keyword/<keyword>/<int:page_count>')
def search_by_content(keyword, page_count):
  posts = post.search_by_keyword(keyword)
  link = u'/search_by_keyword/{keyword}/'.format(keyword=keyword)
  return render_pages(posts, page_count, link)


def render_pages(posts, page_count, link='/page/'):
  POSTS_PER_PAGE = config.POSTS_PER_PAGE
  start = (page_count - 1) * POSTS_PER_PAGE
  end = page_count * POSTS_PER_PAGE
  target_posts = posts[start:end]
  if len(target_posts) == 0: return abort(404)
  data = dict(
    posts=target_posts,
    pages=post.get_pages_count_by_posts(posts),
    active_page=page_count,
    link=link
  )
  return render_template('index.html', **data)

  
