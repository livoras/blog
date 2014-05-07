import os

def change_testing_mode():
  f = file('config.py', 'a+')
  f.write('\nTESTING = False\n')
  f.close()

def delete_live_reload():
  f = file('templates/layout.html', 'r+')
  text = f.read()
  text = text.replace('<script src="//localhost:35729/livereload.js"></script>', '')
  f.close()

  f = file('templates/layout.html', 'w')
  f.write(text)
  f.close()

if __name__ == '__main__':
  change_testing_mode()
  delete_live_reload()
