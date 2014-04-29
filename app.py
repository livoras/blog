import config
import os

from flask import Flask, render_template, request, send_file
from common import db

app = Flask(__name__)
app.config.from_object(config)

@app.route('/')
def index():
  return render_template('index.html')

@app.errorhandler(404)
def check_static(error):
  path = 'static' + request.path
  if os.path.exists(path):
    return send_file(path)
  else:  
    return render_template('404.html'), 404


db.init_db()

if __name__ == '__main__':
  app.run(debug=True)
