/* =========================================================
   STACKLY EVENT & CONFERENCE MANAGEMENT
   COMPLETE WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       AOS ANIMATION
    ========================================================= */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            easing: "ease-out-cubic",
            once: true,
            offset: 100,
            mirror: false
        });
    }

    /* =========================================================
       HEADER SCROLL EFFECT
    ========================================================= */

    const header = document.getElementById("header");

    if (header) {
        function handleHeaderScroll() {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        handleHeaderScroll();
        window.addEventListener("scroll", handleHeaderScroll);
    }

    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const hamburger = document.getElementById("hamburger");
    const closeMenu = document.getElementById("closeMenu");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    if (hamburger && closeMenu && mobileMenu && menuOverlay) {

        function openMobileMenu() {
            mobileMenu.classList.add("active");
            menuOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove("active");
            menuOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }

        hamburger.addEventListener("click", openMobileMenu);
        closeMenu.addEventListener("click", closeMobileMenu);
        menuOverlay.addEventListener("click", closeMobileMenu);

        const mobileLinks = document.querySelectorAll(".mobile-nav a");
        mobileLinks.forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });
    }

    /* =========================================================
       HERO VIDEO SLIDER
       Only runs on pages containing hero videos
    ========================================================= */

    const videos = document.querySelectorAll(".hero-video");
    const dots = document.querySelectorAll(".video-dot");

    if (videos.length > 0) {
        let currentVideo = 0;
        let videoTimer = null;

        function showVideo(index) {
            if (index < 0) {
                index = videos.length - 1;
            }
            if (index >= videos.length) {
                index = 0;
            }

            videos.forEach(function (video, i) {
                video.classList.remove("active");
                if (i !== index) {
                    video.pause();
                    try {
                        video.currentTime = 0;
                    } catch (error) {
                        /* Ignore video reset errors */
                    }
                }
            });

            dots.forEach(function (dot) {
                dot.classList.remove("active");
            });

            const activeVideo = videos[index];
            if (!activeVideo) {
                return;
            }

            activeVideo.classList.add("active");

            if (dots[index]) {
                dots[index].classList.add("active");
            }

            const playPromise = activeVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(function () {
                    /* Browser autoplay restriction */
                });
            }

            currentVideo = index;

            if (videoTimer) {
                clearTimeout(videoTimer);
            }

            videoTimer = setTimeout(nextVideo, 8000);
        }

        function nextVideo() {
            showVideo((currentVideo + 1) % videos.length);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-video"), 10);
                if (!isNaN(index)) {
                    showVideo(index);
                }
            });
        });

        videos.forEach(function (video, index) {
            video.addEventListener("ended", function () {
                if (index === currentVideo) {
                    nextVideo();
                }
            });
        });

        showVideo(0);
    }

    /* =========================================================
       FOOTER NEWSLETTER
    ========================================================= */

    const newsletterForm = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("footer-email");
    const newsletterMessage = document.getElementById("newsletterMessage");

    if (newsletterForm && emailInput && newsletterMessage) {
        emailInput.addEventListener("input", function () {
            if (newsletterMessage.classList.contains("newsletter-error")) {
                newsletterMessage.textContent = "";
                newsletterMessage.classList.remove("newsletter-error");
            }
        });

        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = emailInput.value.trim();

            newsletterMessage.textContent = "";
            newsletterMessage.classList.remove("newsletter-success", "newsletter-error");

            if (email === "") {
                newsletterMessage.textContent = "Please enter your Gmail address.";
                newsletterMessage.classList.add("newsletter-error");
                emailInput.focus();
                return;
            }

            const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
            if (!gmailPattern.test(email)) {
                newsletterMessage.textContent = "Please enter a valid Gmail address (e.g., yourname@gmail.com).";
                newsletterMessage.classList.add("newsletter-error");
                emailInput.focus();
                return;
            }

            // Valid Gmail provided - render to 404 page
            window.location.href = "404.html";
        });
    }

    /* =========================================================
       FOOTER LINKS RENDER TO 404
    ========================================================= */

    document.querySelectorAll(".wedding-footer a, footer a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "404.html";
        });
    });

    /* =========================================================
       BACK TO TOP
    ========================================================= */

    const backTopButton = document.getElementById("footerBackTop");

    if (backTopButton) {
        function updateBackTopButton() {
            if (window.scrollY > 300) {
                backTopButton.style.opacity = "1";
                backTopButton.style.visibility = "visible";
                backTopButton.style.pointerEvents = "auto";
            } else {
                backTopButton.style.opacity = "0";
                backTopButton.style.visibility = "hidden";
                backTopButton.style.pointerEvents = "none";
            }
        }

        updateBackTopButton();
        window.addEventListener("scroll", updateBackTopButton);

        backTopButton.addEventListener("click", function (event) {
            event.preventDefault();
            const headerEl = document.getElementById("header");
            if (headerEl) {
                headerEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    /* =========================================================
       FOOTER YEAR
    ========================================================= */

    const footerYear = document.getElementById("footerYear");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    /* =========================================================
       PREVENT BROKEN BACK-TO-TOP HASH
    ========================================================= */

    const footerBackTop = document.querySelector(".footer-back-top");
    if (footerBackTop) {
        footerBackTop.setAttribute("href", "#header");
    }

    /* =========================================================
       ESC KEY - CLOSE MOBILE MENU
    ========================================================= */

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            const mobileMenuEl = document.getElementById("mobileMenu");
            const menuOverlayEl = document.getElementById("menuOverlay");

            if (mobileMenuEl && menuOverlayEl) {
                mobileMenuEl.classList.remove("active");
                menuOverlayEl.classList.remove("active");
                document.body.style.overflow = "";
            }
        }
    });
});


