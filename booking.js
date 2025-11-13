function createStars() {
  const container = document.getElementById('stars-container');
  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(star);
  }
}

window.onload = function() {
  createStars();
};



document.addEventListener('DOMContentLoaded', () => {
    const desktopLoginLink = document.getElementById('desktop-login-link');
    const desktopUserStatus = document.getElementById('desktop-user-status');
    const desktopUserName = document.getElementById('desktop-user-name');
    const desktopLogoutBtn = document.getElementById('desktop-logout-btn');

    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileUserStatus = document.getElementById('mobile-user-status');
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    const USER_SESSION_KEY = 'spacevoyager_user';

    function updateNavUI(session) {
        if (session && session.isLogged) {
            const userName = session.name.split(' ')[0];
            
            if (desktopLoginLink) desktopLoginLink.classList.add('hidden');
            if (desktopUserStatus) {
                desktopUserStatus.classList.remove('hidden');
                desktopUserStatus.classList.add('flex');
            }
            if (desktopUserName) desktopUserName.textContent = userName;
            
            if (mobileLoginLink) mobileLoginLink.classList.add('hidden');
            if (mobileUserStatus) {
                mobileUserStatus.classList.remove('hidden');
                mobileUserStatus.classList.add('flex');
            }
            if (mobileUserName) mobileUserName.textContent = userName;

        } else {
            if (desktopLoginLink) desktopLoginLink.classList.remove('hidden');
            if (desktopUserStatus) {
                desktopUserStatus.classList.add('hidden');
                desktopUserStatus.classList.remove('flex');
            }
            
            if (mobileLoginLink) mobileLoginLink.classList.remove('hidden');
            if (mobileUserStatus) {
                mobileUserStatus.classList.add('hidden');
                mobileUserStatus.classList.remove('flex');
            }
        }
    }

    function handleLogout() {
        localStorage.removeItem(USER_SESSION_KEY);
        updateNavUI({ isLogged: false });
        window.location.href = 'index.html'; 
    }

    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    if (desktopLogoutBtn) desktopLogoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    const storedSession = localStorage.getItem(USER_SESSION_KEY);
    if (storedSession) {
        const session = JSON.parse(storedSession);
        updateNavUI(session);
    } else {
        updateNavUI({ isLogged: false });
    }
});

/*--------------------------------------------*/
/* Load Destinations Data */
function getData_destinations() {
  fetch("destinations.json")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("destinationsData", JSON.stringify(data));
    })
    .catch(error => console.error("Error loading destinations:", error));
}
getData_destinations();

const Data = JSON.parse(localStorage.getItem("destinationsData"));
const AllData = Data.destinations;

/*--------------------------------------------*/
/* Load Accommodations Data */
function getData_accommodations() {
  fetch("accommodations.json")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("accommodationsData", JSON.stringify(data));
    })
    .catch(error => console.error("Error loading accommodations:", error));
}
getData_accommodations();

const accommodations_Data = JSON.parse(localStorage.getItem("accommodationsData"));
const Accommodations_Data = accommodations_Data.accommodations;

/*--------------------------------------------*/
/* VARIABLES */
const select = document.getElementById("options_select");
const Acc_type = document.getElementById("accommodation-options");
const userInfo = document.getElementById("user-info");
const addBtn = document.getElementById("Add-btn");
const Total_price = document.getElementById('price-value');
const passengersContainer = document.createElement("div");
userInfo.insertBefore(passengersContainer, addBtn);

let selectedDestinationId = null;
let selectedAccommodationId = null;
let destinationPrice = 0;
let accommodationPrice = 0;
let countOfDay = 1;
let passengerCount = 0;
let passengerMultiplier = 1;

