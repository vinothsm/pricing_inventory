import jwt
import json
import time
from auth import protected
from models import get_db, PricingRecords, Users
from datetime import datetime, timedelta, timezone
import sqlalchemy.orm as orm
from sanic_openapi import doc
from sanic import Blueprint, response
from sqlalchemy import update, or_

pricing = Blueprint("pricing", url_prefix="/pricing")
db = get_db()

from datetime import date, datetime


def get_store_id(user_id):
    store_id = db.query(Users).filter(Users.id == user_id).first().store_id
    return store_id


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


@pricing.get("/pricing_records")
async def get_pricing_records(request):
    try:
        user_id = jwt.decode(
            request.token, request.app.config.SECRET, algorithms=["HS256"]
        ).get("id", 0)
    except:
        return response.json({"message": "Invalid token"}, 401)

    limit = request.args["_limit"][0]
    offset = request.args["_start"][0]
    # filter pricing records based on the store_id
    store_id = get_store_id(user_id)
    all_pricing_records = db.query(PricingRecords).filter(
        PricingRecords.store_id == store_id
    )
    total_records = all_pricing_records.count()
    paginated_records = all_pricing_records.limit(limit).offset(offset)
    result = [pricing_record.to_json() for pricing_record in paginated_records.all()]
    return response.json(
        {
            "total_records": total_records,
            "records": json.dumps(result, default=json_serial),
        }
    )


@pricing.post("/update_pricing_records")
async def update_pricing_records(request):
    try:
        user_id = jwt.decode(
            request.token, request.app.config.SECRET, algorithms=["HS256"]
        ).get("id", 0)
    except:
        return response.json({"message": "Invalid token"}, 401)
    sku = request.json.get("sku", "")
    data = request.json.get("data", {})
    update_Stmt = update(PricingRecords).where(PricingRecords.sku == sku).values(data)
    db.execute(update_Stmt)
    db.commit()
    return response.json({"message": "update successfully"}, 200)


@pricing.get("/filter_pricing_records")
async def filter_pricing_records(request):
    try:
        user_id = jwt.decode(
            request.token, request.app.config.SECRET, algorithms=["HS256"]
        ).get("id", 0)
    except:
        return response.json({"message": "Invalid token"}, 401)

    # filter pricing records based on the store_id
    request_args = request.args
    store_id = get_store_id(user_id)
    all_pricing_records = db.query(PricingRecords).filter(
        PricingRecords.store_id == store_id,
    )

    if "sku" in request_args:
        all_pricing_records = all_pricing_records.filter(
            PricingRecords.sku.like(f'%{request_args["sku"][0]}%')
        )
    if "product_name" in request_args:
        all_pricing_records = all_pricing_records.filter(
            PricingRecords.product_name.like(f'%{request_args["product_name"][0]}%')
        )
    if "price" in request_args:
        all_pricing_records = all_pricing_records.filter(
            PricingRecords.price.like(f'%{request_args["price"][0]}%')
        )
    if "date" in request_args:
        all_pricing_records = all_pricing_records.filter(
            PricingRecords.date.like(f'%{request_args["date"][0]}%')
        )

    total_records = all_pricing_records.count()
    paginated_records = all_pricing_records.limit(50).offset(0)
    result = [pricing_record.to_json() for pricing_record in paginated_records.all()]
    return response.json(
        {
            "total_records": total_records,
            "records": json.dumps(result, default=json_serial),
        }
    )
