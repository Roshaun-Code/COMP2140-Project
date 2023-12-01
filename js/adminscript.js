document.addEventListener("DOMContentLoaded", () => {
    let count = 0;

    // Define sample appointment data
    const appointments = [
        { id: 1, date: '2023-12-05', time: '10:00 AM', description: 'Details...' }
        // Add more appointments as needed
    ];
    
    // Function to generate appointment HTML
    function generateAppointmentHTML(appointment) {
        count += 1;
        return `
            <div class="card">
                <div class="card-content">
                    <h3>Appointment #${count}</h3>
                    <p>Date: ${appointment.date}</p>
                    <p>Time: ${appointment.time}</p>
                    <p>Description: ${appointment.description}</p>
                </div>
                <div class="icons">
                    <img id="reschedule" class="card-icons" src="./icons/bookmark-multiple-outline.svg">
                    <img id="trash" class="card-icons" src="./icons/trash-can-outline.svg">
                </div>
            </div>
            
        `;
    }
    
    // Function to display appointments
    function displayAppointments() {
        const cards = document.querySelector(".cards")
        let appointmentsHTML = '';

        // Reset count for accurate appointment numbers
        count = 0;

        appointments.forEach(appointment => {
            appointmentsHTML += generateAppointmentHTML(appointment);
        });

        cards.innerHTML = appointmentsHTML;
    }
    
    // Function to cancel appointment
    function cancelAppointment(appointmentId) {
        // Perform cancellation logic here (e.g., remove appointment from the list)
        appointments.splice(appointments.findIndex(appt => appt.id === appointmentId), 1);
        displayAppointments();
    }
    
    // Function to reschedule appointment (for demonstration purposes, just an alert)
    function rescheduleAppointment(appointmentId) {
        alert(`Reschedule appointment with ID ${appointmentId}`);
        window.location.href = 'services.html';
    }
    
    const returnedFromServices = localStorage.getItem('returnedFromServices');
    if (returnedFromServices) {
        localStorage.removeItem('returnedFromServices');
        displayAppointments();
    }

    let newAppoint = document.querySelector(".buttons")
    newAppoint.addEventListener("click", () => {
        localStorage.setItem('returnedFromServices', 'true');
        window.location.href = 'barberindex.html';
    });



    let reschedule = document.querySelector("#reschedule")
    let trash = document.querySelector("#trash")

    reschedule.addEventListener("click", () => {
        rescheduleAppointment(appointments.id)
    })

    trash.addEventListener("click", () => {
        cancelAppointment(appointments.id)
    })
    
    
})
