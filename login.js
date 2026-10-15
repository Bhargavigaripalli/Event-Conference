/* =========================================================
   STACKLY CONFERENCE PORTAL AUTHENTICATION JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginFormWrapper = document.getElementById("loginFormWrapper");
    const signupFormWrapper = document.getElementById("signupFormWrapper");
    const goToSignup = document.getElementById("goToSignup");
    const goToLogin = document.getElementById("goToLogin");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginMessage = document.getElementById("loginMessage");
    const signupMessage = document.getElementById("signupMessage");

    const USERS_KEY = "wedeaUsers";
    const LOGIN_EMAIL_KEY = "loggedInEmail";
    const LOGIN_ROLE_KEY = "loggedInRole";
    const LOGIN_STATUS_KEY = "isLoggedIn";

    function getUsers() {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            return [];
        }
        try {
            const users = JSON.parse(storedUsers);
            return Array.isArray(users) ? users : [];
        } catch (error) {
            console.error("Error reading users:", error);
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function showMessage(element, message, type = "error") {
        if (!element) return;
        element.textContent = message;
        element.className = "auth-message";
        if (message) {
            element.classList.add(type);
        }
    }

    function clearMessage(element) {
        if (!element) return;
        element.textContent = "";
        element.className = "auth-message";
    }

    function showLogin() {
        if (!loginTab || !signupTab || !loginFormWrapper || !signupFormWrapper) {
            return;
        }
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginFormWrapper.classList.add("active");
        signupFormWrapper.classList.remove("active");
        clearMessage(loginMessage);
        clearMessage(signupMessage);

        const loginEmail = document.getElementById("loginEmail");
        const loginPassword = document.getElementById("loginPassword");
        if (loginEmail) loginEmail.value = "";
        if (loginPassword) loginPassword.value = "";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showSignup() {
        if (!loginTab || !signupTab || !loginFormWrapper || !signupFormWrapper) {
            return;
        }
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupFormWrapper.classList.add("active");
        loginFormWrapper.classList.remove("active");
        clearMessage(loginMessage);
        clearMessage(signupMessage);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (loginTab) {
        loginTab.addEventListener("click", showLogin);
    }

    if (signupTab) {
        signupTab.addEventListener("click", showSignup);
    }

    if (goToSignup) {
        goToSignup.addEventListener("click", function (event) {
            event.preventDefault();
            showSignup();
        });
    }

    if (goToLogin) {
        goToLogin.addEventListener("click", function (event) {
            event.preventDefault();
            showLogin();
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll(".role-dropdown.open").forEach(dropdown => {
            dropdown.classList.remove("open");
            const button = dropdown.querySelector(".dropdown-btn");
            if (button) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setupRoleDropdown(buttonId, dropdownMenuId, selectedRoleId, hiddenInputId) {
        const button = document.getElementById(buttonId);
        const menu = document.getElementById(dropdownMenuId);
        const selectedRole = document.getElementById(selectedRoleId);
        const hiddenInput = document.getElementById(hiddenInputId);

        if (!button || !menu || !selectedRole || !hiddenInput) return;

        const dropdown = button.closest(".role-dropdown");
        if (!dropdown) return;

        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = dropdown.classList.contains("open");
            closeAllDropdowns();

            if (!isOpen) {
                dropdown.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            }
        });

        const items = menu.querySelectorAll(".dropdown-item");
        items.forEach(item => {
            item.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                const value = item.getAttribute("data-value");
                const span = item.querySelector("span");
                const text = span ? span.textContent.trim() : item.textContent.trim();

                hiddenInput.value = value;
                selectedRole.textContent = text;

                dropdown.classList.remove("open");
                button.setAttribute("aria-expanded", "false");

                if (hiddenInputId === "loginRole") {
                    clearMessage(loginMessage);
                }
                if (hiddenInputId === "signupRole") {
                    clearMessage(signupMessage);
                }
            });
        });
    }

    setupRoleDropdown("loginRoleBtn", "loginDropdownMenu", "loginSelectedRole", "loginRole");
    setupRoleDropdown("signupRoleBtn", "signupDropdownMenu", "signupSelectedRole", "signupRole");

    document.addEventListener("click", () => {
        closeAllDropdowns();
    });

    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const targetId = button.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);
            if (!passwordInput) return;

            const icon = button.querySelector("i");

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }
                button.setAttribute("aria-label", "Hide password");
            } else {
                passwordInput.type = "password";
                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
                button.setAttribute("aria-label", "Show password");
            }
        });
    });

    function isValidSignupName(name) {
        const namePattern = /^[A-Za-z]{1,16}$/;
        return namePattern.test(String(name).trim());
    }

    function isValidName(name) {
        return isValidSignupName(name);
    }

    function isValidGmail(email) {
        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        return gmailPattern.test(String(email).trim());
    }

    function isValidEmail(email) {
        return isValidGmail(email);
    }

    function isStrongPassword(password) {
        if (!password || password.length < 8) return false;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`^]/.test(password);
        return hasUpper && hasLower && hasNumber && hasSpecial;
    }

    function isValidPassword(password) {
        return isStrongPassword(password);
    }

    const signupNameInput = document.getElementById("signupName");
    if (signupNameInput) {
        signupNameInput.addEventListener("input", () => {
            signupNameInput.value = signupNameInput.value.replace(/[^A-Za-z]/g, "").slice(0, 16);
        });
    }

    const acceptTermsInput = document.getElementById("acceptTerms");
    if (acceptTermsInput) {
        acceptTermsInput.checked = false;
        acceptTermsInput.addEventListener("change", () => {
            const customCheckbox = acceptTermsInput.nextElementSibling;
            if (customCheckbox) {
                customCheckbox.classList.remove("checkbox-error");
            }
            if (acceptTermsInput.checked && signupMessage && signupMessage.textContent.includes("Terms & Conditions")) {
                clearMessage(signupMessage);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", event => {
            event.preventDefault();
            clearMessage(signupMessage);

            const nameInput = document.getElementById("signupName");
            const roleInput = document.getElementById("signupRole");
            const emailInput = document.getElementById("signupEmail");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById("signupConfirmPassword");
            const termsInput = document.getElementById("acceptTerms");
            const termsCheckbox = termsInput ? termsInput.nextElementSibling : null;

            if (termsCheckbox) {
                termsCheckbox.classList.remove("checkbox-error");
            }

            if (!nameInput || !roleInput || !emailInput || !passwordInput || !confirmPasswordInput || !termsInput) {
                showMessage(signupMessage, "Please complete all required fields.");
                return;
            }

            const name = nameInput.value.trim();
            const role = roleInput.value.trim().toLowerCase();
            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!name) {
                showMessage(signupMessage, "Please enter your name.");
                nameInput.focus();
                return;
            }

            if (!isValidSignupName(name)) {
                showMessage(signupMessage, "Name must contain only alphabets (maximum 16 letters, no spaces).");
                nameInput.focus();
                return;
            }

            if (role !== "admin" && role !== "customer") {
                showMessage(signupMessage, "Please select your account role.");
                return;
            }

            if (!email) {
                showMessage(signupMessage, "Please enter your Gmail address.");
                emailInput.focus();
                return;
            }

            if (!isValidGmail(email)) {
                showMessage(signupMessage, "Please enter a valid Gmail address (e.g., yourname@gmail.com).");
                emailInput.focus();
                return;
            }

            if (!password) {
                showMessage(signupMessage, "Please create a strong password.");
                passwordInput.focus();
                return;
            }

            if (!isStrongPassword(password)) {
                showMessage(signupMessage, "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.");
                passwordInput.focus();
                return;
            }

            if (!confirmPassword) {
                showMessage(signupMessage, "Please confirm your password.");
                confirmPasswordInput.focus();
                return;
            }

            if (password !== confirmPassword) {
                showMessage(signupMessage, "Passwords do not match.");
                confirmPasswordInput.focus();
                return;
            }

            if (!termsInput.checked) {
                showMessage(signupMessage, "Please accept the Terms & Conditions and Privacy Policy to proceed.");
                if (termsCheckbox) {
                    termsCheckbox.classList.add("checkbox-error");
                }
                termsInput.focus();
                return;
            }

            const users = getUsers();
            const existingUser = users.find(
                user => user.email && String(user.email).trim().toLowerCase() === email
            );

            if (existingUser) {
                showMessage(signupMessage, "An account with this email already exists.");
                emailInput.focus();
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: role
            };

            users.push(newUser);
            saveUsers(users);

            localStorage.removeItem(LOGIN_EMAIL_KEY);
            localStorage.removeItem(LOGIN_ROLE_KEY);
            localStorage.removeItem(LOGIN_STATUS_KEY);

            // Reset the signup form fields
            signupForm.reset();
            const signupRoleInput = document.getElementById("signupRole");
            const signupSelectedRole = document.getElementById("signupSelectedRole");
            if (signupRoleInput) signupRoleInput.value = "";
            if (signupSelectedRole) signupSelectedRole.textContent = "Select your role";

            // Render to Login page immediately
            showLogin();

            // Populate login credentials for seamless experience
            const loginEmailInput = document.getElementById("loginEmail");
            if (loginEmailInput) {
                loginEmailInput.value = email;
            }
            const loginRoleInput = document.getElementById("loginRole");
            const loginSelectedRole = document.getElementById("loginSelectedRole");
            if (loginRoleInput) {
                loginRoleInput.value = role;
            }
            if (loginSelectedRole) {
                loginSelectedRole.textContent = role === "admin" ? "Admin" : "Client";
            }

            showMessage(loginMessage, "Account created successfully! Please enter your password to login.", "success");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();
            clearMessage(loginMessage);

            const roleInput = document.getElementById("loginRole");
            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const rememberMeInput = document.getElementById("rememberMe");
            const customCheckbox = rememberMeInput ? rememberMeInput.nextElementSibling : null;

            if (customCheckbox) {
                customCheckbox.classList.remove("checkbox-error");
            }

            if (!roleInput || !emailInput || !passwordInput) return;

            const role = roleInput.value.trim().toLowerCase();
            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;

            if (role !== "admin" && role !== "customer") {
                showMessage(loginMessage, "Please select your role.");
                return;
            }

            if (!email) {
                showMessage(loginMessage, "Please enter your Gmail address.");
                emailInput.focus();
                return;
            }

            if (!isValidGmail(email)) {
                showMessage(loginMessage, "Please enter a valid Gmail address (e.g., yourname@gmail.com).");
                emailInput.focus();
                return;
            }

            if (!password) {
                showMessage(loginMessage, "Please enter your password.");
                passwordInput.focus();
                return;
            }

            if (!isStrongPassword(password)) {
                showMessage(loginMessage, "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.");
                passwordInput.focus();
                return;
            }

            if (!rememberMeInput || !rememberMeInput.checked) {
                showMessage(loginMessage, "Please check the 'Remember Me' box to proceed.");
                if (customCheckbox) {
                    customCheckbox.classList.add("checkbox-error");
                }
                if (rememberMeInput) {
                    rememberMeInput.focus();
                }
                return;
            }

            localStorage.setItem(LOGIN_EMAIL_KEY, email);
            localStorage.setItem(LOGIN_ROLE_KEY, role);
            localStorage.setItem(LOGIN_STATUS_KEY, "true");
            localStorage.setItem("rememberMe", "true");

            redirectByRole(role);
        });
    }

    const rememberMeBox = document.getElementById("rememberMe");
    if (rememberMeBox) {
        rememberMeBox.checked = false;
        rememberMeBox.addEventListener("change", () => {
            const customCheckbox = rememberMeBox.nextElementSibling;
            if (customCheckbox) {
                customCheckbox.classList.remove("checkbox-error");
            }
            if (rememberMeBox.checked && loginMessage && loginMessage.textContent.includes("Remember Me")) {
                clearMessage(loginMessage);
            }
        });
    }

    function redirectByRole(role) {
        const cleanRole = String(role).trim().toLowerCase();
        if (cleanRole === "admin") {
            window.location.href = "admin.html";
            return;
        }
        if (cleanRole === "customer") {
            window.location.href = "client.html";
            return;
        }
        showMessage(loginMessage, "Invalid account role.");
    }

    const loginEmailInput = document.getElementById("loginEmail");
    if (loginEmailInput) {
        loginEmailInput.value = "";
        loginEmailInput.removeAttribute("value");
        loginEmailInput.setAttribute("autocomplete", "off");
    }

    if (loginTab && signupTab && loginFormWrapper && signupFormWrapper) {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginFormWrapper.classList.add("active");
        signupFormWrapper.classList.remove("active");
    }
});
