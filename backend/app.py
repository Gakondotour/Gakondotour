from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Admin
from config import Config


app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)


# Create all tables in the database
with app.app_context():
    db.create_all()


@app.route('/admins', methods=['GET'])
def get_admin():
    admins = Admin.query.all()
    return [{
        'username': admin.username,
        'password': admin.password
    }for admin in admins]


@app.route('/admin', methods=['POST'])
def add_admin():
    data = request.get_json()
    new_admin = Admin(username=data['username'], password=data['password'])
    db.session.add(new_admin)
    db.session.commit()
    return {'message': 'Admin added'}, 201


if __name__ == '__main__':
    app.run(debug=True)