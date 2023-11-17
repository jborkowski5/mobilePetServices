from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from werkzeug.security import generate_password_hash, check_password_hash
from wtforms import StringField, PasswordField, SubmitField, IntegerField
from wtforms.validators import DataRequired, Length, Regexp
from sqlalchemy.ext.declarative import declarative_base
from flask_wtf.file import FileField, FileAllowed
from flask_wtf import FlaskForm
from config import db
from flask_login import UserMixin
from werkzeug.utils import secure_filename
from flask import url_for
import os

# Initialize SQLAlchemy object
Base = declarative_base()



# Function to get photo URL
def get_photo_url(filename):
    return url_for("static", filename=f"uploads/{filename}")



class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()], render_kw={"placeholder": "Enter your username"})
    password = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Enter your password"})
    submit = SubmitField('Login')  

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[
        DataRequired(),
        Length(min=3, max=20),
        Regexp(r'^[\w.-]+$', message="Username can only contain letters, numbers, dots, and underscores")
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8),
        Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$', message="Password must be at least 8 characters long, contain letters, numbers, and at least one symbol.")
    ])
    name = StringField('Name')
    address = StringField('Address')
    phone_number = StringField('Phone Number')
    email = StringField('Email')

    # Fields for the animal information
    animal_name = StringField('Animal Name')
    animal_type = StringField('Animal Type')
    animal_breed = StringField('Animal Breed')
    animal_color = StringField('Animal Color')
    animal_weight = IntegerField('Animal Weight')
    animal_temperament = StringField('Animal Temperament')
    animal_photo = FileField('Animal Photo', validators=[FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')])

    submit = SubmitField('Register')

    def validate(self):
        if self.password.data:
            self.password.data = generate_password_hash(self.password.data)  # Hash the password
        return super().validate()  # Call the parent class's validate method
    
    
# User Model
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)  # User ID
    name = db.Column(db.String(100), nullable=False)  # Name
    username = db.Column(db.String(50), unique=True, nullable=False)  # Username
    password = db.Column(db.String(60), nullable=False)  # Password
    address = db.Column(db.String(255))  # Address
    phone_number = db.Column(db.String(20))  # Phone number
    email = db.Column(db.String(30)) # Email
    animals = db.relationship('Animal', back_populates='user')


    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'address': self.address,
            'phone_number': self.phone_number,
            'email': self.email,
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
    
    password_hash = db.Column(db.String(128), nullable=False)

    @property
    def password(self):
        raise AttributeError('Password is not a readable attribute.')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
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
            'user_id': self.user_id  
        }

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='animals')

    def upload_photo(self, photo_file):
        if photo_file:
            filename = secure_filename(photo_file.filename)
            upload_folder = "static/uploads"
            os.makedirs(upload_folder, exist_ok=True) 
            photo_path = os.path.join(upload_folder, filename)
            photo_file.save(photo_path)
            self.photo = filename  # Save the filename or path in the database

    def __repr__(self):
        return f"Animal('{self.type}', '{self.breed}', '{self.color}')"
    


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
            'price': self.price 
        }

    def __repr__(self):
        return f"Service('{self.name}')"
    
# New association table for many-to-many relationship between Appointment and Service
appointment_services = db.Table('appointment_services',
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id')),
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'))
)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=False)
    staff = db.relationship('Staff', secondary='staff_appointments', backref='appointments')

    def serialize(self):
        return {
            'id': self.id,
            'date': str(self.date), 
            'time': str(self.time),  
            'user_id': self.user_id,
            'animal_id': self.animal_id,
            'service_id': self.service_id  
        }

    def __repr__(self):
        return f"Appointment('{self.id}')"

# Staff and Association Table
staff_appointments = db.Table('staff_appointments',
    db.Column('staff_id', db.Integer, db.ForeignKey('staffmembers.id'), primary_key=True),
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id'), primary_key=True)
)

class Staff(db.Model):
    __tablename__ = 'staffmembers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name 
        }    