/* =========================================================
   SPECIAL CONFERENCE SERVICES IMAGE SLIDER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const serviceImages = document.querySelectorAll(".special-service-image img");
    const serviceItems = document.querySelectorAll(".special-service-item");

    if (!serviceImages.length) return;

    let currentImage = 0;

    serviceImages.forEach((image, index) => {
        image.classList.remove("active");
        if (index === 0) {
            image.classList.add("active");
        }
    });

    function showServiceImage(index) {
        serviceImages.forEach((image, imageIndex) => {
            image.classList.toggle("active", imageIndex === index);
        });
    }

    setInterval(() => {
        currentImage++;
        if (currentImage >= serviceImages.length) {
            currentImage = 0;
        }
        showServiceImage(currentImage);
    }, 3000);

    serviceItems.forEach((item, index) => {
        item.addEventListener("mouseenter", function () {
            if (index < serviceImages.length) {
                currentImage = index;
                showServiceImage(currentImage);
            }
        });
    });
});


/* =========================================================
   CONFERENCE CONSULTATION FORM VALIDATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const consultationForm = document.getElementById("consultationForm");
    const consultationMessage = document.getElementById("consultationMessage");
    const nameInput = document.getElementById("couple-name");
    const emailInput = document.getElementById("couple-email");
    const phoneInput = document.getElementById("couple-phone");
    const dateInput = document.getElementById("wedding-date");
    const guestInput = document.getElementById("guest-count");
    const weddingTypeInput = document.getElementById("wedding-type");
    const messageInput = document.getElementById("wedding-message");

    if (!consultationForm || !dateInput || !nameInput || !phoneInput) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    dateInput.min = todayString;

    nameInput.addEventListener("keydown", function (e) {
        if (e.key === " " || e.code === "Space") {
            e.preventDefault();
        }
    });

    nameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z]/g, "").slice(0, 16);
    });

    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });

    consultationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        consultationMessage.textContent = "";
        consultationMessage.className = "consultation-message";

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const conferenceDate = dateInput.value;
        const delegateCount = guestInput.value;
        const conferenceType = weddingTypeInput.value;
        const conferenceMessage = messageInput.value.trim();

        // 1. Name: mandatory, alphabets only, max 16 letters, no spaces
        if (name === "") {
            showError("Please enter your name.");
            nameInput.focus();
            return;
        }

        if (/\s/.test(name)) {
            showError("Name should not contain spaces.");
            nameInput.focus();
            return;
        }

        if (!/^[A-Za-z]{1,16}$/.test(name)) {
            showError("Name should contain alphabets only (maximum 16 letters, no spaces).");
            nameInput.focus();
            return;
        }

        // 2. Gmail: mandatory, strict @gmail.com format
        if (email === "") {
            showError("Please enter your Gmail address.");
            emailInput.focus();
            return;
        }

        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailPattern.test(email)) {
            showError("Please enter a valid Gmail address (e.g., username@gmail.com).");
            emailInput.focus();
            return;
        }

        // 3. Phone: mandatory, numbers only, exactly 10 digits
        if (phone === "") {
            showError("Please enter your contact phone number.");
            phoneInput.focus();
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            showError("Phone number must contain exactly 10 digits.");
            phoneInput.focus();
            return;
        }

        // 4. Target Event Date: mandatory
        if (conferenceDate === "") {
            showError("Please select your target conference date.");
            dateInput.focus();
            return;
        }

        const selectedDate = new Date(conferenceDate + "T00:00:00");
        const currentDate = new Date(todayString + "T00:00:00");

        if (selectedDate < currentDate) {
            showError("Please select today or a future conference date.");
            dateInput.focus();
            return;
        }

        const selectedYear = selectedDate.getFullYear();
        if (selectedYear < year) {
            showError("Please select a valid future year.");
            dateInput.focus();
            return;
        }

        // 5. Expected Delegates: mandatory
        if (delegateCount === "") {
            showError("Please select the expected number of delegates.");
            guestInput.focus();
            return;
        }

        // 6. Conference Format: mandatory
        if (conferenceType === "") {
            showError("Please select your conference format.");
            weddingTypeInput.focus();
            return;
        }

        // 7. Event Scope & Requirements: mandatory
        if (conferenceMessage === "") {
            showError("Please share details about your conference objectives and requirements.");
            messageInput.focus();
            return;
        }

        // All details valid - redirect to 404 page
        window.location.href = "404.html";
    });

    function showError(message) {
        consultationMessage.textContent = message;
        consultationMessage.classList.add("error");
    }
});
