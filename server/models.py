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



# User Model
class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)  # User ID
    name = db.Column(db.String(100), nullable=False)  # Name
    username = db.Column(db.String(50), unique=True, nullable=False)  # Username
    password = db.Column(db.String(60), nullable=False)  # Password
    address = db.Column(db.String(255))  # Address
    phone_number = db.Column(db.String(20))  # Phone number
    email = db.Column(db.String(30)) # Email

    animals = db.relationship('Animal', back_populates='user', cascade='all, delete-orphan') # Relationship mapping the user to related animals

    serialize_rules = ('id', 'name', 'username', 'address', 'phone_number', 'email')

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
class Animal(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'animals'

    id = db.Column(db.Integer, primary_key=True)  # Animal ID
    name = db.Column(db.String(100))  # Name
    type = db.Column(db.String(50), nullable=False)  # Type
    breed = db.Column(db.String(50))  # Breed
    weight = db.Column(db.Integer)  # Weight
    temperament = db.Column(db.String(50))  # Temperament
    photo = db.Column(db.String(100))  # Photo path
    
    appointments = db.relationship('Appointment', back_populates='animal', cascade='all, delete-orphan') # Relationship mapping the animal to related appointments

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Foreign key to store the user id

    user = db.relationship('User', back_populates='animals') # Relationship mapping the animal to related users

    serialize_rules = ('id', 'name', 'type', 'breed', 'weight', 'temperament', 'photo')

    # Method to upload photo
    def upload_photo(self, photo_file):
        if photo_file:
            filename = secure_filename(photo_file.filename)
            upload_folder = "static/uploads"
            os.makedirs(upload_folder, exist_ok=True)  # Creates a directory only needed for first upload
            photo_path = os.path.join(upload_folder, filename)
            photo_file.save(photo_path)
            self.photo = filename  # Update database with the filename

    def __repr__(self):
        return f"Animal('{self.type}', '{self.breed}', '{self.color}')"

# Function to get photo URL
def get_photo_url(filename):
    return url_for("static", filename=f"uploads/{filename}")

#Association table objects that store services connected to appointments Many-to-Many
appointment_services = db.Table('appointment_services',
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id')),
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'))
)

#Association table objects that store employees connected to appointments Many-to-Many
employee_appointments = db.Table('employee_appointments',
    db.Column('employee_id', db.Integer, db.ForeignKey('employees.id'), primary_key=True),
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id'), primary_key=True)
)
class Appointment(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)

    # Relationship mapping the employee to related appointments
    employees = db.relationship('Employee', secondary=employee_appointments, back_populates='appointments')

    # Relationship mapping the appointment to related appointments
    services = db.relationship('Service', secondary=appointment_services, back_populates='appointments')

    # Relationship mapping the animals to related appointments
    animal = db.relationship('Animal', back_populates="appointments")

    # Foreign key to store the animal id
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'))

    serialize_rules = ('id', 'date', 'time')

    def __repr__(self):
        return f"Appointment('{self.id}')"

class Employee(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    appointments = db.relationship('Appointment', secondary='employee_appointments', back_populates='employees')

    serialize_rules = ('id', 'name')

    def __repr__(self):
        return f'<Employee {self.id}, {self.name}>'


# Service Model
class Service(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    appointments = db.relationship('Appointment', secondary='appointment_services', back_populates='services')

    serialize_rules = ('id', 'name', 'description', 'duration', 'price')

    def __repr__(self):
        return f"Service('{self.name}')"