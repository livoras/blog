import hashlib

def encrypt(string):
  crypt = hashlib.sha256()
  crypt.update(string)
  return crypt.hexdigest()
