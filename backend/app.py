from flask import Flask, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Booking, ActivityOptions
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
app.config.from_object(Config)
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the server
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


Session(app)


login_manager = flask_login.LoginManager()
login_manager.init_app(app)


db.init_app(app)


# Create all tables in the database
with app.app_context():
    # db.drop_all() # to clean the cache
    db.create_all()


# @app.route('/', methods=["GET", "POST"])
# def home():

#     if request.method == "GET":
#         bookings = Booking.query.all()
#         booking_list = [{
#                 'id':book.id,
#                 'name': book.name,
#                 'number_of_people': book.number_of_people,
#                 'activity': book.activity.value,
#                 'date_time': book.date_time.strftime('%Y-%m-%d'),
#                 'phone': book.phone,
#                 'email': book.email
#             } for book in bookings]
#         return {'booking_list': booking_list}, 200

#     if request.method == "POST":
#         data = request.get_json()

#         existing_booking = Booking.query.filter_by(date_time=data['date_time']).first()
#         if existing_booking:
#             return {"message": "This date and activity are already booked"}, 409
            
#         new_booking= Booking(
#             name = data['name'], 
#             number_of_people = data['number_of_people'],
#             activity=ActivityOptions[data['activity']],
#             date_time =datetime.strptime(data['date_time'], '%Y-%m-%d'),
#             phone = data['phone'],
#             email = data['email']
#         )
#     return {"message": "Booking data received"}, 201


@app.route('/', methods=["GET", "POST"])
def home():
    if request.method == "GET":
        bookings = Booking.query.all()
        booking_list = [{
            'id': book.id,
            'name': book.name,
            'number_of_people': book.number_of_people,
            'activity': book.activity.value,
            'date_time': book.date_time.strftime('%Y-%m-%d'),
            'phone': book.phone,
            'email': book.email
        } for book in bookings]

        # Collect booked dates per activity
        booked_dates = {}
        for book in bookings:
            activity = book.activity.value
            if activity not in booked_dates:
                booked_dates[activity] = []
            booked_dates[activity].append(book.date_time.strftime('%Y-%m-%d'))

        return {'booking_list': booking_list, 'booked_dates': booked_dates}, 200

    if request.method == "POST":
        data = request.get_json()

        # Prevent booking for past dates
        booking_date = datetime.strptime(data['date_time'], '%Y-%m-%d').date()
        today = datetime.now().date()
        if booking_date < today:
            return {"message": "Cannot book a past date"}, 400

        # Check if the date is already booked for the same activity
        existing_booking = Booking.query.filter_by(
            date_time=booking_date, 
        ).first()
        if existing_booking:
            return {"message": "This date and activity are already booked"}, 409

        # Add new booking
        new_booking = Booking(
            name=data['name'], 
            number_of_people=data['number_of_people'],
            activity=ActivityOptions[data['activity']],
            date_time=booking_date,
            phone=data['phone'],
            email=data['email']
        )
        db.session.add(new_booking)
        db.session.commit()
        return {"message": "Booking created successfully"}, 201



@app.route('/confirmation_booking', methods=['POST'])
def confirmation_booking():

    if request.method == "POST":
        data = request.get_json()
            
        new_booking= Booking(
            name = data['name'], 
            number_of_people = data['number_of_people'],
            activity=ActivityOptions[data['activity']],
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
                'activity': book.activity.value,
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
             activity=ActivityOptions[data['activity']],
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



if __name__ == '__main__':
    app.run(debug=True)
