from app import create_app, db
from models import User, Animal, Service, Appointment, Staff, staff_appointments
from faker import Faker
from datetime import datetime, time

fake = Faker()

if __name__ == '__main__':
    app = create_app()

    with app.app_context():
        print("Starting seed...")

        # Clear existing data (if needed)
        db.session.query(User).delete()
        db.session.query(Animal).delete()
        db.session.query(Service).delete()
        db.session.query(Appointment).delete()
        db.session.query(Staff).delete()
        db.session.query(staff_appointments).delete()

        # Create sample users
        users = [
            User(username='user1', password='password1', name='Alice', address='123 Main St', phone_number='123-456-7890'),
            User(username='user2', password='password2', name='Bob', address='456 Elm St', phone_number='234-567-8901'),
            # Add more users as needed
        ]
        db.session.add_all(users)
        db.session.commit()

        # Create sample animals
        animals = [
            Animal(type='Dog', breed='Labrador', color='Black', weight=25, temperament='Friendly', name='Max', user_id=1),
            Animal(type='Cat', breed='Siamese', color='White', weight=15, temperament='Playful', name='Whiskers', user_id=2),
            # Add more animals as needed
        ]
        db.session.add_all(animals)
        db.session.commit()

        # Create sample services
        services = [
            Service(name='Grooming', description='Pet grooming service', duration=60, price=50.0),
            Service(name='Training', description='Pet training service', duration=45, price=70.0),
            # Add more services as needed
        ]
        db.session.add_all(services)
        db.session.commit()

        # Create sample appointments
        appointments = [
            Appointment(date=datetime.strptime('2023-11-15', '%Y-%m-%d').date(), time=time(hour=10), user_id=1, animal_id=1, service_id=1),
            Appointment(date=datetime.strptime('2023-11-16', '%Y-%m-%d').date(), time=time(hour=11, minute=30), user_id=2, animal_id=2, service_id=2),
            # Ensure to associate appointments with existing animals by specifying their animal_id
            # Add more appointments as needed
        ]
        db.session.add_all(appointments)
        db.session.commit()


        # Create sample staff members
        staff = [
            Staff(name='John Doe'),
            Staff(name='Jane Smith'),
            # Add more staff members as needed
        ]
        db.session.add_all(staff)
        db.session.commit()

        # Create sample associations between staff and appointments
        staff_appointments_data = [
            {'staff_id': 1, 'appointment_id': 1},
            {'staff_id': 2, 'appointment_id': 2},
            # Add more associations as needed
        ]
        for association in staff_appointments_data:
            db.session.execute(staff_appointments.insert().values(association))
        db.session.commit()

        print("Seed completed successfully!")
