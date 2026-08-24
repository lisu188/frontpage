from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
required = [
    root / "index.html",
    root / "assets" / "styles.css",
    root / "assets" / "portfolio-data.js",
    root / "assets" / "app.js",
    root / "assets" / "Andrzej-Lis-CV.pdf",
]
missing = [str(p.relative_to(root)) for p in required if not p.exists()]
if missing:
    raise SystemExit("Missing required files: " + ", ".join(missing))

html = (root / "index.html").read_text(encoding="utf-8")
data = (root / "assets" / "portfolio-data.js").read_text(encoding="utf-8")
css = (root / "assets" / "styles.css").read_text(encoding="utf-8")

checks = {
    "canonical": 'rel="canonical"' in html,
    "description": 'name="description"' in html,
    "opengraph": 'property="og:title"' in html and 'property="og:image"' in html,
    "twitter": 'name="twitter:card"' in html,
    "structured data": 'type="application/ld+json"' in html,
    "skip link": 'class="skip-link"' in html,
    "reduced motion": "prefers-reduced-motion" in css,
    "senior positioning": "Senior Software Engineer" in data,
    "java kotlin positioning": "Java / Kotlin Backend Engineer" in data,
    "cv link": "Andrzej-Lis-CV.pdf" in data,
    "winrisk": "WinRisk" in data,
    "spotify": "Spotify Web API Demo" in data,
    "jvm experiments": "JVM Experiments" in data,
    "education": "AGH University of Krakow" in data,
    "ci impact": "2h → 30m" in data,
}

failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("Portfolio checks failed: " + ", ".join(failed))

local_refs = re.findall(r'(?:src|href)="([^"]+)"', html)
for ref in local_refs:
    if ref.startswith(("http://", "https://", "mailto:", "#")) or ref == "":
        continue
    target = root / ref.split("#", 1)[0]
    if not target.exists():
        raise SystemExit(f"Broken local reference: {ref}")

if "TODO" in html or "PLACEHOLDER" in html or "TODO" in data:
    raise SystemExit("Remove TODO/PLACEHOLDER content before publishing")

print("Portfolio checks passed.")
