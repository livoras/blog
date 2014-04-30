import hashlib
import logging
import config

logger = logging.getLogger(config.LOGGER_NAME)

def encrypt(string):
  crypt = hashlib.sha256()
  crypt.update(string)
  return crypt.hexdigest()

def debug(data):
  logger.debug(data)
