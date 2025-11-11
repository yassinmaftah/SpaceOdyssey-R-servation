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

/*--------------------------------------------------------------------*/

/*--------------------------------------------------------------------*/
/* Upload data from destinations.json */

function getData_destinations() {
  fetch("destinations.json")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("destinationsData", JSON.stringify(data));
    })
    .catch((error) => console.error("Error loading destinations:", error));
}
getData_destinations();

const Data = JSON.parse(localStorage.getItem("destinationsData"));
const AllData = Data.destinations;

/*--------------------------------------------------------------------*/
/* Upload data from accommodations.json */

function getData_accommodations() {
  fetch("accommodations.json")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("accommodationsData", JSON.stringify(data));
    })
    .catch((error) => console.error("Error loading accommodations:", error));
}
getData_accommodations();

const accommodations_Data = JSON.parse(localStorage.getItem("accommodationsData"));
const Accommodations_Data = accommodations_Data.accommodations;

/*--------------------------------------------------------------------*/

const select = document.getElementById("options_select");
const Acc_type = document.getElementById("accommodation-options");
const userInfo = document.getElementById("user-info");
const addBtn = document.getElementById("Add-btn");
const passengersContainer = document.createElement("div");
userInfo.insertBefore(passengersContainer, addBtn);

let passengerCount = 0;

/*--------------------------------------------------------------------*/
/* Display accommodations */

let selectedAccommodationId = null;

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

  const optioncards = document.querySelectorAll('.option');
  optioncards.forEach(card => {
    card.addEventListener('click', function() {
      optioncards.forEach(c => c.classList.remove('border-blue-400'));
      this.classList.add('border-blue-400');
      selectedAccommodationId = this.dataset.id;

      userInfo.classList.remove('hidden');
    });
  });
}

/*--------------------------------------------------------------------*/
function add_option_select() {
  for (let option_select of AllData) {
    select.innerHTML += `
      <option value="${option_select.id}">${option_select.name}</option>
    `;
  }
}

select.addEventListener("change", function () {
  const value_choice = select.value;
  display_accommondations(value_choice);
});

/*--------------------------------------------------------------------*/
/* Passengers Logic */

const passengerRadios = document.querySelectorAll('input[name="passengers"]');

passengerRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector('input[name="passengers"]:checked');
    userInfo.classList.remove("hidden");
    passengersContainer.innerHTML = "";
    passengerCount = 0;
    addBtn.classList.add("hidden");

    if (selected.value === "solo") {
      createPassengerForm();
    } else if (selected.value === "couple") {
      createPassengerForm();
      createPassengerForm();
    } else if (selected.value === "group") {
      createPassengerForm();
      createPassengerForm();
      createPassengerForm();
      addBtn.classList.remove("hidden");
    }
  });
});

/*--------------------------------------------------------------------*/
/* Add Passenger Button Logic */

addBtn.addEventListener("click", () => {
  if (passengerCount < 6) {
    createPassengerForm();
  }
  if (passengerCount === 6) {
    addBtn.classList.add("hidden");
  }
});

/*--------------------------------------------------------------------*/
/* Create Passenger Form */

function createPassengerForm() {
  passengerCount++;
  const formDiv = document.createElement("div");
  formDiv.className = "p-4 mb-4 border border-gray-700 rounded-lg bg-gray-800";

  formDiv.innerHTML = `
    <h4 class="text-lg font-semibold text-blue-400 mb-2">Passenger ${passengerCount}</h4>
    <label class="block mb-2">Full Name</label>
    <input type="text" placeholder="Enter full name" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">

    <label class="block mb-2">Phone Number</label>
    <input type="number" placeholder="Enter phone number" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">

    <label class="block mb-2">Email Address</label>
    <input type="email" placeholder="Enter email" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3">

    <label class="block mb-2">Additional Notes</label>
    <textarea placeholder="Any special requests?" class="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3"></textarea>
  `;

  passengersContainer.appendChild(formDiv);
}

/*--------------------------------------------------------------------*/

add_option_select();



