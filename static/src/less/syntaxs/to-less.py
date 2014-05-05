import os

for root, dirs, files in os.walk('.'):
  for filename in files:
    if filename.find('css') is not -1:
      os.rename(filename, filename[:-3] + 'less')
