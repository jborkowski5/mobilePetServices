import React, { useState, useEffect } from 'react';


const Employees = () => {
    const [employees, setEmployees] = useState([]);


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/employees');
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                    console.log(data);
                } else {
                    console.error('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error occurred while fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>Employees</h2>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>
                        <h3>{employee.name}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Employees;
