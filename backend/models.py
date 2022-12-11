import db
import json
import bcrypt
import sqlalchemy as sql


def get_db():
    dbo = db.SessionLocal()
    try:
        return dbo
    finally:
        dbo.close()


class Users(db.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    name = sql.Column(sql.String, unique=True, index=True)
    email = sql.Column(sql.String, unique=True, index=True)
    password = sql.Column(sql.String)
    store_id = sql.Column(sql.Integer, index=True)

    def verify_password(self, password: str):
        # check if password is correct
        # print(password, self.password, self.password.encode('utf-8'))
        return bcrypt.checkpw(password, self.password.encode("utf-8"))


class PricingRecords(db.Base):
    __tablename__ = "pricing_records"
    store_id = sql.Column(sql.Integer, primary_key=True, index=True)
    sku = sql.Column(sql.String, primary_key=True, index=True)
    product_name = sql.Column(sql.String, unique=True, index=True)
    price = sql.Column(sql.String)
    date = sql.Column(sql.Date, index=True)

    def to_json(self):
        return {
            "store_id": self.store_id,
            "sku": self.sku,
            "product_name": self.product_name,
            "price": self.price,
            "date": self.date,
        }


class Stores(db.Base):
    __tablename__ = "stores"
    store_id = sql.Column(sql.Integer, primary_key=True, index=True)
    store_name = sql.Column(sql.String, unique=True, index=True)
    store_address = sql.Column(sql.String, unique=True, index=True)
    store_state = sql.Column(sql.String, unique=True, index=True)
    store_zip = sql.Column(sql.String, unique=True, index=True)
    store_country = sql.Column(sql.String, unique=True, index=True)
    store_phone = sql.Column(sql.String, unique=True, index=True)

    def to_json(self):
        return {
            "store_id": self.store_id,
            "store_name": self.store_name,
            "store_address": self.store_address,
            "store_city": self.store_country,
            "store_state": self.store_state,
            "store_zip": self.store_zip,
            "store_phone": self.store_phone,
        }
