from flask import Flask, jsonify, request, session, render_template
from models import User, Animal, Appointment, LoginForm, RegistrationForm, Service, Appointment, Staff
from config import db, create_app
from functools import wraps
from models import User, Animal, LoginForm, RegistrationForm
from config import db, create_app
import os
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash




app = create_app()

# Decorator to validate login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

# HOME ROUTE
@app.route('/')
def home():
    # Render home page template
    return jsonify({"message": "ROUTE IS GOOD!!!!"}) 



####################   USER-RELATED ROUTES    #########################


# Route to render the registration form (GET)
@app.route('/register', methods=['GET'])
def show_registration_form():
    return render_template('registration_form.html')

@app.route('/register', methods=['POST'])
def register_user():
    form = RegistrationForm(request.form)
    animal_photo_path = None  # Initialize animal_photo_path variable

    if form.validate():
        # Checking if the username already exists in the database
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            errors = {
                "username_error": "Username already exists. Please choose a different one."
            }
            return jsonify({"error": errors}), 400

        # Creating a new user
        new_user = User(
            username=form.username.data,
            name=form.name.data,
            address=form.address.data,
            phone_number=form.phone_number.data,
            email=form.email.data
        )
        new_user.password = form.password.data  # Assign password using property setter

        # Commit the new user to the database
        db.session.add(new_user)
        db.session.commit()

        # Handling file upload for animal photo
        # Handling file upload for animal photo
        if form.animal_photo.data:
            filename = secure_filename(form.animal_photo.data.filename)
            animal_photo_path = os.path.join("static/uploads", filename)
            form.animal_photo.data.save(animal_photo_path)

        # Creating a new animal associated with the registered user
        new_animal = Animal(
            name=form.animal_name.data,
            type=form.animal_type.data,
            breed=form.animal_breed.data,
            color=form.animal_color.data,
            weight=form.animal_weight.data,
            temperament=form.animal_temperament.data,
            user=new_user  # Linking the animal to the registered user
        )

            # Save the filename or path in the database
        new_animal.photo = animal_photo_path  # Save the file path, not just the filename



        # Commit the new animal to the database
        db.session.add(new_animal)
        db.session.commit()

        return jsonify({"message": "Registration Successful!"})
    else:
        errors = {
            "form_errors": form.errors  # Include form validation errors for reference
        }
        return jsonify({"error": errors}), 400

    

# Route to log in users
# Route to render the login form
@app.route('/login', methods=['GET'])
def show_login_form():
    return render_template('login.html')
@app.route('/login', methods=['POST'])
def login_user():
    # Get form data from the request
    form = LoginForm(request.form)

    # Check if the form data is valid
    if form.validate():
        # Retrieve the user based on the provided username
        user = User.query.filter_by(username=form.username.data).first()

        # Check if the user exists and if the password matches
        if user and check_password_hash(user.password, form.password.data):
            session['user_id'] = user.id

            # Log session information
            app.logger.info(f"Session after login: {session}")

            return jsonify({"message": "Login successful"})
        else:
            app.logger.error("Invalid username or password")
            return jsonify({"error": "Invalid username or password"})
    else:
        app.logger.error("Form validation failed")
        return jsonify({"error": form.errors})




# Route to log out users
@app.route('/logout', methods=['GET'])
@login_required
def logout_user():
    # Inside the logout route:
    if 'user_id' in session:
        print(session)  # Log session data before removal
        session.pop('user_id')  # Remove the user_id from the session
        print(session)  # Log session data after removal
        return jsonify({"message": "Logout successful"})
    else:
        return jsonify({"message": "User is not logged in"})


####################   ANIMAL-RELATED ROUTES    #########################


from flask import request, jsonify

@app.route('/user/<user_id>/add_animal', methods=['POST'])
@login_required
def add_animal_to_profile(user_id):
    animal_data = request.json  # Assuming JSON data sent in the request

    # Check if all required fields are present in the JSON data
    required_fields = ['type', 'weight', 'temperament']
    if all(field in animal_data for field in required_fields):
        # Retrieve the user by user_id
        user = User.query.get(user_id)
        if user:
            new_animal = Animal(
                type=animal_data['type'],
                breed=animal_data.get('breed'),
                color=animal_data.get('color'),
                weight=animal_data['weight'],
                temperament=animal_data['temperament'],
                user=user
            )

            # Save the new animal to the database
            db.session.add(new_animal)
            db.session.commit()

            return jsonify({"message": "Animal added successfully"})
        else:
            return jsonify({"error": "User not found"})
    else:
        return jsonify({"error": "Required fields missing in JSON data"})

