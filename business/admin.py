from models.user import User
from common.db import session

def create_default_administrator():
  if session.query(User).count() == 0:
    new_admin = User('admin', '123456')
    session.add(new_admin)
    session.commit()
    return True
