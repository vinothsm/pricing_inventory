import pandas as pd
from db import engine
from models import get_db, PricingRecords, Users

db = get_db()


def get_store_id(user_id):
    store_id = db.query(Users).filter(Users.id == user_id).first().store_id
    return store_id


columns_list = ["store_id", "sku", "product_name", "price", "date"]
# read the csv file and save the reocrds to pricing_records database table
def process_file(file_name, user_id):
    # read the csv file and save the reocrds to pricing_records database table
    # return the number of records saved
    df = pd.read_csv(file_name)
    if not validate_columns(df, columns_list):
        return (False, "columns are not valid")
    if not validate_store_id(df, user_id):
        return (False, "store_id does not belong to the user who is uploading the file")
    df.to_sql("pricing_records", con=engine, if_exists="append", index=False)
    return (True, "Processed successfully")


def validate_columns(df, columns_list):
    if all(item in df.columns for item in columns_list):
        return True
    else:
        return False


def validate_store_id(df, user_id):
    # check if store_id belongs to the User who is uploading the file
    # return True if store_id belongs to the User who is uploading the file
    # return False if store_id does not belong to the User who is uploading the file
    store_id = get_store_id(user_id)
    return (df["store_id"] == store_id).all()
