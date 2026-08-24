# Andrzej Lis — Senior Java/Kotlin Backend Portfolio

Static GitHub Pages portfolio focused on Senior Software Engineer / Senior Backend Engineer roles.

## Positioning

The portfolio is intentionally ordered by evidence:

1. Java/Kotlin backend specialization
2. Current JVM case studies
3. Professional engineering impact
4. System-design decisions
5. Broader systems, reverse-engineering, simulation and ML interests
6. Education and continued learning

## Content sources

- `assets/portfolio-data.js` is the single source of truth for page content.
- CV facts are based on `assets/Andrzej-Lis-CV.pdf`.
- Public professional-profile data is linked to LinkedIn.
- Project claims should be backed by public repository READMEs or source.

Do not add unsupported metrics or infer missing education fields.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Validation

```sh
python3 scripts/check_portfolio.py
```

The CI workflow also renders desktop and mobile screenshots with Playwright and uploads them as artifacts.

## Updating content

1. Edit `assets/portfolio-data.js`.
2. Keep `index.html` structural; do not duplicate factual project/experience copy there unless needed for metadata or progressive rendering.
3. Run `python3 scripts/check_portfolio.py`.
4. Preview at desktop and mobile widths.
5. Verify external project and profile links before merging.

## Deployment

GitHub Pages can deploy directly from the `main` branch and repository root.
