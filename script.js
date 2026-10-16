document.addEventListener("DOMContentLoaded", () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hasObserver = "IntersectionObserver" in window;

    // Browser mendukung animasi berbasis scroll (Chrome, Edge, Safari baru)?
    const hasScrollTimeline =
        typeof CSS !== "undefined" &&
        CSS.supports &&
        CSS.supports("animation-timeline: view()");

    // Peran yang berganti-ganti di Home
    const ROLES = ["Informatics Student", "Mathematics Tutor", "HIMA Secretary 2", "Volunteer"];

    const nav = document.querySelector("nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksBox = document.querySelector(".nav-links");
    const brand = document.querySelector("a.brand");
    const home = document.getElementById("home");
    const toTop = document.querySelector(".to-top");
    const sections = [...document.querySelectorAll("section[id]")];
    const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];

    /* 0. INTRO — tampil sekali per sesi --------------------- */
    const intro = document.querySelector(".intro");

    if (intro) {
        let seen = false;
        try { seen = sessionStorage.getItem("fao-intro") === "1"; } catch (e) {}

        if (seen || prefersReduced) {
            intro.remove();
        } else {
            try { sessionStorage.setItem("fao-intro", "1"); } catch (e) {}
            const killIntro = () => intro.remove();
            const safety = setTimeout(killIntro, 2000);
            intro.addEventListener("animationend", (event) => {
                if (event.target === intro) {
                    clearTimeout(safety);
                    killIntro();
                }
            });
        }
    }

    /* 1. TEKS BERGULIR — muncul naik saat masuk, memudar saat keluar */
    const REVEAL_SELECTOR = "section > *:not(.glow), .stats > div";
    const revealTargets = document.querySelectorAll(REVEAL_SELECTOR);

    revealTargets.forEach((el) => el.classList.add("reveal"));

    if (prefersReduced || !hasObserver) {
        revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else if (hasScrollTimeline) {
        // Semua dikerjakan CSS (animation-timeline: view()), mengikuti gulir jari/mouse
        document.documentElement.classList.add("sd");
    } else {
        // Cadangan untuk browser lama (mis. Firefox): masuk naik, keluar memudar ke atas
        const revealObserver = new IntersectionObserver(
            (entries) => {
                let order = 0;

                entries.forEach((entry) => {
                    const el = entry.target;

                    if (entry.isIntersecting) {
                        el.style.setProperty("--d", `${order++ * 90}ms`);
                        el.classList.add("is-visible");
                        el.classList.remove("is-past");
                    } else if (entry.boundingClientRect.top < 0) {
                        el.style.setProperty("--d", "0ms");
                        el.classList.add("is-past");
                    } else {
                        el.style.setProperty("--d", "0ms");
                        el.classList.remove("is-visible", "is-past");
                    }
                });
            },
            { threshold: 0.05, rootMargin: "-10% 0px -12% 0px" }
        );

        revealTargets.forEach((el) => revealObserver.observe(el));
    }

    /* 2. NAV AKTIF ------------------------------------------- */
    let activeId = "";

    const setActive = (id) => {
        if (!id || id === activeId) return;
        activeId = id;

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    if (hasObserver) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -65% 0px" }
        );

        sections.forEach((section) => navObserver.observe(section));
    }

    /* 3. MENU HP (hamburger) --------------------------------- */
    const closeMenu = () => {
        nav.classList.remove("menu-open");
        document.body.classList.remove("menu-lock");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
    };

    if (navToggle && navLinksBox) {
        navToggle.addEventListener("click", () => {
            const open = nav.classList.toggle("menu-open");
            document.body.classList.toggle("menu-lock", open);
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinksBox.addEventListener("click", (event) => {
            if (event.target.closest("a")) closeMenu();
        });

        if (brand) brand.addEventListener("click", closeMenu);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("menu-open")) {
                closeMenu();
                navToggle.focus();
            }
        });

        const mq = window.matchMedia("(min-width: 1181px)");
        const handleMq = (e) => { if (e.matches) closeMenu(); };
        if (mq.addEventListener) mq.addEventListener("change", handleMq);
        else mq.addListener(handleMq);
    }

    /* 4. SCROLL: nav mengecil, monogram, tombol atas --------- */
    let ticking = false;

    const onScroll = () => {
        const y = window.scrollY;
        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (y / maxScroll).toFixed(4) : 0;

        if (toTop) {
            toTop.style.setProperty("--progress", progress);
            toTop.classList.toggle("visible", y > 600);
        }

        nav.classList.toggle("scrolled", y > 24);

        if (home && !prefersReduced && y < window.innerHeight * 1.5) {
            home.style.setProperty("--monogram-shift", `${(y * 0.18).toFixed(1)}px`);
        }

        if (y < 40) {
            setActive("home");
        } else if (window.innerHeight + y >= doc.scrollHeight - 4) {
            setActive("contact");
        }

        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    onScroll();

    if (toTop) {
        toTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        });
    }

    /* 5. PERAN YANG BERGANTI DI HOME ------------------------- */
    const roleEl = document.querySelector(".role-text");

    if (roleEl && !prefersReduced && ROLES.length > 1) {
        let roleIndex = 0;

        setInterval(() => {
            if (document.hidden) return;

            roleEl.classList.add("swap");
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % ROLES.length;
                roleEl.textContent = ROLES[roleIndex];
                roleEl.classList.remove("swap");
            }, 480);
        }, 3200);
    }

    /* 6. CAHAYA MENGIKUTI KURSOR DI HOME --------------------- */
    if (home && finePointer && !prefersReduced) {
        let frame = 0;
        let gx = 0;
        let gy = 0;

        home.addEventListener("pointermove", (event) => {
            const rect = home.getBoundingClientRect();
            gx = event.clientX - rect.left;
            gy = event.clientY - rect.top;
            home.classList.add("glow-on");

            if (!frame) {
                frame = requestAnimationFrame(() => {
                    home.style.setProperty("--gx", `${gx}px`);
                    home.style.setProperty("--gy", `${gy}px`);
                    frame = 0;
                });
            }
        });

        home.addEventListener("pointerleave", () => {
            home.classList.remove("glow-on");
        });
    }

    /* 7. RIPPLE halus pada tombol ---------------------------- */
    if (!prefersReduced) {
        document.querySelectorAll(".btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement("span");

                ripple.className = "click-ripple";
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;

                btn.appendChild(ripple);
                ripple.addEventListener("animationend", () => ripple.remove());
            });
        });
    }

    /* 8. COPYRIGHT YEAR DINAMIS */
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* 9. FOTO FALLBACK */
    document.querySelectorAll("img[data-remove-on-error]").forEach((img) => {
        img.addEventListener("error", () => img.closest("figure")?.remove(), { once: true });
    });

    /* 10. DARK MODE TOGGLE (sinkron dengan inline script) */
    const themeToggle = document.querySelector(".theme-toggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) {}

            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute("content", next === "dark" ? "#171310" : "#F8F5F0");
        });
    }
});