/*--------------------------------------------*/
/* Display Accommodations */
function display_accommondations(destinationId) {
  Acc_type.innerHTML = "";

  for (let card of Accommodations_Data) {
    if (card.availableOn.includes(destinationId)) {
      Acc_type.innerHTML += `
        <div class="option border border-gray-700 rounded-lg p-4 hover:border-blue-400 cursor-pointer" data-id="${card.id}">
          <h4 class="text-blue-400 font-semibold">${card.name}</h4>
          <p class="text-gray-400 text-sm">${card.shortDescription}</p>
        </div>
      `;
    }
  }

  const optioncards = document.querySelectorAll(".option");
  optioncards.forEach(card => {
    card.addEventListener("click", function () {
      optioncards.forEach(c => c.classList.remove("border-blue-400"));
      this.classList.add("border-blue-400");
      selectedAccommodationId = this.dataset.id;

      const selectedAcc = Accommodations_Data.find(acc => acc.id === selectedAccommodationId);
      accommodationPrice = selectedAcc ? selectedAcc.pricePerDay : 0;

      userInfo.classList.remove("hidden");
      updateTotalPrice();
    });
  });
}

/*--------------------------------------------*/
function add_option_select() {
  for (let option_select of AllData) {
    select.innerHTML += `<option value="${option_select.id}">${option_select.name}</option>`;
  }
}
add_option_select();

/*--------------------------------------------*/
select.addEventListener("change", function () {
  selectedDestinationId = select.value;

  const destination = AllData.find(dest => dest.id === selectedDestinationId);

  if (destination) {
    destinationPrice = destination.price;
    countOfDay = destination.countOfDay || 1;
  } else {
    destinationPrice = 0;
    countOfDay = 1;
  }

  display_accommondations(selectedDestinationId);
  updateTotalPrice();
});

/*--------------------------------------------*/
/* Passenger Type Logic */
const passengerRadios = document.querySelectorAll('input[name="passengers"]');

passengerRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector('input[name="passengers"]:checked');
    userInfo.classList.remove("hidden");
    passengersContainer.innerHTML = "";
    passengerCount = 0;
    addBtn.classList.add("hidden");

    if (selected.value === "solo") {
      passengerMultiplier = 1;
      createPassengerForm();
    } else if (selected.value === "couple") {
      passengerMultiplier = 2;
      createPassengerForm();
      createPassengerForm();
    } else if (selected.value === "group") {
      passengerMultiplier = 3;
      createPassengerForm();
      createPassengerForm();
      createPassengerForm();
      addBtn.classList.remove("hidden");
    }

    updateTotalPrice();
  });
});

/*--------------------------------------------*/
/* Add Passenger Button */
addBtn.addEventListener("click", () => {
  if (passengerCount < 6) {
    //passengerCount++;
    passengerMultiplier = passengerCount;
    createPassengerForm();
    updateTotalPrice();
  }
  if (passengerCount === 6) {
    addBtn.classList.add("hidden");
  }
});

/*--------------------------------------------*/
/* Create Passenger Form */
function createPassengerForm() {
  const formDiv = document.createElement("div");
  formDiv.className = "p-4 mb-4 border border-gray-700 rounded-lg bg-gray-800";
  
  formDiv.innerHTML = `
  <h4 class="text-lg font-semibold text-blue-400 mb-2">Passenger ${passengerCount + 1}</h4>
    <label class="block mb-2">Full Name</label>
    <input type="text" placeholder="Enter full name" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">
    
    <label class="block mb-2">Phone Number</label>
    <input type="number" placeholder="Enter phone number" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">
    
    <label class="block mb-2">Email Address</label>
    <input type="email" placeholder="Enter email" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">
    
    <label class="block mb-2">Additional Notes</label>
    <textarea placeholder="Any special requests?" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3"></textarea>
    `;
    
    const inputs = formDiv.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("keyup", function () {
        validateInput(this);
      });
    });
    
    passengersContainer.appendChild(formDiv);
    passengerCount++;
}

/*--------------------------------------------*/
/* Validate All Passenger Forms */
function validateAllPassengers() {
  const forms = passengersContainer.querySelectorAll("div");
  let allValid = true;

  forms.forEach(formDiv => {
    const inputs = formDiv.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      if (input.value.trim() === "") {
        allValid = false;
      }
    });
  });

  return allValid;
}

