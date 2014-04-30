import config
import os

from flask import Flask, render_template, request, send_file
from common import db
from common.utils import debug
from business.admin import create_default_administrator
from business import post

app = Flask(__name__)
app.config.from_object(config)

@app.route('/')
def index():
  posts = post.get_all_posts()
  data = dict(
    title='Livora\'s Blog',
    posts=posts[0:10],
    pages=range(1, len(posts) / 10 + 1),
    active_page=1
  )
  return render_template('index.html', **data)


@app.errorhandler(404)
def check_static(error):
  path = 'static' + request.path
  if os.path.exists(path):
    return send_file(path)
  else:  
    return render_template('404.html'), 404


# Register all blueprints here
from blueprints.admin import admin_bp
from blueprints.post import post_bp
def register_all_bps():
  buleprints_candidates = (admin_bp, post_bp)
  for bp in buleprints_candidates:
    app.register_blueprint(bp)


# Initialize works would be done here
# Including database inlitialization and blueprints registers
db.init_db()
register_all_bps()
create_default_administrator()

if __name__ == '__main__':
  app.run(debug=True)
