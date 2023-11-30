import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppointmentBooking = () => {
    const { isLoggedIn } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [userAnimals, setUserAnimals] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [errors, setErrors] = useState({
        selectedAnimal: '',
        selectedEmployee: '',
        selectedServices: '',
        date: '',
        time: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Function to add selected services to the cart
    const addToCart = () => {
        const itemsToAdd = selectedServices.map((serviceId) =>
        services.find((service) => service.id === parseInt(serviceId))
        );
        setCartItems(itemsToAdd);
    };

    // Function to calculate the total price of items in the cart
    const calculateTotal = () => {
        const total = cartItems.reduce((acc, curr) => acc + curr.price, 0);
        return total;
    };

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
        if (isLoggedIn) {
        // Fetch data when the user is logged in
        getUserAnimals();
        getAllEmployees();
        getAllServices();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <p>Please log in to book an appointment.</p>; // Render a message for non-logged-in users
    }

    // Function to validate form fields for date and time restrictions
    const validateDateTime = () => {
        const newErrors = { ...errors };
    
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        const minimumDateTime = new Date();
        minimumDateTime.setDate(now.getDate() + 1); 
    
        const dayOfWeek = selectedDateTime.getDay();
        const hours = selectedDateTime.getHours();
    
        if (selectedDateTime <= now) {
        newErrors.date = 'Appointment date should be in the future. If you need immediate assistance please contact (734) 643-0243';
        newErrors.time = 'Appointment time should be in the future. If you need immediate assistance please contact (734) 643-0243';
        } else if (selectedDateTime < minimumDateTime) {
        newErrors.date = 'Please select a date and time at least 24 hours in advance. If you need immediate assistance please contact (734) 643-0243';
        newErrors.time = 'Please select a time at least 24 hours in advance. If you need immediate assistance please contact (734) 643-0243';
        } else if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.date = 'Appointments are not available on weekends.';
        } else if (hours < 9 || hours >= 17) {
        newErrors.time = 'Appointments are only available between 9 am and 5 pm on weekdays.';
        } else {
        newErrors.date = '';
        newErrors.time = '';
        }
    
        setErrors(newErrors);
    
        return Object.values(newErrors).every((error) => error === '');
    };

    // Function to validate form fields
    const validateForm = () => {
        const newErrors = {};

        if (!selectedAnimal) {
        newErrors.selectedAnimal = 'Animal selection is required.';
        } else {
        newErrors.selectedAnimal = '';
        }

        if (!selectedEmployee) {
        newErrors.selectedEmployee = 'Employee selection is required.';
        } else {
        newErrors.selectedEmployee = '';
        }

        if (selectedServices.length === 0) {
        newErrors.selectedServices = 'At least one service must be selected.';
        } else {
        newErrors.selectedServices = '';
        }

        if (!date) {
        newErrors.date = 'Date is required.';
        } else {
        newErrors.date = '';
        }

        if (!time) {
        newErrors.time = 'Time is required.';
        } else {
        newErrors.time = '';
        }

        setErrors(newErrors);

        const isDateTimeValid = validateDateTime();
        return Object.values(newErrors).every((error) => error === '') && isDateTimeValid;
    };

    // Function to handle form submission and create an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form fields before submission
        const isFormValid = validateForm();

        if (!isFormValid) {
        return; // Stop submission if form is invalid
        }

        const appointmentData = {
        user_id: 4, 
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
            // Set success message and increase the timeout duration
            setSuccessMessage('Appointment Created! A representative will reach out via email 48 hours prior to the scheduled appointment.');
            setTimeout(() => {
            setSuccessMessage('');
            // Refresh the page after 5 seconds (5000 milliseconds)
            window.location.reload();
            }, 10000);
            // Clear form data after successful submission
            setSelectedAnimal('');
            setSelectedEmployee('');
            setSelectedServices([]);
            setDate('');
            setTime('');
            setCartItems([]);
        } else {
            console.error('Failed to create appointment');
            // Handle failure as needed
        }
        } catch (error) {
        console.error('Error occurred while creating appointment:', error);
        }
    };
    // Refresh the page on successful appointment creation
    useEffect(() => {
        if (successMessage) {
        // Refresh the page after 2 seconds to show the success message
        const timer = setTimeout(() => {
            window.location.reload();
        }, 2000);

        return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const successMessageStyle = {
        color: 'green',
        fontSize: '20px',
        margin: '20px 0',
    };

    const formStyle = {
        padding: '20px',
        backgroundColor: '#fff',
        color: '#000',
        textAlign: 'center',
    };

    const headerStyle = {
        marginBottom: '20px',
        color: '#ff00b5',
        fontSize: '24px',
    };

    const inputContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const inputStyle = {
        padding: '8px',
        margin: '8px 0', 
        borderRadius: '4px',
        border: '1px solid #000',
        width: '80%', 
        boxSizing: 'border-box',
    };

    const headerInputStyle = {
        color: '#ff00b5', 
    };

    const selectStyle = {
        padding: '8px',
        margin: '8px 0', 
        borderRadius: '4px',
        border: '1px solid #000',
        width: '80%', 
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        margin: '10px',
        padding: '8px 16px',
        backgroundColor: '#ff00b5',
        color: '#000',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div style={formStyle}>
        <h1 style={headerStyle}>Book an Appointment</h1>
        {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
            <div style={inputContainerStyle}>

            {/* Select Animal */}

            <div>
                <label style={headerInputStyle}>Select Animal:</label>
                <select
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
                style={selectStyle}
                >
                <option value="">Select Animal</option>
                {userAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                    {animal.name}
                </option>
                ))}
            </select>
                {errors.selectedAnimal && (
                <p style={{ color: 'red' }}>{errors.selectedAnimal}</p>
                )}
            </div>

            {/* Select Employee */}
            <div>
                <label style={headerInputStyle}>Select Employee:</label>
                <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={selectStyle}
                >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                    {employee.name}
                </option>
                ))}
            </select>
                {errors.selectedEmployee && (
                <p style={{ color: 'red' }}>{errors.selectedEmployee}</p>
                )}
            </div>

            {/* Select Services */}
            <div>
                <label style={headerInputStyle}>Select Services: (Mac = Command+Click / PC = Ctrl+Click)</label>
                <select
                multiple
                value={selectedServices}
                onChange={(e) =>
                    setSelectedServices(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                }
                style={selectStyle}
                >
                {services.map((service) => (
                <option key={service.id} value={service.id}>
                    {service.name}
                </option>
                ))}
            </select>
                {errors.selectedServices && (
                <p style={{ color: 'red' }}>{errors.selectedServices}</p>
                )}
            </div>

            {/* Date */}
            <div>
                <label style={headerInputStyle}>Date:</label>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
                />
                {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
                <label style={headerInputStyle}>Time:</label>
                <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={inputStyle}
                />
                {errors.time && <p style={{ color: 'red' }}>{errors.time}</p>}
            </div>
            </div>

            {/* Submit Button */}
            <button style={buttonStyle} type="submit">
            Create Appointment
            </button>
        </form>

        {/* Cart section */}
        <div>
            <h2>Appointment Calculator</h2>
            <button style={buttonStyle} onClick={addToCart}>Update Total</button>
            <ul>
            {cartItems.map((item) => (
                <li key={item.id}>
                {item.name} - ${item.price}
                </li>
            ))}
            </ul>
            <p>Appointment Total: ${calculateTotal()}</p>
        </div>
        </div>
    );
};

export default AppointmentBooking;
