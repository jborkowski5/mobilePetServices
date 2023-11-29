import React from 'react';

const AppointmentSummary = ({ appointmentDetails }) => {
  const { userName, animalName, employeeName, services, date, time } = appointmentDetails;

  return (
    <div className="appointment-summary">
      <h2>Appointment Summary</h2>
      <p>User Name: {userName}</p>
      <p>Animal: {animalName}</p>
      <p>Employee: {employeeName}</p>
      <p>Services:</p>
      <ul>
        {services.map((service, index) => (
          <li key={index}>{service.name}</li>
        ))}
      </ul>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
    </div>
  );
};

export default AppointmentSummary;
