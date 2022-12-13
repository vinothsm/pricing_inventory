import os
import jwt
import aiofiles
from controllers.users import user
from controllers.pricing import pricing
from sanic_cors import CORS
from auth import protected
from sanic import Sanic, text, response
from sanic_openapi import openapi2_blueprint
from controllers.stores import process_file

app = Sanic("AuthApp")
CORS(app, automatic_options=True)
app.config.SECRET = os.getenv("pricing_secret")
app.config["upload"] = "./uploads"
# app.register_blueprint(controllers.users.users)
app.blueprint(user)
app.blueprint(pricing)
# app.blueprint(controllers.stores)
app.blueprint(openapi2_blueprint)


@app.route("/upload", methods=["POST"])
# @protected
async def omo(request):
    if not os.path.exists(app.config["upload"]):
        os.makedirs(app.config["upload"])
    async with aiofiles.open(
        app.config["upload"] + "/" + request.files["file"][0].name, "wb"
    ) as f:
        await f.write(request.files["file"][0].body)
    f.close()
    try:
        user_id = jwt.decode(
            request.token, request.app.config.SECRET, algorithms=["HS256"]
        ).get("id", 0)
        process_resp = process_file(
            app.config["upload"] + "/" + request.files["file"][0].name, user_id
        )
        if process_resp[0]:
            return response.json({"message": process_resp[1]}, 200)
        else:
            return response.json({"message": process_resp[1]}, 400)
    except:
        return response.json({"message": "Invalid token"}, 401)
