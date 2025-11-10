
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

// navbar

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

// read Data from file destinatinos.json , (async , await) wait to upluad data
async function fetchDestinationsData() {
    try {
        const response = await fetch('destinations.json');
        const data = await response.json();
        
        return data.destinations; 

    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
}

function displayDestinations(destinationsArray) {
    const container = document.getElementById('destinations-container');
    
    if (!destinationsArray || destinationsArray.length === 0) {
        container.innerHTML = '<p class="text-red-500 text-center text-xl">No destinations found or failed to load data.</p>';
        return;
    }

    const visualMap = {
        "moon": { "icon": "fa-moon", "gradient": "from-gray-400 to-gray-200" },
        "mars": { "icon": "fa-globe-americas", "gradient": "from-red-500 to-orange-500" },
        "europa": { "icon": "fa-snowflake", "gradient": "from-blue-300 to-blue-500" },
        "titan": { "icon": "fa-ring", "gradient": "from-orange-400 to-yellow-500" },
        "orbital-station": { "icon": "fa-satellite-dish", "gradient": "from-neon-cyan to-neon-blue" },
        "venus-clouds": { "icon": "fa-cloud-sun", "gradient": "from-yellow-600 to-orange-600" }
    };

    destinationsArray.forEach((destination, index) => {
        const visual = visualMap[destination.id];
        const imageOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2';
        const contentOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1';
        
        let fourthStatLabel, fourthStatValue;
        if (destination.id === 'orbital-station') {
            fourthStatLabel = 'Orbit Period';
            fourthStatValue = destination.dayLength;
        } else if (destination.id === 'europa') {
            fourthStatLabel = 'Surface';
            fourthStatValue = 'Ice crust';
        } else {
            fourthStatLabel = 'Atmosphere';
            fourthStatValue = destination.atmosphere.includes('CO₂') ? 'Thin CO₂' : destination.atmosphere;
        }
        
        const gravityDisplay = destination.gravity.includes('(') ? destination.gravity.split('(')[1].replace(')', '') : destination.gravity;

        const html = `
            <div class="planet-card p-8 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div class="${imageOrder} flex justify-center">
                    <div class="w-64 h-64 rounded-full bg-gradient-to-r ${visual.gradient} flex items-center justify-center glow">
                        <i class="fas ${visual.icon} text-white text-6xl"></i>
                    </div>
                </div>
                <div class="${contentOrder}">
                    <h2 class="font-orbitron text-3xl mb-4 text-glow">${destination.name}</h2>
                    <p class="text-gray-300 mb-4 text-lg">
                        ${destination.description}
                    </p>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-space-purple/50 p-4 rounded-lg">
                            <h4 class="font-orbitron text-neon-blue mb-2">Journey Time</h4>
                            <p class="text-gray-300">${destination.travelDuration}</p>
                        </div>
                        <div class="bg-space-purple/50 p-4 rounded-lg">
                            <h4 class="font-orbitron text-neon-blue mb-2">Gravity</h4>
                            <p class="text-gray-300">${gravityDisplay}</p>
                        </div>
                        <div class="bg-space-purple/50 p-4 rounded-lg">
                            <h4 class="font-orbitron text-neon-blue mb-2">Temperature</h4>
                            <p class="text-gray-300">${destination.temperature.replace(' average', '').replace('(at cloud level)', '')}</p>
                        </div>
                        <div class="bg-space-purple/50 p-4 rounded-lg">
                            <h4 class="font-orbitron text-neon-blue mb-2">${fourthStatLabel}</h4>
                            <p class="text-gray-300">${fourthStatValue}</p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="booking.html?dest=${destination.id}" class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-center">
                            Book ${destination.name} Journey
                        </a>
                        <a href="gallery.html?dest=${destination.id}" class="border border-neon-blue text-neon-blue px-6 py-3 rounded-lg font-bold text-center hover:bg-neon-blue/10 transition-colors">
                            View Gallery
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    createStars();
    
    const allDestinations = await fetchDestinationsData();

    if (allDestinations) {
        displayDestinations(allDestinations);
    }
});