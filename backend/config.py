import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# Load environment variables if the env.py file exists
if os.path.exists("env.py"):
    import env

app = Flask(__name__)
CORS(app)

# Set the secret key
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

# Configure SQLAlchemy Database URI
uri = os.environ.get("DB_URL") if os.environ.get("DEVELOPMENT") == "True" else os.environ.get("DATABASE_URL")

if uri is None:
    raise ValueError("DATABASE_URL or DB_URL environment variable must be set.")

# Handle potential sqlite URI parsing issue
if uri.startswith("sqlite://"):
    uri = uri.replace("sqlite://", "sqlite:///", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = uri

# Initialize the database
db = SQLAlchemy(app)
app.app_context().push()
