import config

from flask import Flask, render_template, request
from common import db

app = Flask(__name__)
app.config.from_object(config)

@app.route('/')
def index():
  return render_template('index.html')

db.init_db()

if __name__ == '__main__':
  app.run(debug=True)
