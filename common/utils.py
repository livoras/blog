import hashlib
import logging
import config
from flask import jsonify

logger = logging.getLogger(config.LOGGER_NAME)

def encrypt(string):
  crypt = hashlib.sha256()
  crypt.update(string)
  return crypt.hexdigest()


def debug(data):
  logger.debug(data)


def fail(error=None, status=400):
  error = error or ['something wrong']
  return jsonify(**dict(
    result='failed',
    error=error
  )), status


def success(data=None, status=200):
  data = data or {}
  return jsonify(**dict(
    result='success',
    data=data
  )), status
