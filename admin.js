document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const sidebar = document.getElementById("adminSidebar");
    const hamburger = document.getElementById("hamburgerButton");
    const closeButton = document.getElementById("sidebarClose");
    const overlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");
    const adminEmail = document.getElementById("adminEmail");

    /* =====================================================
       LOCAL STORAGE KEYS
    ====================================================== */

    const EMAIL_KEY = "loggedInEmail";
    const ROLE_KEY = "loggedInRole";
    const STATUS_KEY = "isLoggedIn";

    /* =====================================================
       GET LOGIN DATA
    ====================================================== */

    const email = localStorage.getItem(EMAIL_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    const loggedIn = localStorage.getItem(STATUS_KEY);

    const isClientPage = window.location.pathname.toLowerCase().endsWith("client.html");

    /* =====================================================
       PORTAL LOGIN PROTECTION
    ====================================================== */

    if (isClientPage) {
        if (loggedIn !== "true" || (role !== "customer" && role !== "admin") || !email) {
            window.location.replace("index.html");
            return;
        }
    } else {
        if (loggedIn !== "true" || role !== "admin" || !email) {
            window.location.replace("index.html");
            return;
        }
    }

    /* =====================================================
       DISPLAY LOGGED-IN EMAIL
    ====================================================== */

    if (adminEmail) {
        adminEmail.textContent = email;
    }

    /* =====================================================
       OPEN / CLOSE SIDEBAR
    ====================================================== */

    function openSidebar() {
        if (sidebar) sidebar.classList.add("open");
        if (overlay) overlay.classList.add("active");
        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    }

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            openSidebar();
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            closeSidebar();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            closeSidebar();
        });
    }

    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeSidebar();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    /* =====================================================
       LOGOUT
    ====================================================== */

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem(EMAIL_KEY);
            localStorage.removeItem(ROLE_KEY);
            localStorage.removeItem(STATUS_KEY);
            closeSidebar();
            window.location.replace("index.html");
        });
    }

    /* =====================================================
       SETTINGS FORM HANDLER (IF ON SETTINGS.HTML)
    ====================================================== */

    const settingsForm = document.getElementById("portalSettingsForm");
    const settingsMessage = document.getElementById("settingsSaveMessage");
    if (settingsForm && settingsMessage) {
        settingsForm.addEventListener("submit", function (event) {
            event.preventDefault();
            settingsMessage.textContent = "Conference portal settings saved successfully!";
            settingsMessage.style.display = "block";
            setTimeout(function () {
                settingsMessage.style.display = "none";
            }, 3500);
        });
    }

    /* =====================================================
       PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN ON MOBILE
    ====================================================== */

    function handleBodyScroll() {
        if (sidebar && sidebar.classList.contains("open")) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
    }

    if (sidebar) {
        const observer = new MutationObserver(function () {
            handleBodyScroll();
        });

        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    window.addEventListener("resize", function () {
        if (window.innerWidth > 992) {
            closeSidebar();
        }
    });

    /* =====================================================
       CLIENT PORTAL DYNAMIC TAB ROUTING & SWITCHING
    ====================================================== */

    const portalViews = document.querySelectorAll(".portal-view");
    const portalTabs = document.querySelectorAll("[data-portal-tab]");
    const topbarTitleSpan = document.querySelector(".topbar-title span");

    const viewTitles = {
        overview: "Client Conference Portal — My Summit Overview",
        alerts: "Client Conference Portal — Updates & Alerts",
        speakers: "Client Conference Portal — Stage & Speakers",
        delegates: "Client Conference Portal — Delegate Registrations",
        proposals: "Client Conference Portal — Approved Proposals",
        contact: "Client Conference Portal — Contact Producer",
        website: "Client Conference Portal — Public Summit Website"
    };

    function switchPortalView(tabKey, updateHash = true) {
        if (!portalViews.length) return;

        const targetView = document.getElementById("view-" + tabKey);
        if (!targetView) return;

        // Hide all views
        portalViews.forEach(view => {
            view.classList.remove("active");
        });

        // Show target view
        targetView.classList.add("active");

        // Update active sidebar tab
        portalTabs.forEach(tab => {
            if (tab.getAttribute("data-portal-tab") === tabKey) {
                tab.classList.add("active");
            } else if (tab.classList.contains("sidebar-link")) {
                tab.classList.remove("active");
            }
        });

        // Update topbar title
        if (topbarTitleSpan && viewTitles[tabKey]) {
            topbarTitleSpan.textContent = viewTitles[tabKey];
        }

        // Update URL hash
        if (updateHash) {
            window.location.hash = tabKey;
        }

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (portalTabs.length && portalViews.length) {
        portalTabs.forEach(tab => {
            tab.addEventListener("click", function (event) {
                const tabKey = this.getAttribute("data-portal-tab");
                if (tabKey) {
                    event.preventDefault();
                    switchPortalView(tabKey, true);
                    closeSidebar();
                }
            });
        });

        // Check hash on page load
        function handleInitialHash() {
            const hash = window.location.hash.replace("#", "").toLowerCase();
            if (hash && viewTitles[hash]) {
                switchPortalView(hash, false);
            }
        }

        handleInitialHash();
        window.addEventListener("hashchange", handleInitialHash);
    }

    /* =====================================================
       PRODUCER DISPATCH FORM (CLIENT PORTAL)
    ====================================================== */

    const producerForm = document.getElementById("producerDispatchForm");
    const producerFeedback = document.getElementById("producerFormFeedback");

    if (producerForm) {
        producerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            window.location.href = "404-client.html";
        });
    }

    /* =====================================================
       DELEGATE REAL-TIME SEARCH (CLIENT PORTAL)
    ====================================================== */

    const delegateSearch = document.getElementById("delegateSearchInput");
    const delegatesTable = document.getElementById("delegatesTable");

    if (delegateSearch && delegatesTable) {
        delegateSearch.addEventListener("input", function () {
            const query = this.value.toLowerCase().trim();
            const rows = delegatesTable.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

});
