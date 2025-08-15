import os

from flask import Flask, request, redirect, url_for, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Booking, Contact
from config import Config
from flask import Blueprint
from datetime import datetime, timedelta
import flask_login
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from google_auth_oauthlib.flow import Flow
import requests
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64

app = Flask(__name__)
CORS(app, supports_credentials=True)
db_path = os.path.join(app.instance_path, 'sqlite.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the server
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')
app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
app.config["JWT_QUERY_STRING_NAME"] = "token"



Session(app)


login_manager = flask_login.LoginManager()
login_manager.init_app(app)


db.init_app(app)


# Create all tables in the database
with app.app_context():
    # db.drop_all() # to clean the cache
    db.create_all()

if os.environ.get("FLASK_ENV") == "development":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

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

EMAIL_DEFAULT = os.environ.get('EMAIL_DEFAULT')
# Load sensitive variables from environment
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
GOOGLE_AUTH_REDIRECT_URL = os.environ.get('GOOGLE_AUTH_REDIRECT_URL')
SCOPES = ['openid','https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/userinfo.email']

@app.route('/authorize')
def authorize():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_AUTH_REDIRECT_URL],
                "auth_uri": "https://accounts.google.com/o/oauth2/v2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=SCOPES
    )
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    auth_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return redirect(auth_url)

@app.route('/oauth2callback')
def oauth2callback():
    state = session.get('state')
    if not state:
        return {"error": "Missing OAuth state"}, 400

    # Exchange code for tokens
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_AUTH_REDIRECT_URL],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials

    # Get Google user info
    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {credentials.token}"}
    )
    user_info = user_info_response.json()
    email = user_info.get("email")
    name = user_info.get("name", email.split("@")[0])

    if not email:
        return {"error": "Could not retrieve email from Google"}, 400

    # Find or create user
    user = User.query.filter_by(username=email).first()
    role='admin' if EMAIL_DEFAULT==email else 'user'
    if not user:
        user = User(username=email, password=generate_password_hash(os.urandom(16).hex()), is_admin=role)
        db.session.add(user)
        db.session.commit()

    # Save Google tokens in DB
    user.access_token = credentials.token
    user.refresh_token = credentials.refresh_token
    user.token_expiry = credentials.expiry
    db.session.commit()

    # Create JWT token
    token = create_access_token(identity=user.username)

    # Create a redirect response
    resp = make_response(redirect(url_for('dashboard')))

    # Store the JWT in an HttpOnly cookie
    set_access_cookies(resp, token)

    return resp

@app.route('/sendmail', methods=['POST'])
def sendMail():
    # First check if specific user exists with an access_token
    user = User.query.filter_by(username=EMAIL_DEFAULT) \
                     .filter(User.access_token.isnot(None)) \
                     .first()

    # If not found, fallback to first user with an access_token
    if not user:
        user = User.query.filter(User.access_token.isnot(None)).first()

    if not user:
        return {"error": "No user with valid Google credentials found"}, 400
    # Recreate credentials object
    creds = Credentials(
        token=user.access_token,
        refresh_token=user.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=SCOPES
    )

    # If token expired, refresh it
    if creds.expired and creds.refresh_token:
        creds.refresh(requests.Request())
        user.access_token = creds.token
        user.token_expiry = creds.expiry
        db.session.commit()

    # Read new data format
    data = request.json
    name = data.get("name")
    email = data.get("email")
    price = data.get("price")

    if not name or not email or not price:
        return {"error": "Missing 'name', 'email', or 'price'"}, 400

    # Build subject & body
    subject = f"Booking Confirmation for {name}"
    body_text = f"Hello {name},\n\nYour booking has been confirmed.\nTotal price: {price}\n\nThank you!"

    # Create the email
    message = MIMEText(body_text)
    message['to'] = email
    message['from'] = user.username
    message['subject'] = subject

    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    # Send email via Gmail API
    service = build('gmail', 'v1', credentials=creds)
    try:
        print('reachy')
        service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
    except Exception as e:
        return {"error": str(e)}, 500

    return {"message": "Email sent successfully"}, 200


if __name__ == '__main__':
    app.run(debug=True)