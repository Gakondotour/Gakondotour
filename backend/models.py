from flask_sqlalchemy import SQLAlchemy
from enum import Enum


db= SQLAlchemy()


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)


    def __repr__(self):
        return f'<Admin {self.username}>'


class ActivityOptions(Enum):
    A = "a"
    B = "b"
    C = "c"


class Booking(db.Model):


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    number_of_people = db.Column(db.Integer, unique=False, nullable=False)
    activity = db.Column(db.Enum(ActivityOptions), unique=False, nullable=False)
    date_time = db.Column(db.Date, unique=False, nullable=False)
    phone = db.Column(db.Integer, unique=False, nullable=False)
    email = db.Column(db.String(150), unique=False, nullable=False)

    def to_json (self):
        return{
        "id": self.id,
        "fullName":self.name,
        "numberOfPeople": self.number_of_people,
        "activities": self.activity.name,
        "dateTime": self.date_time.isoformat(),
        "phones": self.phone,
        "emails": self.email
        }

