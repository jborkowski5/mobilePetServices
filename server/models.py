from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

# Flask-related imports
from flask_wtf import FlaskForm
from config import db
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.utils import secure_filename
from flask import url_for
import os

# Initialize SQLAlchemy object
db = SQLAlchemy()

# User Model
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)  # User ID
    username = db.Column(db.String(50), unique=True, nullable=False)  # Username
    password = db.Column(db.String(60), nullable=False)  # Password
    name = db.Column(db.String(100), nullable=False)  # Name
    address = db.Column(db.String(255))  # Address
    phone_number = db.Column(db.String(20))  # Phone number
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))  # Staff ID relationship
    staff = db.relationship('Staff', backref='users')  # Relationship to Staff table

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'address': self.address,
            'phone_number': self.phone_number,
            'staff_id': self.staff_id  # Include other fields as needed
        }

    # User Methods
    def get_id(self):
        return str(self.id)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def __repr__(self):
        return f"User('{self.username}')"

# Animal Model
class Animal(db.Model):
    __tablename__ = 'animals'
    id = db.Column(db.Integer, primary_key=True)  # Animal ID
    type = db.Column(db.String(50), nullable=False)  # Type
    breed = db.Column(db.String(50))  # Breed
    color = db.Column(db.String(50))  # Color
    weight = db.Column(db.Integer)  # Weight
    temperament = db.Column(db.String(50))  # Temperament
    photo = db.Column(db.String(100))  # Photo path
    name = db.Column(db.String(100))  # Name

    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'breed': self.breed,
            'color': self.color,
            'weight': self.weight,
            'temperament': self.temperament,
            'photo': get_photo_url(self.photo),  # Assuming get_photo_url is defined
            'name': self.name,
            'user_id': self.user_id  # Include other fields as needed
        }

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # User ID relationship
    user = db.relationship('User', backref='animals')  # Relationship to User table

    # Method to upload photo
    def upload_photo(self, photo_file):
        if photo_file:
            filename = secure_filename(photo_file.filename)
            upload_folder = "static/uploads"
            os.makedirs(upload_folder, exist_ok=True)  # Create directory if not exists
            photo_path = os.path.join(upload_folder, filename)
            photo_file.save(photo_path)
            self.photo = filename  # Update database with the filename

    def __repr__(self):
        return f"Animal('{self.type}', '{self.breed}', '{self.color}')"

# Function to get photo URL
def get_photo_url(filename):
    return url_for("static", filename=f"uploads/{filename}")

# Service Model
class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration': self.duration,
            'price': self.price  # Include other fields as needed
        }

    def __repr__(self):
        return f"Service('{self.name}')"

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'date': str(self.date),  # Convert date to string for serialization
            'time': str(self.time),  # Convert time to string for serialization
            'user_id': self.user_id,
            'animal_id': self.animal_id,
            'service_id': self.service_id  # Include other fields as needed
        }

    def __repr__(self):
        return f"Appointment('{self.id}', '{self.service.name}')"

# Staff and Association Table
staff_appointments = db.Table('staff_appointments',
    db.Column('staff_id', db.Integer, db.ForeignKey('staff.id'), primary_key=True),
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id'), primary_key=True)
)

class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name  # Include other fields as needed
        }    
    
    # Adding the relationship to services through Service_Staff
    services = db.relationship('Service', secondary='service_staff', backref='staff')

class Service_Staff(db.Model):
    __tablename__ = 'service_staff'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))

    def serialize(self):
        return {
            'id': self.id,
            'service_id': self.service_id,
            'staff_id': self.staff_id  # Include other fields as needed
        }
