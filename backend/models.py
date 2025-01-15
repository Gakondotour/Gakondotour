from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from enum import Enum

db = SQLAlchemy()


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.String(20), nullable=False)  # admin


class ActivityOptions(Enum):
    RUBONA_HIKING = "Rubona hiking"
    CONGO_NILE_TRAIL = "Congo Nile trail"
    GISENYI_CITY_TOUR = "Gisenyi city tour"
    BOAT_TRIP = "Boat trip"
    COFFEE_AND_TEA_TOUR = "Coffee and tea tour"
    RURAL_AREA_TOUR = "Rural area tour"
    CULTURE_TOURS = "Culture tours"
    ISLAND_TOURS = "Island tours"
    BANANA_BEER_DEMONSTRATION = "Banana beer demonstration"

    def __str__(self):
        return self.value


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False)
    activity = db.Column(db.Enum(ActivityOptions), nullable=False)
    date_time = db.Column(db.Date, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Booking {self.name}, {self.date_time}, {self.activity.value}, {self.email}>'
