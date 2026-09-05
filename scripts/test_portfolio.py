from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from urllib.parse import urlsplit
import json
import os
import shutil
import unittest

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OFFLINE = os.environ.get("PORTFOLIO_OFFLINE") == "1"
OUTPUT = Path(os.environ.get("PORTFOLIO_ARTIFACTS", str(ROOT / "artifacts")))
VIEWPORTS = {"desktop": (1440, 1200), "tablet": (768, 1024), "mobile": (390, 844), "narrow": (320, 740)}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        pass


class PortfolioBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        OUTPUT.mkdir(parents=True, exist_ok=True)
        cls.metrics: list[dict] = []
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        options = {}
        if executable := os.environ.get("PORTFOLIO_BROWSER_EXECUTABLE"):
            options["executable_path"] = executable
        cls.browser = cls.playwright.chromium.launch(**options)
        cls.addClassCleanup(cls.browser.close)
        if not OFFLINE:
            cls.site = TemporaryDirectory()
            cls.addClassCleanup(cls.site.cleanup)
            destination = Path(cls.site.name) / "frontpage"
            destination.mkdir()
            shutil.copy2(ROOT / "index.html", destination / "index.html")
            shutil.copytree(ROOT / "assets", destination / "assets")
            cls.server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=cls.site.name))
            cls.addClassCleanup(cls.server.server_close)
            cls.addClassCleanup(cls.server.shutdown)
            Thread(target=cls.server.serve_forever, daemon=True).start()
            cls.base_url = f"http://127.0.0.1:{cls.server.server_port}/frontpage/"

    @classmethod
    def tearDownClass(cls) -> None:
        (OUTPUT / "layout-metrics.json").write_text(json.dumps({"offline": OFFLINE, "viewports": cls.metrics}, indent=2) + "\n", encoding="utf-8")

    def open_page(self, name: str = "mobile", javascript: bool = True, block_script: bool = False):
        width, height = VIEWPORTS[name]
        context = self.browser.new_context(viewport={"width": width, "height": height}, java_script_enabled=javascript, reduced_motion="reduce")
        self.addCleanup(context.close)
        page = context.new_page()
        page.set_default_timeout(5000)
        page.errors = []
        page.failures = []
        page.on("pageerror", lambda error: page.errors.append(str(error)))
        page.on("requestfailed", lambda request: page.failures.append(request.url))
        page.on("response", lambda response: page.failures.append(f"{response.status}: {response.url}") if response.status >= 400 else None)
        if OFFLINE:
            html = (ROOT / "index.html").read_text(encoding="utf-8")
            for style in ("assets/styles.css", "assets/refinements.css"):
                html = html.replace(f'<link rel="stylesheet" href="{style}">', f'<style>{(ROOT / style).read_text(encoding="utf-8")}</style>')
            script = "" if block_script else f'<script>{(ROOT / "assets/app.js").read_text(encoding="utf-8")}</script>'
            html = html.replace('<script src="assets/app.js" defer></script>', script)
            page.set_content(html)
        else:
            if block_script:
                page.route("**/assets/app.js", lambda route: route.abort())
            response = page.goto(self.base_url, wait_until="networkidle")
            self.assertEqual(response.status, 200)
        return page

    def assert_no_overflow(self, page) -> None:
        self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), page.viewport_size["width"])

    def test_responsive_content_with_and_without_javascript(self) -> None:
        for name, (_, height) in VIEWPORTS.items():
            for javascript in (True, False):
                with self.subTest(viewport=name, javascript=javascript):
                    page = self.open_page(name, javascript)
                    expect(page.locator("h1")).to_contain_text("Senior Java/Kotlin")
                    expect(page.locator("#hero-track-record")).to_be_visible()
                    expect(page.locator("#flagship-title")).to_have_text("WinRisk")
                    expect(page.locator("#kotlin-title")).to_have_text("Spotify Web API Demo")
                    self.assertEqual(page.locator("#work > .wrap > article > .case-grid h3, #work > .wrap > article > h3").all_text_contents(), ["WinRisk", "Spotify Web API Demo", "Fall of Nouraajd"])
                    for identifier in ("cv-top", "linkedin-top", "email-top"):
                        control = page.locator(f"#{identifier}")
                        expect(control).to_be_visible()
                        box = control.bounding_box()
                        self.assertLessEqual(box["y"] + box["height"], height)
                        self.assertGreaterEqual(box["height"], 44)
                    for link in page.locator(".nav-links a").all():
                        expect(link).to_be_visible()
                        self.assertGreaterEqual(link.bounding_box()["height"], 44)
                    self.assert_no_overflow(page)
                    page_height = page.evaluate("document.documentElement.scrollHeight")
                    self.assertLess(page_height, 10000)
                    self.metrics.append({"viewport": name, "javascript": javascript, "width": page.viewport_size["width"], "height": page_height})
                    if javascript and name in ("desktop", "mobile"):
                        page.screenshot(path=str(OUTPUT / f"frontpage-{name}-top.png"))
                        page.screenshot(path=str(OUTPUT / f"frontpage-{name}.png"), full_page=True)
                    self.assertEqual(page.errors, [])
                    self.assertEqual(page.failures, [])
                    page.context.close()

    def test_navigation_and_keyboard_access(self) -> None:
        for javascript in (True, False):
            with self.subTest(javascript=javascript):
                page = self.open_page(javascript=javascript)
                page.keyboard.press("Tab")
                expect(page.locator(".skip-link")).to_be_focused()
                page.keyboard.press("Enter")
                expect(page.locator("#main")).to_be_focused()
                for section in ("work", "experience", "contact"):
                    link = page.locator(f'.nav-links a[href="#{section}"]')
                    link.click()
                    self.assertEqual(urlsplit(page.url).fragment, section)
                    heading = page.locator(f"#{section}-title").bounding_box()
                    self.assertGreaterEqual(heading["y"], page.locator(".nav").bounding_box()["height"] - 1)
                    if javascript:
                        expect(link).to_have_attribute("aria-current", "location")
                summary = page.locator("#earlier-experience > summary")
                summary.focus()
                page.keyboard.press("Enter")
                expect(page.locator("#earlier-experience")).to_have_attribute("open", "")
                expect(page.get_by_text("Motorola Solutions · Unified Event Manager", exact=True)).to_be_visible()
                while page.locator("details:not([open]) > summary").count():
                    page.locator("details:not([open]) > summary").first.click()
                self.assert_no_overflow(page)
                self.assertEqual(page.errors, [])

    def test_destinations_and_images(self) -> None:
        page = self.open_page()
        self.assertEqual(page.locator('a:not([href]), a[href=""], a[href="#"]').count(), 0)
        self.assertEqual(page.locator("#kotlin-live").count(), 0)
        self.assertEqual(page.get_by_text("Open live deployment", exact=False).count(), 0)
        for location in ("top", "bottom"):
            expect(page.locator(f"#cv-{location}")).to_have_attribute("href", "assets/Andrzej-Lis-CV.pdf")
            expect(page.locator(f"#linkedin-{location}")).to_have_attribute("href", "https://www.linkedin.com/in/andrzej-lis-1b4830a6/")
            expect(page.locator(f"#email-{location}")).to_have_attribute("href", "mailto:andrzej.lis3@gmail.com")
        for image in page.locator("img").all():
            self.assertTrue(image.evaluate("image => image.complete && image.naturalWidth > 0"))
        expect(page.locator('svg[role="img"]')).to_have_count(2)
        self.assertEqual(page.errors, [])
        self.assertEqual(page.failures, [])

    def test_hidden_attribute_overrides_display_style(self) -> None:
        page = self.open_page()
        page.evaluate("""() => {
            const link = document.createElement('a');
            link.id = 'hidden-regression';
            link.className = 'text-link';
            link.href = 'https://example.com/';
            link.textContent = 'Unavailable deployment';
            link.hidden = true;
            document.querySelector('#spotify').append(link);
        }""")
        expect(page.locator("#hidden-regression")).to_be_hidden()
        page.locator("#hidden-regression").evaluate("link => link.hidden = false")
        expect(page.locator("#hidden-regression")).to_be_visible()

    def test_unavailable_enhancement_keeps_content(self) -> None:
        page = self.open_page(block_script=True)
        for selector in ("#hero-summary", "#flagship-title", "#kotlin-title", "#experience-title", "#contact-title"):
            expect(page.locator(selector)).to_be_visible()
        expect(page.locator("#linkedin-bottom")).to_have_attribute("href", "https://www.linkedin.com/in/andrzej-lis-1b4830a6/")
        self.assertEqual(page.errors, [])
        self.assert_no_overflow(page)

    def test_reduced_motion(self) -> None:
        page = self.open_page()
        self.assertEqual(page.evaluate("getComputedStyle(document.documentElement).scrollBehavior"), "auto")

    @unittest.skipIf(OFFLINE, "HTTP download is covered by the normal CI run; offline mode only renders supplied assets")
    def test_cv_download_from_pages_subdirectory(self) -> None:
        page = self.open_page()
        self.assertEqual(page.failures, [])
        with page.expect_download() as event:
            page.locator("#cv-top").click()
        download = event.value
        self.assertEqual(download.suggested_filename, "Andrzej-Lis-CV.pdf")
        self.assertEqual(Path(download.path()).read_bytes(), (ROOT / "assets/Andrzej-Lis-CV.pdf").read_bytes())


if __name__ == "__main__":
    unittest.main(verbosity=2)
