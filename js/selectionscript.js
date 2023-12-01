// JavaScript for handling dynamic functionality

function showCustomization() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const customizationOptions = document.getElementById('customizationOptions');
    const appointmentScheduling = document.getElementById('appointmentScheduling');
    appointmentScheduling.style.display = 'none';

    if (selectedServices.length > 0) {
        customizationOptions.style.display = 'block';

        // Reset display for all customization options
        document.getElementById('haircutCustomization').style.display = 'none';
        document.getElementById('hairColouringCustomization').style.display = 'none';
        document.getElementById('hairBeardCustomization').style.display = 'none';
        document.getElementById('hairDoCustomization').style.display = 'none';
        document.getElementById('prefbarber').style.display = 'none';
        document.getElementById('prefstylist').style.display = 'none';

        // Show customization options based on selected services
        selectedServices.forEach(service => {
            const serviceId = service.id;
            if (serviceId === 'haircut') {
                document.getElementById('haircutCustomization').style.display = 'block';
                document.getElementById('prefbarber').style.display = 'block';
            } else if (serviceId === 'hairColouring') {
                document.getElementById('hairColouringCustomization').style.display = 'block';
            } else if (serviceId === 'hairBeard') {
                document.getElementById('hairBeardCustomization').style.display = 'block';
                document.getElementById('prefbarber').style.display = 'none';
            } else if (serviceId === 'hairDo') {
                document.getElementById('hairDoCustomization').style.display = 'block';
                document.getElementById('prefstylist').style.display = 'block';
            } else if (serviceId === 'facial') {
                document.getElementById('facialCustomization').style.display = 'block';
            }
        });
    } else {
        alert('Please select at least one service.');
    }
}

function updateHairDoValue() {
    const hairDoSelect = document.getElementById('hairDoStyle');
    const selectedOption = hairDoSelect.options[hairDoSelect.selectedIndex];
    const hairDoValue = parseFloat(selectedOption.value);

    if (!isNaN(hairDoValue)) {
        document.getElementById('hairDo').value = hairDoValue;

        // Also update the displayed value in the hairDoCustomization div for clarity
        document.getElementById('hairDoCustomizationValue').innerText = `$${hairDoValue.toFixed(2)}`;
    }
}


// Modify calculateTotal function
function calculateTotal() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const selectedServicesList = document.getElementById('selectedServicesList');
    const finalTotal = document.getElementById('finalTotal');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const calendar = document.getElementById('calendar'); // Get the calendar container

    let totalPrice = 0;

    selectedServicesList.innerHTML = '';

    selectedServices.forEach(service => {
        const serviceName = service.labels[0].innerText;
        const serviceId = service.id;

        let servicePrice;

        if (serviceId === 'hairDo') {
            servicePrice = parseFloat(document.getElementById('hairDo').value);
        } else if (serviceId === 'facial') {
            servicePrice = parseFloat(service.value);
        } else {
            servicePrice = parseFloat(service.value);
        }

        totalPrice += servicePrice;

        // Append service to the breakdown list
        const listItem = document.createElement('li');
        listItem.textContent = `${serviceName}: $${servicePrice.toFixed(2)}`;
        selectedServicesList.appendChild(listItem);
    });

    // Display the final total
    finalTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;

    showBookingSection();
}

// Add this line to update the button click event
document.getElementById('bookNowBtn').addEventListener('click', generateBookingEmail);

function showBookingSection() {
    const payment = document.getElementById('payment');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const calendar = document.getElementById('calendar');
    const bookNowBtn = document.getElementById('bookNowBtn');

    // Hide the price breakdown
    priceBreakdown.style.display = 'block';

    payment.style.display = 'block';

    // Display the availability calendar
    calendar.style.display = 'block';

    appointmentScheduling.style.display = 'block';

    // Hide the "Book Now" button
    bookNowBtn.style.display = 'none';
}


// Add this function to show the calendar and hide other sections
function showCalendar() {
    document.getElementById('customizationOptions').style.display = 'none';
    document.getElementById('priceBreakdown').style.display = 'none';
    document.getElementById('appointmentScheduling').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';

    // Reset the calendar to its default state
    resetCalendar();

    // Fetch and update availability data
    fetchAvailabilityData()
        .then(availabilityData => {
            // Update the calendar based on the fetched availability data
            updateCalendar(availabilityData);
        })
        .catch(error => {
            console.error('Error fetching availability data:', error.message);
        });
}

