// Decides which app this tab is, then toggles classes on <html>.
// All of the actual styling lives in dark.css and is scoped to these classes.

(() => {
  const DEFAULTS = {
    enabled: true,
    drive: true,
    docs: true,
    slides: true,
    sheets: true,
    sheetsGrid: true, // darken the Sheets cell grid too
  };

  function detectApp() {
    const { hostname, pathname } = location;
    if (hostname === "drive.google.com") return "drive";
    if (pathname.startsWith("/document/")) return "docs";
    if (pathname.startsWith("/presentation/")) return "slides";
    if (pathname.startsWith("/spreadsheets/")) return "sheets";
    return null;
  }

  const app = detectApp();
  if (!app) return;

  const root = document.documentElement;
  root.classList.add(`gwd-app-${app}`);

  let current = DEFAULTS;

  function apply(settings) {
    current = settings;
    // Fullscreen elements (Slides "Present", video players) render in the top
    // layer, outside the page-wide filter, so the dark mode is paused while
    // something is fullscreen instead of leaving it half-inverted.
    const on = settings.enabled && settings[app] && !document.fullscreenElement;
    root.classList.toggle("gwd-on", on);
    root.classList.toggle("gwd-light-grid", app === "sheets" && !settings.sheetsGrid);
  }

  document.addEventListener("fullscreenchange", () => apply(current));

  // Apply defaults immediately so the page doesn't flash white while storage loads.
  apply(DEFAULTS);

  browser.storage.local.get(DEFAULTS).then(apply);

  browser.storage.onChanged.addListener((_changes, area) => {
    if (area === "local") browser.storage.local.get(DEFAULTS).then(apply);
  });
})();
