import os

from flask import Flask, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Booking, Contact
from config import Config
from flask import Blueprint
from datetime import datetime, timedelta
import flask_login
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session


app = Flask(__name__)
CORS(app, supports_credentials=True)

db_path = os.path.join(app.instance_path, 'sqlite.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the server
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
# Load this securely in production
RECAPTCHA_SECRET = os.getenv("6LcWmYgrAAAAANWzuM0-TOrxJV80Tg590lN_a8M6", "6LcWmYgrAAAAAA0NHlBbvNqOge93cNRi3L2OIpIh")

Session(app)


login_manager = flask_login.LoginManager()
login_manager.init_app(app)


db.init_app(app)


# Create all tables in the database
with app.app_context():
    # db.drop_all() # to clean the cache
    db.create_all()


@app.route('/', methods=["GET", "POST"])
def home():
    if request.method == "GET":
        bookings = Booking.query.all()
        booking_list = [{
            'id': book.id,
            'name': book.name,
            'number_of_people': book.number_of_people,
            'activity': book.activity,
            'date_time': book.date_time.strftime('%Y-%m-%d'),
            'phone': book.phone,
            'email': book.email
        } for book in bookings]

        # Collect booked dates per activity
        booked_dates = {}
        for book in bookings:
            date_str = book.date_time.strftime('%Y-%m-%d')
            if date_str not in booked_dates:
                booked_dates[date_str] = []
            booked_dates[date_str]
        return {
            "bookings": booking_list,
            "booked_dates": booked_dates
        }

    if request.method == "POST":
        data = request.get_json()

        recaptcha_token = data.get("recaptcha_token")
        if not recaptcha_token:
            return jsonify({"message": "Missing reCAPTCHA token"}), 400

        # Verify reCAPTCHA with Google
        recaptcha_response = verify_recaptcha(recaptcha_token)
        if not recaptcha_response["success"]:
            return jsonify({"message": "Failed reCAPTCHA verification"}), 403

        # Prevent booking for past dates
        booking_date = datetime.strptime(data['date_time'], '%Y-%m-%d').date()
        today = datetime.now().date()
        if booking_date < today:
            return {"message": "Cannot book a past date"}, 400

        # Check if the date is already booked
        existing_booking = Booking.query.filter_by(
            date_time=booking_date, 
        ).first()
        if existing_booking:
            return {"message": "The selected date is already booked. Please choose a different date."}, 409

        # Add new booking
        new_booking = Booking(
            name=data['name'], 
            number_of_people=data['number_of_people'],
            activity=data['activity'],
            date_time=booking_date,
            phone=data['phone'],
            email=data['email']
        )
        return {"message": "Booking created successfully"}, 201



@app.route('/confirmation_booking', methods=['POST'])
def confirmation_booking():

    if request.method == "POST":
        data = request.get_json()
            
        new_booking= Booking(
            name = data['name'], 
            number_of_people = data['number_of_people'],
            activity=data['activity'],
            date_time =datetime.strptime(data['date_time'], '%Y-%m-%d'),
            phone = data['phone'],
            email = data['email']
        )
    db.session.add(new_booking)
    db.session.commit()
    # session.pop(data) # To clear session after confirmation
    return {"message": "Booking confirmed"}, 201

 # Initialize DB
@app.before_request
def create_tables():
    db.create_all()


# User Registration (Admin Only)
@app.route('/register', methods=['POST'])
@jwt_required()
def register():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if user.is_admin != 'admin':
        return {"message": "Only admin can register users"}, 403

    data = request.json
    admin_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password=admin_password, is_admin=data['is_admin'])
    db.session.add(new_user)
    db.session.commit()
    return {"message": "User registered successfully"}, 201


# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return {"message": "Invalid credentials"}, 401
    token = create_access_token(identity=user.username)
    return {"token": token, "is_admin": user.is_admin}, 200

# Admin/Manager Dashboard
@app.route('/dashboard', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def manage_data():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    # Check user administration
    if user.is_admin not in ['admin', 'manager']:
        return {"message": "Access denied"}, 403

    if request.method == 'GET':
        bookings = Booking.query.all()
        booking_list = [{
                'id':book.id,
                'name': book.name,
                'number_of_people': book.number_of_people,
                'activity': book.activity,
                'date_time': book.date_time.strftime('%Y-%m-%d'),
                'phone': book.phone,
                'email': book.email
            } for book in bookings]
        return {'booking_list': booking_list}, 200

    if request.method == 'POST':
        data = request.json
        new_booking= Booking(
            name = data['name'], 
            number_of_people = data['number_of_people'],
            activity=data['activity'],
            date_time =datetime.strptime(data['date_time'], '%Y-%m-%d'),
            phone = data['phone'],
            email = data['email']
        )
        db.session.add(new_booking)
        db.session.commit()
        return {"message": "Data added successfully"}, 201

    if request.method == 'DELETE':
       current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    # Ensure user is admin/manager
    if user.is_admin not in ['admin', 'manager']:
        return {"message": "Access denied"}, 403

    data = request.get_json()
    booking_to_delete = Booking.query.get(data['id'])
    if booking_to_delete:
        db.session.delete(booking_to_delete)
        db.session.commit()
        return {"message": "Booking deleted successfully"}, 200
    return {"message": "Booking not found"}, 404


@app.route("/contact", methods=['GET', 'POST'])
def contact():
    if request.method == 'GET':
        contacts = Contact.query.all()
        contact_list = [{
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'text': contact.text
        } for contact in contacts]
        return{'contact_list': contact_list}

    if request.method == 'POST':
        data = request.get_json()
        new_contact = Contact(
            name = data['name'],
            email = data['email'],
            text = data['text']
        )
        db.session.add(new_contact)
        db.session.commit()
        return {"message": "Data added successfully"}, 201


# Admin/Manager Contact
@app.route('/contact_admin', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def manage_text():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if user.is_admin not in ['admin', 'manager']:
        return {"message": "Access denied"}, 403

    if request.method == 'GET':
        contacts = Contact.query.all()
        contact_list = [{
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'text': contact.text
            } for contact in contacts]
        return {'contact_list': contact_list}, 200

    if request.method == 'POST':
        data = request.json
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            text=data['text']
        )
        db.session.add(new_contact)
        db.session.commit()
        return {"message": "Data added successfully"}, 201

    if request.method == 'DELETE':
        data = request.get_json()
        contact_to_delete = Contact.query.get(data['id'])
        if contact_to_delete:
            db.session.delete(contact_to_delete)
            db.session.commit()
            return {"message": "Contact deleted successfully"}, 200
        return {"message": "Contact not found"}, 404


if __name__ == '__main__':
    app.run(debug=True)