// Add this function to reset the calendar to the default state
function resetCalendar() {
    const slots = document.querySelectorAll('#availabilityCalendar tbody td');
    slots.forEach(slot => {
        slot.classList.remove('available', 'unavailable', 'booked');
        slot.textContent = 'Available';
    });
}



function displayConfirmationMessage(message) {
    alert(message);
}

// Update scheduleAppointment function
function scheduleAppointment() {
    // Get the selected date and time
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    // Check if date and time are selected
    if (appointmentDate && appointmentTime) {
        // Check availability
        checkAvailability(appointmentDate, appointmentTime)
            .then(isAvailable => {
                if (isAvailable) {
                    // Assuming no conflicts, proceed with scheduling
                    markSlotAsBooked(appointmentDate, appointmentTime);
                    const confirmationMessage = `Appointment scheduled for ${appointmentDate} at ${appointmentTime}`;
                    displayConfirmationMessage(confirmationMessage);
                    generateBookingEmail()

                    // Reset values after scheduling
                    document.getElementById('appointmentDate').value = '';
                    document.getElementById('appointmentTime').value = '';
                } else {
                    alert('Sorry, the selected day/time is not available. Please choose another day/time.');
                }
            })
            .catch(error => {
                console.error('Error checking availability:', error.message);
            });
    } else {
        alert('Please select both date and time for your appointment.');
    }
}


// Update markSlotAsBooked function
function markSlotAsBooked(day, time) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slotIndex = (time - 9) + day * 5; // Assuming each day has 5 time slots starting from 9:00 AM

    const slot = document.querySelectorAll(`#availabilityCalendar tbody td`)[slotIndex];
    if (slot) {
        slot.classList.remove('available');
        slot.classList.add('unavailable');
        slot.textContent = 'Booked';
    }
}

function checkAvailability(selectedDate, selectedTime) {
    // Replace this with your actual logic to fetch scheduled appointments
    return fetchAvailabilityData()
        .then(scheduledAppointments => {
            const appointmentsForSelectedDate = scheduledAppointments[selectedDate];

            // Check if the selected date has appointments
            if (appointmentsForSelectedDate) {
                // Check if the selected time is available
                const isAvailable = appointmentsForSelectedDate[selectedTime] !== 'booked';

                return isAvailable;
            } else {
                // If there are no appointments for the selected date, it is available
                return true;
            }
        })
        .catch(error => {
            console.error('Error fetching scheduled appointments:', error.message);
            throw new Error('Error checking availability');
        });
}

// Add this function to show the calendar and hide other sections
function showCalendar() {
    document.getElementById('customizationOptions').style.display = 'none';
    document.getElementById('priceBreakdown').style.display = 'none';
    document.getElementById('appointmentScheduling').style.display = 'none';

    // Add the line below to hide the availability calendar
    document.getElementById('calendar').style.display = 'none';

    resetCalendar();

    fetchAvailabilityData()
        .then(availabilityData => {
            // Update the calendar based on the fetched availability data
            updateCalendar(availabilityData);
        })
        .catch(error => {
            console.error('Error fetching availability data:', error.message);
        });
    // For demonstration, we'll mark some slots as booked
    markSlotAsBooked(1, 5); // Monday, 9:00 AM
    markSlotAsBooked(3, 2); // Wednesday, 9:00 AM
}


function fetchAvailabilityData() {
    // Simulate fetching availability data from a server
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulated availability data
            const availabilityData = {
                '2023-12-01': {
                    '9:00 AM': 'available',
                    '10:00 AM': 'unavailable',
                    '11:00 AM': 'available',
                    '12:00 PM': 'available',
                    '1:00 PM': 'unavailable',
                    '2:00 PM': 'available',
                    '3:00 PM': 'available',
                    '4:00 PM': 'unavailable',
                    '5:00 PM': 'available',
                    '6:00 PM': 'available',
                },
                '2023-12-02': {
                    '9:00 AM': 'available',
                    '10:00 AM': 'available',
                    '11:00 AM': 'unavailable',
                    '12:00 PM': 'unavailable',
                    '1:00 PM': 'available',
                    '2:00 PM': 'unavailable',
                    '3:00 PM': 'available',
                    '4:00 PM': 'available',
                    '5:00 PM': 'available',
                    '6:00 PM': 'unavailable',
                },
                // Add more dates as needed
            };

            resolve(availabilityData);
        }, 1000); // Simulate a 1-second delay (adjust as needed)
    });
}

