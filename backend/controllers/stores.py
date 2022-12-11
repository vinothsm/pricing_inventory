import pandas as pd
from db import engine

columns_list = ["store_id", "sku", "product_name", "price", "date"]
# read the csv file and save the reocrds to pricing_records database table
def process_file(file_name):
    # read the csv file and save the reocrds to pricing_records database table
    # return the number of records saved
    df = pd.read_csv(file_name)
    print(df.columns)
    if not validate_columns(df, columns_list):
        print("Processing files$$$$$$$$$$$$$$$$$$$$$")
        return False
    df.to_sql("pricing_records", con=engine, if_exists="append", index=False)
    print("Processing files************************")
    return True


def validate_columns(df, columns_list):
    if all(item in df.columns for item in columns_list):
        return True
    else:
        return False