@app.route('/user/<user_id>/edit_animal/<animal_id>', methods=['PUT'])
@login_required
def edit_animal_details(user_id, animal_id):
    # Get form data from the request
    # Assuming the form fields correspond to Animal model attributes
    animal_data = request.json  # JSON data sent in the request

    # Retrieve the user by user_id
    user = User.query.get(user_id)

    if user:
        # Retrieve the animal by animal_id associated with the user
        animal = Animal.query.filter_by(id=animal_id, user_id=user_id).first()

        if animal:
            # Update the animal details
            animal.type = animal_data.get('type', animal.type)
            animal.breed = animal_data.get('breed', animal.breed)
            animal.color = animal_data.get('color', animal.color)
            animal.weight = animal_data.get('weight', animal.weight)
            animal.temperament = animal_data.get('temperament', animal.temperament)

            # Commit changes to the database
            db.session.commit()
            return jsonify({"message": "Animal details updated successfully"})
        else:
            return jsonify({"error": "Animal not found for the user"})
    else:
        return jsonify({"error": "User not found"})

@app.route('/user/<user_id>/delete_animal/<animal_id>', methods=['DELETE'])
@login_required
def delete_animal(user_id, animal_id):
    # Retrieve the user by user_id
    user = User.query.get(user_id)

    if user:
        # Retrieve the animal by animal_id associated with the user
        animal = Animal.query.filter_by(id=animal_id, user_id=user_id).first()

        if animal:
            # Delete the animal from the database
            db.session.delete(animal)
            db.session.commit()
            return jsonify({"message": "Animal deleted successfully"})
        else:
            return jsonify({"error": "Animal not found for the user"})
    else:
        return jsonify({"error": "User not found"})

####################   APPOINTMENT-RELATED ROUTES    #########################

@app.route('/user/<user_id>/book_appointment', methods=['POST'])
@login_required
def book_appointment(user_id):
    appointment_data = request.json  # JSON data sent in the request

    # Retrieve the user by user_id
    user = User.query.get(user_id)

    if user:
        # Retrieve required data from the request
        animal_id = appointment_data.get('animal_id')
        date = appointment_data.get('date')
        time = appointment_data.get('time')
        staff_id = appointment_data.get('staff_id')
        service_ids = appointment_data.get('service_ids')

        # Retrieve the animal associated with the user
        animal = Animal.query.filter_by(id=animal_id, user_id=user_id).first()

        if animal:
            # Retrieve the staff member
            staff_member = Staff.query.get(staff_id)

            if staff_member:
                # Retrieve the services
                services = Service.query.filter(Service.id.in_(service_ids)).all()

                if services:
                    # Create a new Appointment instance
                    new_appointment = Appointment(
                        date=date,
                        time=time,
                        user=user,
                        animal=animal,
                        staff=[staff_member],  # Assign the staff member to the appointment
                        services=services  # Assign the selected services to the appointment
                    )

                    # Save the new appointment to the database
                    db.session.add(new_appointment)
                    db.session.commit()

                    return jsonify({"message": "Appointment booked successfully"})
                else:
                    return jsonify({"error": "Services not found"})
            else:
                return jsonify({"error": "Staff member not found"})
        else:
            return jsonify({"error": "Animal not found for the user"})
    else:
        return jsonify({"error": "User not found"})

@app.route('/cancel_appointment/<appointment_id>', methods=['DELETE'])
@login_required
def cancel_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)

    if appointment:
        # Delete the appointment from the database
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({"message": "Appointment cancelled successfully"})
    else:
        return jsonify({"error": "Appointment not found"})
    

####################   USER PROFILE-RELATED ROUTES    #########################     

@app.route('/user/<user_id>/profile', methods=['GET'])
@login_required
def view_user_profile(user_id):
    user = User.query.get(user_id)

    if user:
        # Serialize user data or create a dictionary with required user details
        user_data = {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'address': user.address,
            'phone_number': user.phone_number,
            # Add more fields as needed
        }

        return jsonify(user_data)
    else:
        return jsonify({"error": "User not found"})
    

@app.route('/user/<user_id>/change_username', methods=['PUT'])
@login_required
def change_username(user_id):
    user = User.query.get(user_id)

    if user:
        new_username = request.json.get('new_username')  # Assuming the new username is sent in the request body

        if new_username:
            user.username = new_username
            db.session.commit()
            return jsonify({"message": "Username changed successfully"})
        else:
            return jsonify({"error": "New username not provided"})
    else:
        return jsonify({"error": "User not found"})

@app.route('/user/<user_id>/change_password', methods=['PUT'])
@login_required
def change_password(user_id):
    user = User.query.get(user_id)

    if user:
        current_password = request.json.get('current_password')
        new_password = request.json.get('new_password')

        if current_password and new_password:
            if user.password == current_password:
                user.password = new_password
                db.session.commit()
                return jsonify({"message": "Password changed successfully"})
            else:
                return jsonify({"error": "Current password is incorrect"})
        else:
            return jsonify({"error": "Current or new password not provided"})
    else:
        return jsonify({"error": "User not found"})


if __name__ == '__main__':
    app.run(debug=True, port=8080)

