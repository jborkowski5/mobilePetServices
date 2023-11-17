#helpers.py
from datetime import datetime

def is_available(schedule, date, time):
    # Check if the given date and time are available in the schedule
    for slot in schedule:
        slot_date = datetime.strptime(slot['date'], '%Y-%m-%d').date()
        slot_time = datetime.strptime(slot['time'], '%H:%M').time()

        if slot_date == date and slot_time == time:
            return False  # Slot is already booked

    return True  # Slot is available

def update_schedule(schedule, date, time):
    # Update the schedule by removing the booked time slot
    updated_schedule = []

    for slot in schedule:
        slot_date = datetime.strptime(slot['date'], '%Y-%m-%d').date()
        slot_time = datetime.strptime(slot['time'], '%H:%M').time()

        # Check if the slot matches the booked time to be removed
        if slot_date == date and slot_time == time:
            continue  # Skip this slot (remove it)
        
        updated_schedule.append(slot)

    return updated_schedule