
from flask import request, jsonify, request, session
from flask_restful import Resource
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import logging
from datetime import datetime




from config import app, db, api



from models import User, Animal, Appointment, Service, Employee



# Route to create a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json

    # Ensure all required fields are present in the request
    required_fields = ['name', 'username', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400

    # Check if the username already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Hash the password before storing it in the database
    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        name=data['name'],
        username=data['username'],
        password=hashed_password,
        address=data.get('address'),
        phone_number=data.get('phone_number'),
        email=data.get('email')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        # User authenticated, create a session
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/change_password', methods=['PATCH'])
def change_password():
    data = request.json

    # Check if the user is logged in
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    user_id = session['user_id']
    user = User.query.get(user_id)

    # Check if the user exists
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Ensure all required fields are present in the request
    required_fields = ['old_password', 'new_password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400

    old_password = data['old_password']
    new_password = data['new_password']

    # Check if the old password provided matches the user's current password
    if not check_password_hash(user.password, old_password):
        return jsonify({'message': 'Incorrect old password'}), 400

    # Hash the new password before updating it in the database
    hashed_new_password = generate_password_hash(new_password, method='sha256')

    # Update user's password
    user.password = hashed_new_password
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200        

@app.route('/user_info', methods=['GET'])
def get_user_info():
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        if user:
            user_info = {
                'id': user.id,
                'name': user.name,
                'username': user.username,
                'address': user.address,
                'phone_number': user.phone_number,
                'email': user.email,
            }
            return jsonify(user_info), 200
    return jsonify({'message': 'Unauthorized'}), 401

@app.route('/user_animals', methods=['GET'])
def get_user_animals():
    if 'user_id' in session:
        user_id = session['user_id']
        animals = Animal.query.filter_by(user_id=user_id).all()
        animal_list = []
        for animal in animals:
            animal_info = {
                'id': animal.id,
                'name': animal.name,
                'type': animal.type,
                'breed': animal.breed,
                'weight': animal.weight,
                'temperament': animal.temperament,
                'user_id': animal.user_id  # Include the user_id associated with the animal
                # Add other animal details if needed
            }
            animal_list.append(animal_info)
        return jsonify(animal_list), 200
    return jsonify({'message': 'Unauthorized'}), 401   

@app.route('/employees', methods=['GET'])
def get_all_employees():
    employees = Employee.query.all()
    employee_list = []
    for employee in employees:
        employee_info = {
            'id': employee.id,
            'name': employee.name,
            # Add other employee details if needed
        }
        employee_list.append(employee_info)
    return jsonify(employee_list), 200

# Route to get all services
@app.route('/services', methods=['GET'])
def get_all_services():
    services = Service.query.all()
    service_list = []
    for service in services:
        service_info = {
            'id': service.id,
            'name': service.name,
            'description': service.description,
            'price': service.price,
        }
        service_list.append(service_info)
    return jsonify(service_list), 200

@app.route('/create_appointment', methods=['POST'])
def create_appointment():
    # Get data from the request sent by the frontend
    appointment_data = request.json  # Assuming the data is sent in JSON format

    # Extract necessary information from the appointment data
    user_id = appointment_data.get('user_id')
    animal_id = appointment_data.get('animal_id')
    service_ids = appointment_data.get('service_ids', [])  # Assuming multiple services can be selected
    employee_ids = appointment_data.get('employee_ids', [])  # Assuming multiple employees can be selected

    # Parse date and time strings to Python date and time objects
    date_str = appointment_data.get('date')
    time_str = appointment_data.get('time')
    date_object = datetime.strptime(date_str, '%Y-%m-%d').date()
    time_object = datetime.strptime(time_str, '%H:%M').time()

    # Retrieve user, animal, employees, and services from the database
    user = User.query.get(user_id)
    animal = Animal.query.get(animal_id)
    services = Service.query.filter(Service.id.in_(service_ids)).all()
    employees = Employee.query.filter(Employee.id.in_(employee_ids)).all()

    if user and animal and services and employees:
        # Create an appointment instance
        appointment = Appointment(
            date=date_object,
            time=time_object,
            animal=animal,
            employees=employees,
            services=services
        )

        # Add the appointment to the session and commit changes to the database
        db.session.add(appointment)
        db.session.commit()

        return jsonify({'message': 'Appointment created successfully'}), 201
    else:
        return jsonify({'message': 'Failed to create appointment. Invalid data provided.'}), 400


#User Add New Animal
@app.route('/users/<int:user_id>/animals', methods=['POST'])
def add_animal(user_id):
    data = request.json

    # Check if the user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Create a new animal associated with the user
    new_animal = Animal(
        name=data.get('name'),
        type=data.get('type'),
        breed=data.get('breed'),
        weight=data.get('weight'),
        temperament=data.get('temperament'),
        user_id=user_id
    )

    db.session.add(new_animal)
    db.session.commit()

    return jsonify({'message': 'Animal added successfully'}), 201



# Route to delete an animal
@app.route('/users/<int:user_id>/animals/<int:animal_id>', methods=['DELETE'])
def delete_animal(user_id, animal_id):
    # Check if the user and animal exist
    user = User.query.get(user_id)
    animal = Animal.query.filter_by(id=animal_id, user_id=user_id).first()
    if not user or not animal:
        return jsonify({'message': 'User or animal not found'}), 404

    # Delete the animal
    db.session.delete(animal)
    db.session.commit()

    return jsonify({'message': 'Animal deleted successfully'}), 200



# Route to edit an animal's details
# @app.route('/users/<int:user_id>/animals/<int:animal_id>', methods=['PUT'])
# def edit_animal(user_id, animal_id):
#     data = request.json

#     # Check if the user and animal exist
#     user = User.query.get(user_id)
#     animal = Animal.query.filter_by(id=animal_id, user_id=user_id).first()
#     if not user or not animal:
#         return jsonify({'message': 'User or animal not found'}), 404

#     # Update the animal's details
#     animal.name = data.get('name', animal.name)
#     animal.type = data.get('type', animal.type)
#     animal.breed = data.get('breed', animal.breed)
#     animal.weight = data.get('weight', animal.weight)
#     animal.temperament = data.get('temperament', animal.temperament)

#     db.session.commit()

#     return jsonify({'message': 'Animal updated successfully'}), 200

# Route to get all appointments with related information
@app.route('/appointments', methods=['GET'])
def get_appointments():
    try:
        # Query all appointments with their associated data using relationships
        appointments = Appointment.query.all()

        # Return the serialized appointments as JSON response
        return jsonify({'appointments': appointments}), 200


    except Exception as e:
        # Handle exceptions or errors
        return jsonify({'message': 'Failed to fetch appointments', 'error': str(e)}), 500


# Route for user logout
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)