/*--------------------------------------------*/
/* Book Button */

const bookbtn = document.getElementById("book-btn");

bookbtn.addEventListener("click", function () {
  if (!selectedDestinationId) {
    alert("Please select a destination before booking!");
    return;
  }

  if (!selectedAccommodationId) {
    alert("Please select an accommodation option!");
    return;
  }

  if (passengerCount === 0) {
    alert("Please add at least one passenger!");
    return;
  }

  const dateInput = document.getElementById("departure-date");
  if (!dateInput || !dateInput.value) {
    alert("Please select a departure date!");
    return;
  }

  const selectedDate = new Date(dateInput.value);
  const now = new Date();
  const diffTime = selectedDate - now;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    alert("Departure date cannot be in the past!");
    return;
  }
  if (diffDays < 30) {
    alert("You cannot select a date less than 30 days from now!");
    return;
  }

  const isValid = validateAllPassengers();
  if (!isValid) {
    alert("Please fill in all passenger information correctly!");
    return;
  }

  const passengers = [];
  const forms = passengersContainer.querySelectorAll("div");

  forms.forEach(formDiv => {
    const inputs = formDiv.querySelectorAll("input, textarea");
    const passenger = {
      fullName: inputs[0].value.trim(),
      phone: inputs[1].value.trim(),
      email: inputs[2].value.trim(),
      notes: inputs[3].value.trim(),
    };
    passengers.push(passenger);
  });

  const destination = AllData.find(dest => dest.id === selectedDestinationId);
  const accommodation = Accommodations_Data.find(acc => acc.id === selectedAccommodationId);

  const totalPrice = (destinationPrice + (accommodationPrice * countOfDay)) * passengerMultiplier;

  const bookingData = {
    id: Date.now(),
    user: userData.name,
    destination: destination ? destination.name : "Unknown",
    accommodation: accommodation ? accommodation.name : "Unknown",
    passengers: passengers,
    totalPrice: totalPrice + "$",
    departureDate: dateInput.value,
    dateCreated: new Date().toLocaleString(),
  };

  const existingBookings = JSON.parse(localStorage.getItem("spacevoyager_bookings")) || [];
  existingBookings.push(bookingData);
  localStorage.setItem("spacevoyager_bookings", JSON.stringify(existingBookings));

  alert("Booking saved successfully!");
  window.location.href = "myBooking.html";
});

/*--------------------------------------------*/
/* Input Validation */
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  let isValid = true;
  let message = "";

  if (type === "text") {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(value)) {
      isValid = false;
      message = "Please enter a valid name (letters only).";
    }
  }

  if (type === "number") {
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      message = "Enter a valid phone number (8-15 digits).";
    }
  }

  if (type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = "Enter a valid email address.";
    }
  }

  let errorMsg = input.nextElementSibling;
  if (errorMsg && errorMsg.classList.contains("error-msg")) {
    errorMsg.remove();
  }

  if (!isValid) {
    const msgEl = document.createElement("p");
    msgEl.className = "error-msg text-red-500 text-sm mt-1";
    msgEl.textContent = message;
    input.insertAdjacentElement("afterend", msgEl);
  }

  return isValid;
}

/*--------------------------------------------*/
/* Total Price */
function updateTotalPrice() {
  const total = (destinationPrice + (accommodationPrice * countOfDay)) * passengerMultiplier;
  Total_price.textContent = total > 0 ? total + "$" : "0$";
}

/* disabled button booking*/

const userData = JSON.parse(localStorage.getItem("spacevoyager_user"));

function checkLogin() {
  if (!userData || !userData.isLogged) {
    bookbtn.disabled = true;
    bookbtn.textContent = "Login to Book"; 
    bookbtn.classList.add("opacity-50", "cursor-not-allowed"); 
  } else {
    bookbtn.disabled = false;
    bookbtn.textContent = "Book Now";
    bookbtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}
checkLogin();



