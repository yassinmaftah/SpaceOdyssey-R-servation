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

const options = document.querySelectorAll('.option');
const userInfo = document.getElementById('user-info');

options.forEach(option => {
  option.addEventListener('click', function() {
    options.forEach(o => o.classList.remove('border-blue-400'));
    this.classList.add('border-blue-400');
    userInfo.classList.remove('hidden');
    userInfo.scrollIntoView({ behavior: 'smooth' });
  });
});



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




/*get user data*/
const loggedUser = JSON.parse(localStorage.getItem("spacevoyager_user"));
const bookingsContainer = document.getElementById("bookings-container");

/*display just booking of user login */
if (!loggedUser) {
  bookingsContainer.innerHTML = `
    <div class="text-center text-red-400 text-xl font-semibold">
      You must log in to view your bookings.
    </div>
  `;
  throw new Error("User not logged in");
}


/* get data from localStorage*/

const allBookings = JSON.parse(localStorage.getItem("spacevoyager_bookings")) || [];
const userBookings = allBookings.filter(b => b.user === loggedUser.name);

/* display tickets */
if (userBookings.length === 0) {
  bookingsContainer.innerHTML = `
    <div class="col-span-full text-center text-gray-400 text-lg">
      You don’t have any bookings yet. 🌌
    </div>
  `;
} else {
  userBookings.forEach((booking, index) => {
    const ticket = document.createElement("div");
    ticket.className =
      "ticket bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 relative overflow-hidden";

    ticket.setAttribute("data-id", booking.id);

    ticket.innerHTML = `
      <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
      <h2 class="text-2xl font-semibold text-blue-400 mb-4">${booking.destination}</h2>

      <div class="space-y-2 text-sm md:text-base">
        <p><strong>Accommodation:</strong> ${booking.accommodation}</p>
        <p><strong>Departure Date:</strong> ${booking.departureDate}</p>
        <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
        <p><strong>Booking Date:</strong> ${booking.dateCreated}</p>
        <p><strong>Booked By:</strong> ${booking.user}</p>
      </div>

      <div class="mt-4">
        <h3 class="text-blue-300 font-semibold mb-2">Passengers:</h3>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          ${booking.passengers.map((p, i) => `
            <li>
              <span class="font-semibold text-blue-400">Passenger ${i + 1}:</span> 
              ${p.fullName} (${p.email})
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="mt-6 flex flex-col gap-3">
        <button 
          class="download-btn w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg"
          data-id="${booking.id}">
          Download Ticket (PDF)
        </button>

        <button 
          class="delete-btn w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2 rounded-lg"
          data-id="${booking.id}">
          Delete Booking
        </button>
      </div>
    `;

    bookingsContainer.appendChild(ticket);
  });

  document.querySelectorAll(".download-btn").forEach(btn => {
    btn.addEventListener("click", function () {

      const id = this.getAttribute("data-id");
      const ticket = document.querySelector(`.ticket[data-id="${id}"]`);

      ticket.classList.add("print-area");

      window.print();

      setTimeout(() => {
        ticket.classList.remove("print-area");
      }, 500);
    });
  });
}

/* Download tickets as pdf */

