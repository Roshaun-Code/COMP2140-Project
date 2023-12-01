// JavaScript for handling dynamic functionality

function showCustomization() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const customizationOptions = document.getElementById('customizationOptions');

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




function calculateTotal() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const selectedServicesList = document.getElementById('selectedServicesList');
    const finalTotal = document.getElementById('finalTotal');
    const bookNowBtn = document.getElementById('bookNowBtn');

    let totalPrice = 0;

    selectedServicesList.innerHTML = '';

    selectedServices.forEach(service => {
        const serviceName = service.labels[0].innerText;
        const serviceId = service.id;

        let servicePrice;

        if (serviceId === 'hairDo') {
            servicePrice = parseFloat(document.getElementById('hairDo').value);
        } else if (serviceId === 'facial') { // Handle Facial service
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

    // Show the price breakdown section
    priceBreakdown.style.display = 'block';

    // Display the "Book Now" button
    bookNowBtn.style.display = 'block';
}


function resetSelection() {
    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('.serviceOption input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide customization options and price breakdown
    document.getElementById('customizationOptions').style.display = 'none';
    document.getElementById('priceBreakdown').style.display = 'none';

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

    // Hide the "Book Now" button
    document.getElementById('bookNowBtn').style.display = 'none';
}

function generateBookingEmail() {
    const selectedServices = document.querySelectorAll('.serviceOption input:checked');
    const emailContent = [];

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
    const totalPriceElement = document.getElementById('totalPrice');
    const totalPrice = totalPriceElement ? totalPriceElement.innerText : '';

    // Include the total price in the email message
    emailContent.push(`Total Price: ${totalPrice}`);

    const emailMessage = `Selected Services:\n${emailContent.join('\n')}`;
    console.log(emailMessage);
    alert('Booking email generated and sent!');


    setTimeout(5)
    window.location.href = "admin.html";
    resetSelection
}
