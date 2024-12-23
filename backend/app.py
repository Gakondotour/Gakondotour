import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# from models import Create
# Load environment variables if the env.py file exists
if os.path.exists("env.py"):
    import env


app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_key')
app.config['DB_URL'] = os.environ.get('DB_URL')
app.config['ALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS")

# Initialize the database
db = SQLAlchemy()

@app.route('/')
def home():
    return{'m':'m'}


if __name__ == "__main__":
    app.run(
        host=os.environ.get("IP"),
        port=os.environ.get("PORT"),
        debug=os.environ.get("DEBUG"),
    )