// Function to update the calendar based on availability data
function updateCalendar(availabilityData) {
    console.log('Updating calendar with availability data:', availabilityData);
    const slots = document.querySelectorAll('#availabilityCalendar tbody td');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    slots.forEach((slot, index) => {
        const day = days[Math.floor(index / 5)];
        const time = (index % 5) + 9 + ':00 AM'; // Assuming each day has 5 time slots starting from 9:00 AM

        if (availabilityData[day] && availabilityData[day][time]) {
            if (availabilityData[day][time] === 'available') {
                slot.classList.add('available');
                slot.textContent = 'Available';
            } else {
                slot.classList.add('booked');
                slot.textContent = 'Booked';
            }
        } else {
            slot.classList.add('unavailable');
            slot.textContent = 'Unavailable';
        }
    });
}


function resetSelection() {
    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('.serviceOption input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide customization options, price breakdown, and availability calendar
    document.getElementById('customizationOptions').style.display = 'none';
    document.getElementById('priceBreakdown').style.display = 'none';
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('appointmentScheduling').style.display = 'none';

    // Reset values and selections
    document.getElementById('haircutStyle').selectedIndex = 0;
    document.getElementById('hairColour').selectedIndex = 0;
    document.getElementById('hairBeardStyle').selectedIndex = 0;
    document.getElementById('beardStyle').selectedIndex = 0;
    document.getElementById('hairDoStyle').selectedIndex = 0;
    document.getElementById('barbers').selectedIndex = 0;
    document.getElementById('stylists').selectedIndex = 0;

    // Reset total price
    document.getElementById('finalTotal').innerText = 'Total: $0.00';
    
}


function generateBookingEmail() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const emailContent = [];
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    if (appointmentDate && appointmentTime) {
        emailContent.push(`Appointment Date: ${appointmentDate}`);
        emailContent.push(`Appointment Time: ${appointmentTime}`);
    }

    selectedServices.forEach(service => {
        emailContent.push(service.labels[0].innerText);
    });

    if (document.getElementById('haircut').checked) {
        const haircutStyle = document.getElementById('haircutStyle').value;
        emailContent.push(`Haircut Style: ${haircutStyle}`);
    }

    if (document.getElementById('hairColouring').checked) {
        const hairColour = document.getElementById('hairColour').value;
        emailContent.push(`Hair Colour: ${hairColour}`);
    }

    if (document.getElementById('hairBeard').checked) {
        const hairBeardStyle = document.getElementById('hairBeardStyle').value;
        emailContent.push(`Hair & Beard Style: ${hairBeardStyle}`);

        const beardStyle = document.getElementById('beardStyle').value;
        emailContent.push(`Beard Style: ${beardStyle}`);
    }

    if (document.getElementById('hairDo').checked) {
        const hairDoStyle = document.getElementById('hairDoStyle').value;
        emailContent.push(`Hair-Do Style: ${hairDoStyle}`);
    }

    // Include Facial service in the email content
    const facialCheckbox = document.getElementById('facial');
    if (facialCheckbox && facialCheckbox.checked) {
        emailContent.push('Facial');
    }

    // Retrieve the selected hair stylist
    const selectedStylistElement = document.getElementById('stylist');
    const selectedStylistText = selectedStylistElement ? selectedStylistElement.options[selectedStylistElement.selectedIndex].text : '';

    // Retrieve the selected barber
    const selectedBarberElement = document.getElementById('barbers');
    const selectedBarberText = selectedBarberElement ? selectedBarberElement.options[selectedBarberElement.selectedIndex].text : '';

    // Include the selected stylist/barber in the email message
    emailContent.push(`Selected Stylist/Barber: ${selectedStylistText || selectedBarberText}`);

    // Retrieve the total price
    const totalPriceElement = document.getElementById('finalTotal');
    const totalPrice = totalPriceElement ? totalPriceElement.innerText : '';

    // Include the total price in the email message
    emailContent.push(`Total Price: ${totalPrice}`);

    const emailMessage = `Selected Services:\n${emailContent.join('\n')}`;
    console.log(emailMessage);
    alert('Booking email generated and sent!');

    setTimeout(3);
    window.location.href = "admin.html";
    resetSelection()
}

// Update the button click event for "Book Now"
document.getElementById('bookNowBtn').addEventListener('click', generateBookingEmail);

