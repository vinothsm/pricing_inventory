import jwt
import bcrypt
from auth import protected
from models import get_db, Users
from datetime import datetime, timedelta, timezone
import sqlalchemy.orm as orm
from sanic_openapi import doc
from sanic import Blueprint, response

user = Blueprint("user", url_prefix="/user")
db = get_db()


@user.post("/login")
@doc.consumes(
    doc.JsonBody(
        {
            "user": doc.String("The name of your user account."),
            "password": doc.String("The password of your user account."),
        }
    ),
    location="body",
)
async def login(request):
    email = request.json.get("email")
    password = request.json.get("password", "").encode("utf-8")
    user = db.query(Users).filter(Users.email == email).first()
    if user and user.verify_password(password):
        tok_exp = datetime.now(tz=timezone.utc) + timedelta(days=10)
        token = jwt.encode(
            {"user": str(user.email), "id": str(user.id), "exp": tok_exp},
            request.app.config.SECRET,
        )
        db.commit()
        return response.json(
            {
                "_id": user.id,
                "username": user.name,
                "email": user.email,
                "token": token,
            },
            200,
        )

    else:
        db.commit()
        return response.json({"message": "Invalid username or password"}, 401)


@user.post("/register")
@doc.consumes(
    doc.JsonBody(
        {
            "name": doc.String("The name of your user account."),
            "password": doc.String("The password of your user account."),
            "email": doc.String("The email of your user account."),
            "store_id": doc.Integer("The store_id of your user account."),
        }
    ),
    location="body",
)
async def register(request):
    userData = request.json.get("userData", {})
    username = userData.get("name", "")
    password = userData.get("password", "")
    email = userData.get("email", "")
    store_id = userData.get("storeId", 1)

    hash_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )
    user = Users(name=username, password=hash_password, email=email, store_id=store_id)
    # check if user exists
    if db.query(Users).filter(Users.name == username).first():
        return response.json({"message": "User already exists."}, 409)
    # hash password bcrypt
    db.add(user)
    db.commit()
    return response.json({"message": "User created successfully."}, 201)
