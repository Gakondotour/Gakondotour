import os
from flask import Flask, render_template
from flask_cors import CORS
from env import Config


app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return {"message":"Hello React"}


if __name__ == "__main__":
    app.run(
        host=os.environ.get("IP", "0.0.0.0"),
        port=int(os.environ.get("PORT", "5000")),
        )