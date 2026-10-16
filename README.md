# Fadhilah Ayu — Portfolio

Personal portfolio website of **Fadhilah Ayu**, Informatics student at Universitas Bina Sarana Informatika (UBSI).

**Live site:** https://fadhilahayuo.github.io/Fadhilah_Ayu_Portfolio/

Designed with an editorial look in ivory, ink black, and bronze — with light and dark mode.

## Sections

Home · About Me · Education · Skills · Currently Learning · Projects · Experience · Organization · Volunteer & Committee · Certificates & Achievements · Contact

## Features

- Scroll-driven text animation: content rises and fades in, then fades out as it leaves the top of the screen (with a fallback for older browsers)
- Light / dark mode that remembers the visitor's choice
- Rotating role line in the hero section
- Photo galleries and certificate links for volunteer activities (Fancybox lightbox)
- Responsive layout with a full-screen mobile menu
- Back-to-top button with a scroll progress ring
- Respects `prefers-reduced-motion` and includes a skip link, focus styles, and print styles
- Open Graph / Twitter preview image and structured data (JSON-LD)

## Built with

- HTML, CSS, and vanilla JavaScript — no framework, no build step
- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) and [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- [Fancybox](https://fancyapps.com/fancybox/) for the photo lightbox (see its license for terms of use)

## Project structure

```
├── index.html
├── style.css
├── script.js
├── fancybox.css
├── fancybox.umd.js
├── favicon.svg
├── og-image.png         # link preview image (1200×630)
├── foto.jpg             # portrait shown in About Me
├── project-2.png        # screenshot used in Projects
├── images/              # volunteer photos
└── documents/           # certificate PDFs
```

## Run locally

No installation needed. Download or clone the repository and open `index.html` in a browser.

```bash
git clone https://github.com/fadhilahayuo/Fadhilah_Ayu_Portfolio.git
cd Fadhilah_Ayu_Portfolio
```

For a local server (optional):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Customize

- **Colors and fonts:** edit the variables in `:root` at the top of `style.css`.
- **Rotating roles:** edit the `ROLES` list at the top of `script.js`.
- **Content:** edit the matching section in `index.html`.
- **Download CV button:** put `cv.pdf` in the root folder, then remove the comment markers around the "Download CV" link in the Home section.

## Deploy with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder, then save.
4. The site will be available at `https://fadhilahayuo.github.io/Fadhilah_Ayu_Portfolio/` after a minute or two.

## Contact

- Email: ayufadhilah55@gmail.com
- GitHub: [@fadhilahayuo](https://github.com/fadhilahayuo)
- LinkedIn: [Fadhilah Ayu](https://id.linkedin.com/in/fadhilah-ayu-1aaaa4353)
- Instagram: [@yu.fxah_dila](https://instagram.com/yu.fxah_dila)

---

© Fadhilah Ayu. All rights reserved. Photos and certificates are personal documents and are not licensed for reuse.
