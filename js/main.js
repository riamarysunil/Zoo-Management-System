document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginSignupPopup = document.getElementById('loginSignupPopup');
    const closePopup = document.getElementById('closePopup');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmationText = document.getElementById('confirmationText');

    // Open login popup
    function openLoginPopup() {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginSignupPopup.style.display = 'flex';
    }

    // Open signup popup
    function openSignupPopup() {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        loginSignupPopup.style.display = 'flex';
    }

    // Close popup
    function closePopupFunction() {
        loginSignupPopup.style.display = 'none';
    }

    // Show confirmation message
    function showConfirmationMessage(message) {
        confirmationText.textContent = message;
        confirmationMessage.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);
    }

    loginBtn.addEventListener('click', openLoginPopup);
    signupBtn.addEventListener('click', openSignupPopup);
    closePopup.addEventListener('click', closePopupFunction);

    window.addEventListener('click', function(event) {
        if (event.target === loginSignupPopup) {
            closePopupFunction();
        }
    });

    // Switch to login form
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    // Switch to signup form
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Helper function to display error message
    function showError(input, message) {
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
        input.classList.add('error');
    }

    // Helper function to clear error message
    function clearError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        input.classList.remove('error');
    }

    // Signup form validation function
    function validateSignupForm() {
        let isValid = true;

        // First name validation
        const firstName = firstNameInput.value.trim();
        if (!/^[a-zA-Z]+$/.test(firstName)) {
            showError(firstNameInput, 'First name should only contain letters.');
            isValid = false;
        } else {
            clearError(firstNameInput);
        }

        // Last name validation
        const lastName = lastNameInput.value.trim();
        if (!/^[a-zA-Z]+$/.test(lastName)) {
            showError(lastNameInput, 'Last name should only contain letters.');
            isValid = false;
        } else {
            clearError(lastNameInput);
        }

        // Mobile number validation
        const phoneNumber = phoneNumberInput.value.trim();
        if (!/^\d+$/.test(phoneNumber)) {
            showError(phoneNumberInput, 'Mobile number should only contain numbers.');
            isValid = false;
        } else {
            clearError(phoneNumberInput);
        }

        // Password validation
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        if (password !== confirmPassword) {
            showError(passwordInput, 'Passwords do not match.');
            showError(confirmPasswordInput, 'Passwords do not match.');
            passwordInput.value = '';
            confirmPasswordInput.value = '';
            isValid = false;
        } else {
            clearError(passwordInput);
            clearError(confirmPasswordInput);
        }

        return isValid;
    }

    // Form submit event listener for signup
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from submitting

        if (validateSignupForm()) {
            // Clear form inputs
            firstNameInput.value = '';
            lastNameInput.value = '';
            phoneNumberInput.value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';

            // Hide the popup
            closePopupFunction();

            // Show success message after closing the popup
            setTimeout(() => {
                showConfirmationMessage('You have successfully signed up!');
            }, 100); // Delay to ensure popup closes before showing confirmation message
        }
    });

    // Login form validation function
    function validateLoginForm() {
        let isValid = true;

        // Email validation
        const email = loginEmailInput.value.trim();
        if (email === '') {
            showError(loginEmailInput, 'Email is required.');
            isValid = false;
        } else {
            clearError(loginEmailInput);
        }

        // Password validation
        const password = loginPasswordInput.value.trim();
        if (password === '') {
            showError(loginPasswordInput, 'Password is required.');
            isValid = false;
        } else {
            clearError(loginPasswordInput);
        }

        return isValid;
    }

    // Form submit event listener for login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from submitting

        if (validateLoginForm()) {
            // Clear form inputs
            loginEmailInput.value = '';
            loginPasswordInput.value = '';

            // Hide the popup
            closePopupFunction();

            // Show success message after closing the popup
            setTimeout(() => {
                showConfirmationMessage('You have successfully logged in!');
            }, 100); // Delay to ensure popup closes before showing confirmation message
        }
    });

    document.querySelector('.plan-section').addEventListener('click', function() {
        const dropdown = document.querySelector('.dropdown-content');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    
    
});
