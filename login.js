
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const submitButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

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
    const formContainer = loginForm ? loginForm.parentElement : null; 

    //Fake Database
    const FAKE_USERS = [
        { email: 'user1@space.com', password: 'Password1!', name: 'Captain Zidani' },
        { email: 'user2@space.com', password: 'Password2!', name: 'Astronaut Fatima' },
        { email: 'admin@space.com', password: 'AdminPass3!', name: 'Commander Alpha' },
        { email: 'test@space.com', password: 'TestPass4!', name: 'Voyager Neo' },
        { email: 'star5@space.com', password: 'StarPass5!', name: 'Explorer Six' },
        { email: 'alien6@space.com', password: 'AlienPass6!', name: 'Pilot Seven' },
        { email: 'dev7@space.com', password: 'DevPass7!', name: 'Engineer Eight' },
        { email: 'moon8@space.com', password: 'MoonPass8!', name: 'Cosmonaut Nine' },
        { email: 'mars9@space.com', password: 'MarsPass9!', name: 'Galaxy Ten' },
        { email: 'planet10@space.com', password: 'PlanetPass10!', name: 'Horizon Zero' }
    ];

    const USER_SESSION_KEY = 'spacevoyager_user';

    function initializeFakeDB() {
        if (!localStorage.getItem('fake_users_db')) {
            localStorage.setItem('fake_users_db', JSON.stringify(FAKE_USERS));
        }
    }

    if (loginForm) {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        function updateValidationUI(input, isValid, errorMessage = '') {
            const errorId = `${input.id}-error`;
            let errorElement = document.getElementById(errorId);

            if (isValid) {
                input.classList.remove('border-red-500', 'ring-red-500/50');
                input.classList.add('border-neon-blue/70');
                if (errorElement) 
                    errorElement.remove();
            } else {
                input.classList.remove('border-neon-blue/70');
                input.classList.add('border-red-500', 'ring-red-500/50');
                if (!errorElement) {
                    errorElement = document.createElement('p');
                    errorElement.id = errorId;
                    errorElement.classList.add('text-red-400', 'text-xs', 'mt-1');
                    input.parentElement.appendChild(errorElement);
                }
                errorElement.textContent = errorMessage;
            }
        }
        
        function checkFormValidity() {
            const isEmailValid = EMAIL_REGEX.test(emailInput.value.trim());
            const isPasswordValid = PASSWORD_REGEX.test(passwordInput.value);
            
            if (isEmailValid && isPasswordValid && submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
                submitButton.classList.add('glow');
            } else if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
                submitButton.classList.remove('glow');
            }
        }

        emailInput.addEventListener('keyup', () => {
            const email = emailInput.value.trim();
            const isValid = EMAIL_REGEX.test(email);
            const message = isValid ? '' : 'Please enter a valid email format.';
            updateValidationUI(emailInput, isValid, message);
            checkFormValidity();
        });

        passwordInput.addEventListener('keyup', () => {
            const password = passwordInput.value;
            const isValid = PASSWORD_REGEX.test(password);
            const message = isValid 
                ? '' 
                : 'Min 8 chars, incl. uppercase, lowercase, number, and special char.';
            updateValidationUI(passwordInput, isValid, message);
            checkFormValidity();
        });

        function displayAlert(message, isSuccess) {
            document.querySelectorAll('.login-alert').forEach(el => el.remove());

            const alertDiv = document.createElement('div');
            alertDiv.classList.add('login-alert', 'p-3', 'rounded-lg', 'font-semibold', 'mb-4');
            
            const baseClass = isSuccess ? 'bg-green-600/20 border-green-500 text-green-300' : 'bg-red-600/20 border-red-500 text-red-300';
            alertDiv.classList.add('border', ...baseClass.split(' '));

            alertDiv.textContent = message;
            if (formContainer)
                formContainer.prepend(alertDiv);
            
            setTimeout(() => { alertDiv.remove(); }, 5000);
        }

        // Gestion du Login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (submitButton.disabled) {
                displayAlert('Please correct the validation errors first.', false);
                return
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const users = JSON.parse(localStorage.getItem('fake_users_db'));

            const foundUser = users.find(
                user => user.email === email && user.password === password
            );

            if (foundUser) {
                const userSession = {
                    isLogged: true,
                    name: foundUser.name,
                    email: foundUser.email
                };

                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
                
                updateNavUI(userSession);
                displayAlert(`Welcome back, ${foundUser.name}! Login successful.`, true);

                emailInput.value = '';
                passwordInput.value = '';
                updateValidationUI(emailInput, true);
                updateValidationUI(passwordInput, true);
                checkFormValidity();

            } else {
                displayAlert('Incorrect email or password. Please try again.', false);
            }
        });
        
        checkFormValidity(); 
    }
    
    // display and huddin (username and button logout)    
    function updateNavUI(session) {
        if (session && session.isLogged) {
            const userName = session.name.split(' ')[0]; 
            
            if (desktopLoginLink) 
                desktopLoginLink.classList.add('hidden');
            if (desktopUserStatus) {
                desktopUserStatus.classList.remove('hidden');
                desktopUserStatus.classList.add('flex');
            }
            if (desktopUserName) 
                desktopUserName.textContent = userName;
            
            if (mobileLoginLink) 
                mobileLoginLink.classList.add('hidden');
            if (mobileUserStatus) {
                mobileUserStatus.classList.remove('hidden');
                mobileUserStatus.classList.add('flex');
            }
            if (mobileUserName) 
                mobileUserName.textContent = userName;

        } else {
            if (desktopLoginLink) 
                desktopLoginLink.classList.remove('hidden');
            if (desktopUserStatus) {
                desktopUserStatus.classList.add('hidden');
                desktopUserStatus.classList.remove('flex');
            }
            
            if (mobileLoginLink) 
                mobileLoginLink.classList.remove('hidden');
            if (mobileUserStatus) {
                mobileUserStatus.classList.add('hidden');
                mobileUserStatus.classList.remove('flex');
            }
        }
    }

    // logout logic, 
    function handleLogout() {
        localStorage.removeItem(USER_SESSION_KEY);
        updateNavUI({ isLogged: false });
        window.location.href = 'index.html'; 
    }

    if (desktopLogoutBtn) 
        desktopLogoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) 
        mobileLogoutBtn.addEventListener('click', handleLogout);

    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    initializeFakeDB();
    
    const storedSession = localStorage.getItem(USER_SESSION_KEY);
    if (storedSession) {
        const session = JSON.parse(storedSession);
        updateNavUI(session);
    } else {
        updateNavUI({ isLogged: false });
    }
});