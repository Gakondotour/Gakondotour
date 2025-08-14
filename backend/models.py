from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from enum import Enum

db = SQLAlchemy()


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.String(20), nullable=False)  # admin
    access_token = db.Column(db.Text)
    refresh_token = db.Column(db.Text)
    token_expiry = db.Column(db.DateTime)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False)
    activity = db.Column(db.JSON, nullable=False)  # Allow multiple activities
    date_time = db.Column(db.Date, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Booking {self.name}, {self.date_time}, {self.activity.value}, {self.email}>'


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    text = db.Column(db.String(10000), nullable=False)

    def __repr__(self):
        return f'<Contact {self.name}, {self.email}, {self.text}>'