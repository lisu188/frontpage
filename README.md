# Andrzej Lis — Senior Java/Kotlin Backend Portfolio

**[View the portfolio](https://lisu188.github.io/frontpage/)**

Static GitHub Pages portfolio for Senior Java/Kotlin Backend Engineer roles. It presents professional impact, two backend case studies, systems-level work and a compact career history.

## Content and maintenance

`index.html` is the source of truth for visible content, destinations and metadata. It is complete HTML: project details, experience, contact links, native expandable sections and structured data work without JavaScript. `assets/app.js` only enhances the active navigation state. There is no framework, dependency bundle or build step.

The existing visual system remains in `assets/styles.css`; focused layout and accessibility fixes are in `assets/refinements.css`. The CV is `assets/Andrzej-Lis-CV.pdf`.

Keep professional client work separate from independent projects. Support technical claims with relevant source, test or documentation links. Do not invent missing education details or publish undated, changing project counts. Only add a live-demo link after verifying a working destination; omit unavailable links rather than using `href="#"`.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Validation

```sh
python3 scripts/check_portfolio.py
python3 -m pip install playwright==1.55.0
python3 -m playwright install --with-deps chromium
python3 scripts/test_portfolio.py
```

The browser suite starts its own server and tests the `/frontpage/` deployment prefix. It covers desktop, tablet, mobile and 320-pixel layouts with JavaScript enabled and disabled, keyboard navigation, expandable content, placeholder links, hidden-state styling, missing JavaScript, reduced motion and the actual CV download. Screenshots and layout metrics are written to `artifacts/` and uploaded by CI.

For restricted local render environments, `PORTFOLIO_OFFLINE=1` embeds the supplied styles and script directly into the test document; the HTTP-download test is explicitly skipped. `PORTFOLIO_BROWSER_EXECUTABLE` selects an installed Chromium, and `PORTFOLIO_ARTIFACTS` changes the output directory. CI uses the full HTTP suite, not offline mode.

Before merging, run both checks, review the screenshots, verify new external evidence links, and update visible copy together with relevant metadata.

## Deployment

GitHub Pages deploys directly from the `main` branch and repository root. The published page does not depend on running a content renderer in the visitor's browser.
