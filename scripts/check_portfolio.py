from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re


class PortfolioParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.elements: list[tuple[str, dict[str, str | None]]] = []
        self.structured_data: list[str] = []
        self.in_json = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        self.elements.append((tag, attributes))
        if tag == "script":
            self.in_json = attributes.get("type") == "application/ld+json"

    def handle_endtag(self, tag: str) -> None:
        if tag == "script":
            self.in_json = False

    def handle_data(self, data: str) -> None:
        if self.in_json:
            self.structured_data.append(data)


def validate(root: Path) -> None:
    required = ["index.html", "assets/styles.css", "assets/refinements.css", "assets/app.js", "assets/Andrzej-Lis-CV.pdf"]
    missing = [name for name in required if not (root / name).is_file()]
    if missing:
        raise ValueError("Missing required files: " + ", ".join(missing))
    html = (root / "index.html").read_text(encoding="utf-8")
    css = "\n".join((root / name).read_text(encoding="utf-8") for name in required if name.endswith(".css"))
    parser = PortfolioParser()
    parser.feed(html)
    identifiers = Counter(attrs["id"] for _, attrs in parser.elements if attrs.get("id"))
    duplicates = [name for name, count in identifiers.items() if count > 1]
    if duplicates:
        raise ValueError("Duplicate IDs: " + ", ".join(duplicates))
    for tag, attrs in parser.elements:
        if tag == "a" and not attrs.get("href"):
            raise ValueError("Anchor without a destination")
        for attribute in ("href", "src"):
            if attribute not in attrs:
                continue
            ref = (attrs[attribute] or "").strip()
            if not ref or ref == "#":
                raise ValueError(f"Empty or placeholder {attribute} on {tag}")
            parsed = urlsplit(ref)
            if parsed.scheme or parsed.netloc:
                if parsed.scheme not in {"https", "mailto", "data"}:
                    raise ValueError(f"Unsupported URL scheme: {ref}")
                continue
            if parsed.path:
                target = (root / unquote(parsed.path)).resolve()
                if not target.is_relative_to(root.resolve()) or not target.is_file():
                    raise ValueError(f"Broken local reference: {ref}")
            elif parsed.fragment and unquote(parsed.fragment) not in identifiers:
                raise ValueError(f"Broken section link: {ref}")
        for target in (attrs.get("aria-labelledby") or "").split():
            if target not in identifiers:
                raise ValueError(f"Missing accessible label: {target}")
        if tag == "img" and not attrs.get("alt"):
            raise ValueError("Image without descriptive alternative text")
        if attrs.get("target") == "_blank" and not {"noreferrer", "noopener"}.intersection((attrs.get("rel") or "").split()):
            raise ValueError("External tab link without isolation")
    person = json.loads("".join(parser.structured_data))
    if person.get("@type") != "Person" or person.get("name") != "Andrzej Lis":
        raise ValueError("Missing or invalid Person structured data")
    checks = {
        "one h1": sum(tag == "h1" for tag, _ in parser.elements) == 1,
        "canonical": 'rel="canonical"' in html,
        "description": 'name="description"' in html,
        "social metadata": 'property="og:title"' in html and 'name="twitter:card"' in html,
        "skip link": 'class="skip-link"' in html and 'id="main" tabindex="-1"' in html,
        "reduced motion": "prefers-reduced-motion" in css,
        "hidden safeguard": '[hidden]:not([hidden="until-found"])' in css,
        "senior positioning": "Senior Java/Kotlin" in html,
        "static projects": all(text in html for text in ("WinRisk", "Spotify Web API Demo", "Fall of Nouraajd", "JVM Experiments")),
        "static experience": "EPAM Systems" in html and "Motorola Solutions" in html,
        "education": "AGH University of Krakow" in html,
        "ci impact": "2h → 30m" in html,
        "no client-rendered data": "portfolio-data.js" not in html,
        "no stale deployment link": 'id="kotlin-live"' not in html,
        "no unfinished copy": not re.search(r"TODO|PLACEHOLDER|Additional studies listed|program and degree are not specified", html),
    }
    failed = [name for name, ok in checks.items() if not ok]
    if failed:
        raise ValueError("Portfolio checks failed: " + ", ".join(failed))
    print(f"Portfolio checks passed: {len(checks)} content checks, {len(identifiers)} unique IDs and all local references.")


if __name__ == "__main__":
    try:
        validate(Path(__file__).resolve().parents[1])
    except (ValueError, OSError) as error:
        raise SystemExit(str(error)) from error
