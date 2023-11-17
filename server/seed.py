#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Staff, Animal

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Create users
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                password='somehashedpassword',
                name=fake.name(),
                address=fake.address(),
                phone_number=fake.phone_number()
            )
            db.session.add(user)

        # Create staff members
        staff_names = ['John', 'Emma', 'Alex', 'Sophia', 'Daniel']
        for name in staff_names:
            staff = Staff(name=name)
            db.session.add(staff)

        # Create animals associated with users
        users = User.query.all()
        animal_types = ['Dog', 'Cat', 'Rabbit', 'Bird']
        for user in users:
            animal = Animal(
                type=rc(animal_types),
                breed=fake.word(),
                color=fake.color_name(),
                weight=randint(1, 50),
                temperament=fake.word(),
                photo='default.jpg',  # You may want to adjust this based on your file storage logic
                name=fake.first_name(),
                user_id=user.id
            )
            db.session.add(animal)

        # Commit changes to the database
        db.session.commit()
        print("Seed completed!")
