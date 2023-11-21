from config import db
from app import app
from models import Service, Employee, User, Animal, Appointment, employee_appointments, appointment_services
import random
from datetime import datetime, timedelta

# Function to seed services
def seed_services():
    # Check if services already exist
    existing_services = Service.query.all()
    if existing_services:
        print("Services already exist in the database. Skipping seeding.")
        return

    # Sample service data
    service_data = [
        {
            'name': 'Nail Trim',
            'description': 'Using animal nail trimmers to cut back overgrown nails with a blunt cut.',
            'duration': 30,  # Duration in minutes
            'price': 25.00
        },
        {
            'name': 'Nail Dremel',
            'description': 'First we trim the nails back, then smooth and soften the edges with a sanding dremel.',
            'duration': 30,
            'price': 35.00
        },
        {
            'name': 'Ear Cleaning',
            'description': 'Using OTC ear cleaner, cotton swabs and gauze, we deep clean all the existing debris out of each ear.',
            'duration': 30,
            'price': 20.00
        },
        {
            'name': 'Ear Plucking',
            'description': 'This is the removal of overgrown hair that is rooted in the ear canal. We use a pet friendly ear powder that helps soothe and numb the area topically. Then we remove the hair using our ear hair removers.',
            'duration': 30,
            'price': 25.00
        },
        {
            'name': 'Anal Gland Expression',
            'description': 'Emptying the glands located at the rear end of the animal. This helps prevent infection and abscess. Signs that this may be needed are scooting, hunching over, licking rear and also a lingering pungent smell.',
            'duration': 30,
            'price': 35.00
        },
        {
            'name': 'Sanitary Trim',
            'description': 'Available for any pet who has longer hair that seems to get dirty in the backend. We will use clippers and shave around the rump and or private area to help them keep clean.',
            'duration': 30,
            'price': 25.00
        },
        {
            'name': 'Paw Pad Trim',
            'description': 'Available for any pet who has longer hair that seems to get dirty in the backend. We will use clippers and shave around the rump and or private area to help them keep clean.',
            'duration': 30,
            'price': 20.00
        },
        {
            'name': 'Face/Eye Area Trim',
            'description': 'Using scissors and clippers to clear up overgrown hair over the muzzle and eye area. We also clean any debris around these areas at service.',
            'duration': 30,
            'price': 25.00
        },
        {
            'name': 'Eye Area Cleaning',
            'description': 'No trimming performed. Usually provided for pets who have chronic weeping eyes, or KCS (dry eye) but it can be beneficial in any animal with debris growth/staining around the eyes.',
            'duration': 30,  # Please add the duration in minutes if available
            'price': 15.00
        },
        {
            'name': 'Medication Administration',
            'description': 'Pricing can vary, Medication Administration Waiver required: Used in situations where the owner may be out of town (multiple visits to home per day) or even having a tough time giving a newly prescribed medication. Can be useful for animals with diabetes or have a need for subcutaneous fluid therapy. We are trained and able to work along with babysitters in these situations. All medications and treatment plans are provided by your RDVM.',
            'duration': 30,  # Please add the duration in minutes if available
            'price': 30.00
        },
        {
            'name': 'De-Matting',
            'description': 'Pricing may vary: Using clippers/scissors/brushes etc. We do what we can to help de-mat or even de-bulk little to heavily matted fur. In some situations further medical intervention (RDVM) may be suggested depending on how severe the situation is (lesions/open wounds).',
            'duration': 30,  # Please add the duration in minutes if available
            'price': 40.00
        },
        {
            'name': 'Client Education/Training',
            'description': "Pricing may vary: Sometimes we have a pet that needs medication and/or treatments at home. Many times it's hard to get started on your own. If you have a pet with a condition (diabetes/chronic kidney disease etc) or even just a pet that has a medication prescribed and you need an in home consult to help regulate or understand how to give it. We can come over and help you understand and learn how to give the medication or treatments and give you a sense of confidence.",
            'duration': 30,  # Please add the duration in minutes if available
            'price': 50.00
        },
        {
            'name': 'Additional Technician for Service Visit',
            'description': "Another technician that comes to help with services desired. This may be useful if the owner/family member of the pet is unable to help give treats/help hold/distract the pet for services to be completed. *Mostly used in situations where the owner/family member is elderly/disabled OR pet moves uncontrollably or reactive to touch/anxious.",
            'duration': 30,  # Please add the duration in minutes if available
            'price': 20.00
        },
        {
            'name': 'Pocket-Pet Nail Trim',
            'description': "Can be done on any Micro pocket pet with nails. Guinea Pigs, Birds, Rabbits etc.",
            'duration': 30,  # Please add the duration in minutes if available
            'price': 20.00
        },
        {
            'name': 'Savings Bundle: Nail Trim and Gland Expression',
            'description': "A blunt cut of the nails and expression of the anal glands.",
            'duration': 60,  # Please add the duration in minutes if available
            'price': 50.00
        },
        {
            'name': 'Savings bundle: Nail Trim and Ear cleaning',
            'description': "Blunt cut of the nails and deep cleaning of the ears, freeing them of debris.",
            'duration': 60,  # Please add the duration in minutes if available
            'price': 40.00
        },
        {
            'name': 'SAVINGS BUNDLE: Feet/Face/Fanny',
            'description': "Need a touch up in between your grooming appointments? We can shave the paw pads and free them of fur that grows among the toes that causes slipping. We also will trim the face fur around the eyes and wipe any eye debris clean. Then we will clean up the rear end to help prevent any bathroom leftovers from over staying their welcome!",
            'duration': 60,  # Please add the duration in minutes if available
            'price': 55.00
        }
    ]

    # Create Service instances and add them to the database session
    for data in service_data:
        service = Service(
            name=data['name'],
            description=data['description'],
            duration=data['duration'],
            price=data['price']
        )
        db.session.add(service)

    # Commit the changes to the database
    db.session.commit()
    print("Services seeded successfully.")

