import os
import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

# import path


# DATABASE_URL = "sqlite:///./eg.db"


# db_user = os.environ['db_user']
# db_pass = os.environ['db_pass']

DATABASE_URL = (
    f"postgresql+psycopg2://pricing:pricing@localhost:5432/pricing"
)

engine = _sql.create_engine(DATABASE_URL)

SessionLocal = _orm.sessionmaker(bind=engine)

Base = _declarative.declarative_base()
