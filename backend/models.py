from flask_sqlalchemy import SQLAlchemy
from enum import Enum


# Initialize the database
db = SQLAlchemy()

class Create(db.Model):
    option = ("a",'b','c')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    number_of_people = db.Column(db.Integer, unique=False, nullable=False)
    activity = db.Column(db.Enum(option), unique=False, nullable=False)
    date_time = db.Column(db.Date, unique=False, nullable=False)
    phone = db.Column(db.Integer, unique=False, nullable=False)
    email = db.Column(db.String(150), unique=False, nullable=False)

    def json (self):
        return{
            'id': self.id,
            'name':self.name,
            'numberOfPeople': self.number_of_people,
            'activity': self.activity,
            'dateTime': self.date_time,
            'phone': self.phone,
            'email': self.email
        }