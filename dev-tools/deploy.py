import os

def change_testing_mode():
  f = file('config.py', 'a+')
  f.write('\nTESTING = False\n')
  f.close()

if __name__ == '__main__':
  change_testing_mode()
