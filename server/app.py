# Import necessary modules
from flask import jsonify, flash, request, Flask, render_template, redirect, url_for
from flask_login import login_user, LoginManager, login_required, current_user, logout_user
from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, PasswordField, SubmitField
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_wtf.file import FileField, FileAllowed
from wtforms.validators import DataRequired
from flask_wtf.csrf import CSRFProtect, generate_csrf
from config import db, create_app
# Import from other files
from models import User, Animal, Appointment, Service, Employee  # Importing the database models
from helpers import is_available, update_schedule  # Helper functions

app = create_app()  # Create the Flask app from config.py
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(int(user_id))
    print(f"Loading user: {user}")
    return user

class RegistrationForm(FlaskForm):
    username = StringField('Username')
    password = PasswordField('Password')
    name = StringField('Name')
    address = StringField('Address')
    phone_number = StringField('Phone Number')

    # Fields for the animal information
    animal_name = StringField('Animal Name')
    animal_type = StringField('Animal Type')
    animal_breed = StringField('Animal Breed')
    animal_color = StringField('Animal Color')
    animal_weight = IntegerField('Animal Weight')
    animal_temperament = StringField('Animal Temperament')
    animal_photo = FileField('Animal Photo', validators=[FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')])
    animal_name = StringField('Animal Name')

    def validate_animal_photo(self, field):
        if field.data:
            field.data.filename = secure_filename(field.data.filename)
    submit = SubmitField('Register')

# Flask Routes
@app.route('/')
def home():
    # Render home page template
    return render_template('home.html')  


@app.route('/csrf_token', methods=['GET'])
def get_csrf_token():
    csrf_token = generate_csrf()
    return jsonify({'csrf_token': csrf_token}), 200


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Check if the username is already taken
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            flash('Username is already taken. Please choose a different one.', 'danger')
            return redirect(url_for('register'))

        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256', salt_length=8)
        new_user = User(username=form.username.data, password=hashed_password, name=form.name.data, address=form.address.data, phone_number=form.phone_number.data)

        new_animal = Animal(
            type=form.animal_type.data,
            breed=form.animal_breed.data,
            color=form.animal_color.data,
            weight=form.animal_weight.data,
            temperament=form.animal_temperament.data,
            name=form.animal_name.data,
            user=new_user
        )

        new_animal.upload_photo(request.files.get('animal_photo'))

        db.session.add(new_user)
        db.session.add(new_animal)
        db.session.commit()

        login_user(new_user)  # Log in the new user

        flash(f"User {new_user.username} registered and logged in successfully", 'success')
        return redirect(url_for('profile'))

    flash("Form validation failed", 'danger')
    return render_template('register.html', form=form)


    
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()], render_kw={"placeholder": "Enter your username"})
    password = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Enter your password"})
    submit = SubmitField('Login')   
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            app.logger.info(f"User {user.username} logged in successfully")  # Log successful login
            return jsonify({"message": "Login successful"}), 200
        else:
            app.logger.error("Unsuccessful login attempt - Invalid username or password")  # Log unsuccessful login
            return jsonify({"error": "Invalid username or password"}), 401

    return render_template('login.html', form=form)



@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))   

@app.route('/profile')
@login_required
def profile():
    print(f"Current User: {current_user}")  # Add this line for debugging
    return render_template('profile.html', user=current_user)


@app.route('/appointments', methods=['POST'])
@login_required
def schedule_appointment():
    # Parse request data and create a new appointment
    data = request.get_json()
    service_id = data.get('service_id')
    date = data.get('date')
    time = data.get('time')
    owner_id = data.get('owner_id')  # Assuming you receive the owner_id in the request

    # Validate input and check availability
    service = Service.query.get_or_404(service_id)
    appointment_date = datetime.strptime(date, '%Y-%m-%d').date()
    appointment_time = datetime.strptime(time, '%H:%M').time()

    # Check availability against the owner's schedule
    user = User.query.get_or_404(user_id)
    if not is_available(user.availability_schedule, appointment_date, appointment_time):
        return jsonify({"error": "The selected time is not available."}), 400

    # Create appointment and update schedule
    appointment = Appointment(
        service_id=service_id,
        user_id=current_user.id,
        date=appointment_date,
        time=appointment_time,
        owner_id=owner_id
    )

    # Update owner's schedule
    updated_schedule = update_schedule(owner.availability_schedule, appointment_date, appointment_time)
    owner.availability_schedule = updated_schedule

    db.session.add(appointment)
    db.session.commit()

    return jsonify({"message": "Appointment scheduled successfully"})


@app.route('/appointments', methods=['GET'])
@login_required
def get_user_appointments():
    appointments = Appointment.query.filter_by(user_id=current_user.id).all()
    return jsonify([appointment.serialize() for appointment in appointments])


@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.serialize() for service in services])

@app.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get_or_404(service_id)
    return jsonify(service.serialize())


@app.route('/storefront', methods=['GET'])
@login_required
def storefront():
    services = Service.query.all()
    return render_template('storefront.html', services=services)


if __name__ == '__main__':
    app.run(debug=True)

