import React, { useState, useEffect } from 'react';


const AppointmentBooking = () => {
    const [userAnimals, setUserAnimals] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Function to fetch user animals
    const getUserAnimals = async () => {
        try {
        const response = await fetch('/user_animals');
        if (response.ok) {
            const userAnimalsData = await response.json();
            setUserAnimals(userAnimalsData);
        } else {
            console.error('Failed to fetch user animals');
        }
        } catch (error) {
        console.error('Error occurred while fetching user animals:', error);
        }
    };

    // Function to fetch all employees
    const getAllEmployees = async () => {
        try {
        const response = await fetch('/employees');
        if (response.ok) {
            const employeesData = await response.json();
            setEmployees(employeesData);
        } else {
            console.error('Failed to fetch employees');
        }
        } catch (error) {
        console.error('Error occurred while fetching employees:', error);
        }
    };

    // Function to fetch all services
    const getAllServices = async () => {
        try {
        const response = await fetch('/services');
        if (response.ok) {
            const servicesData = await response.json();
            setServices(servicesData);
        } else {
            console.error('Failed to fetch services');
        }
        } catch (error) {
        console.error('Error occurred while fetching services:', error);
        }
    };

    useEffect(() => {
        getUserAnimals();
        getAllEmployees();
        getAllServices();
    }, []);

    // Function to handle form submission and create an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        const appointmentData = {
        user_id: 4, // Replace with actual user ID
        animal_id: selectedAnimal,
        service_ids: selectedServices,
        employee_ids: [selectedEmployee],
        date,
        time,
        };

        // Create an appointment with the provided data
        try {
        const response = await fetch('/create_appointment', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Appointment created:', result);
            // Handle success as needed
        } else {
            console.error('Failed to create appointment');
            // Handle failure as needed
        }
        } catch (error) {
        console.error('Error occurred while creating appointment:', error);
        }
    };

    return (
        <div>
        <h1>Book an Appointment</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Select Animal:</label>
            <select onChange={(e) => setSelectedAnimal(e.target.value)}>
                <option value="">Select Animal</option>
                {userAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                    {animal.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label>Select Employee:</label>
            <select onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                    {employee.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label>Select Services:</label>
            <select
                multiple
                onChange={(e) =>
                setSelectedServices(Array.from(e.target.selectedOptions, (option) => option.value))
                }
            >
                {services.map((service) => (
                <option key={service.id} value={service.id}>
                    {service.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
            <label>Time:</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <button type="submit">Create Appointment</button>
        </form>
        </div>
    );
    };

export default AppointmentBooking;
