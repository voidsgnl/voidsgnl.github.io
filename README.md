# BishopSpace

**BishopSpace** is an experimental portfolio and digital environment for [bishopspace.me](https://bishopspace.me). Instead of presenting a conventional grid of projects, the site uses a cursor-reactive signal field, abstract orbital forms, and scroll-triggered transitions to make the portfolio feel like a space to explore.

## Featured project

The portfolio currently features one project: **[Tempus Veritas](https://github.com/voidsgnl/tempus-veritas)**, an early-design digital forensics concept for reconstructing events from raw evidence using competing hypotheses, explicit uncertainty, provenance, and contradiction detection.

## Built with

- Semantic HTML
- Responsive CSS and CSS animations
- Vanilla JavaScript
- Canvas-based interactive background
- GitHub Pages

## Interaction notes

- Move a mouse or trackpad cursor across the page to influence the background field and hero object.
- Scroll to reveal sections and shift the hero environment.
- The Tempus Veritas project panel links to its repository.
- Mobile navigation is collapsible.
- Motion effects respect `prefers-reduced-motion` where practical.

## Local preview

Open `index.html` in a browser, or serve the folder with any static web server.

## Deployment

The site is configured for GitHub Pages with the custom domain in `CNAME`. Changes committed to `main` are available after GitHub Pages finishes publishing.

## Files

- `index.html` — page structure and portfolio content
- `styles.css` — visual system, responsive layout, animations
- `script.js` — navigation, cursor interactions, scroll behavior, canvas field
- `CNAME` — custom domain configuration
