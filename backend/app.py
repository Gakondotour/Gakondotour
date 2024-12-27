from flask import Flask, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Admin, Booking
from config import Config


app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config.from_object(Config)
db.init_app(app)


# Create all tables in the database
with app.app_context():
    db.create_all()


@app.route('/admin', methods=['GET'])
def get_admin():
    admins = Admin.query.all()
    return [{
        'username': admin.username,
        'password': admin.password
    }for admin in admins]


@app.route('/admins', methods=['POST'])
def add_admin():
    data = request.get_json()
    new_admin = Admin(username=data['username'], password=data['password'])
    db.session.add(new_admin)
    db.session.commit()
    return {'message': 'Admin added'}, 201


@app.route('/', methods=["GET"])
def home():
    book = Booking.query.all()
    json_book = list(map(lambda x: x.to_json(), book))  # Assuming 'to_json' is a method in Create model
    return {"book": json_book}


@app.route('/book', methods=["POST"])
def book():
    name = request.json.get("fullName")
    number_of_people = request.json.get("numberOfPeople")
    activity = request.json.get("activities")
    date_time = request.json.get("dateTime")
    phone = request.json.get("phones")
    email = request.json.get("emails")

    if not name or not number_of_people or not activity or not date_time or not phone or not email:
        return "You should fill all the blanks", 400

    # Create a new 'book' record
    new_book = Booking(
        name=name,
        number_of_people=number_of_people,
        activity=activity,
        date_time=date_time,
        phone=phone,
        email=email,
    )

    try:
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        return {"message": str(e)}, 400

    return "You created a new book", 201


@app.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_booking(user_id):
    book = Booking.query.get(user_id)
    if not book:
        return {"message":"Error not found"}, 404

    db.session.delete(book)
    db.session.commit(book)

if __name__ == '__main__':
    app.run(debug=True)