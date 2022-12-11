import os
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
    process_file(app.config["upload"] + "/" + request.files["file"][0].name)
    return response.json(True)
