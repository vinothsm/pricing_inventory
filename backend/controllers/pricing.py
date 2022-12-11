import json
import time
from auth import protected
from models import get_db, PricingRecords
from datetime import datetime, timedelta, timezone
import sqlalchemy.orm as orm
from sanic_openapi import doc
from sanic import Blueprint, response

pricing = Blueprint("pricing", url_prefix="/pricing")
db = get_db()

from datetime import date, datetime


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


@pricing.get("/pricing_records")
async def get_pricing_records(request):
    limit = request.args["_limit"][0]
    offset = request.args["_start"][0]
    all_pricing_records = db.query(PricingRecords)
    total_records = all_pricing_records.count()
    paginated_records = all_pricing_records.limit(limit).offset(offset)
    result = [pricing_record.to_json() for pricing_record in paginated_records.all()]
    print("*" * 100)
    return response.json(
        {
            "total_records": total_records,
            "records": json.dumps(result, default=json_serial),
        }
    )
