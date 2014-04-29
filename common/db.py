import sqlalchemy as sc
import config
from sqlalchemy.ext.declarative import declarative_base

engine = sc.create_engine(config.DATABASE_URI, echo=config.ECHO)
Base = declarative_base(engine)

from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)
session = Session()

def init_db():
  Base.metadata.create_all()