# Function to seed employees
def seed_employees():
    # Check if employees already exist
    existing_employees = Employee.query.all()
    if existing_employees:
        print("Employees already exist in the database. Skipping seeding.")
        return

    # Sample employee data
    employee_data = [
        {'name': 'Colleen Kropog'},
        {'name': 'Mallory Gemus'},
        {'name': 'Molly Tokarz'},
        {'name': 'Louise Barton'},
        {'name': 'Brandy Brettschneider'},
    ]

    # Create Employee instances and add them to the database session
    for data in employee_data:
        employee = Employee(name=data['name'])
        db.session.add(employee)

    # Commit the changes to the database
    db.session.commit()
    print("Employees seeded successfully.")

def seed_users():
    # Check if users already exist
    existing_users = User.query.all()
    if existing_users:
        print("Users already exist in the database. Skipping seeding.")
        return

    # Sample user data
    user_data = [
        {'name': 'Alice', 'username': 'alice123', 'password': 'password', 'address': '123 Main St', 'phone_number': '555-1234', 'email': 'alice@example.com'},
        {'name': 'Bob', 'username': 'bob456', 'password': 'password', 'address': '456 Elm St', 'phone_number': '555-5678', 'email': 'bob@example.com'},
        # Add more sample users as needed
    ]

    # Create User instances and add them to the database session
    for data in user_data:
        user = User(**data)
        db.session.add(user)

    # Commit the changes to the database
    db.session.commit()
    print("Users seeded successfully.")

def seed_animals():
    # Check if animals already exist
    existing_animals = Animal.query.all()
    if existing_animals:
        print("Animals already exist in the database. Skipping seeding.")
        return

    # Sample animal data
    animal_data = [
        {'name': 'Fluffy', 'type': 'Cat', 'breed': 'Persian', 'weight': 5, 'temperament': 'Calm'},
        {'name': 'Rex', 'type': 'Dog', 'breed': 'Golden Retriever', 'weight': 25, 'temperament': 'Friendly'},
        # Add more sample animals as needed
    ]

    # Assign each animal to a random user
    users = User.query.all()

    # Create Animal instances and add them to the database session
    for data in animal_data:
        random_user = random.choice(users)
        animal = Animal(**data, user=random_user)
        db.session.add(animal)

    # Commit the changes to the database
    db.session.commit()
    print("Animals seeded successfully.")


def seed_appointments():
    # Check if appointments already exist
    existing_appointments = Appointment.query.all()
    if existing_appointments:
        print("Appointments already exist in the database. Skipping seeding.")
        return

    # Sample appointment data
    current_datetime = datetime.now()
    appointment_data = [
        {'date': current_datetime.date(), 'time': (current_datetime + timedelta(hours=random.randint(1, 10))).time()},
        {'date': (current_datetime + timedelta(days=1)).date(), 'time': (current_datetime + timedelta(hours=random.randint(1, 10))).time()},
        # Add more sample appointments as needed
    ]

    # Create and add appointments
    for data in appointment_data:
        appointment = Appointment(date=data['date'], time=data['time'])
        db.session.add(appointment)

    db.session.commit()
    print("Appointments seeded successfully.")



# Function to seed appointment_services table
def seed_appointment_services():
    # Check if appointment_services data already exist
    existing_data = db.session.query(appointment_services).all()
    if existing_data:
        print("Appointment services data already exist in the database. Skipping seeding.")
        return

    # Sample appointment_services data with multiple services for appointments
    data_to_insert = [
        {'appointment_id': 1, 'service_ids': [1, 2, 3]},  # Appointment 1 with services 1, 2, 3
        {'appointment_id': 2, 'service_ids': [3, 4]},     # Appointment 2 with services 3, 4
        # Add more data as needed
    ]

    # Add data using insert() and execute() methods for multiple services per appointment
    for data in data_to_insert:
        appointment_id = data['appointment_id']
        service_ids = data['service_ids']

        for service_id in service_ids:
            stmt = appointment_services.insert().values(appointment_id=appointment_id, service_id=service_id)
            db.session.execute(stmt)

    # Commit the changes to the database
    db.session.commit()
    print("Appointment services seeded successfully with multiple services for appointments.")


# Function to seed employee_appointments table
def seed_employee_appointments():
    # Check if employee_appointments data already exist
    existing_data = db.session.query(employee_appointments).all()
    if existing_data:
        print("Employee appointments data already exist in the database. Skipping seeding.")
        return

    # Sample employee_appointments data
    data_to_insert = [
        {'employee_id': 1, 'appointment_id': 1},
        {'employee_id': 2, 'appointment_id': 2},
        # Add more data as needed
    ]

    # Add data using insert() and execute() methods
    for data in data_to_insert:
        stmt = employee_appointments.insert().values(employee_id=data['employee_id'], appointment_id=data['appointment_id'])
        db.session.execute(stmt)

    # Commit the changes to the database
    db.session.commit()
    print("Employee appointments seeded successfully.")


# Inside the if __name__ == '__main__': block, add these functions
if __name__ == '__main__':
    with app.app_context():
        seed_users()
        seed_animals()
        seed_appointments()
        seed_services()
        seed_employees()
        seed_appointment_services()  # Add this line to seed appointment_services table
        seed_employee_appointments()  # Add this line to seed employee_appointments table
