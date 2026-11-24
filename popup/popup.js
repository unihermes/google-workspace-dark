const DEFAULTS = {
  enabled: true,
  drive: true,
  docs: true,
  slides: true,
  sheets: true,
  sheetsGrid: true,
};

const boxes = [...document.querySelectorAll("input[data-key]")];

function render(settings) {
  for (const box of boxes) box.checked = settings[box.dataset.key];
  document.getElementById("apps").classList.toggle("off", !settings.enabled);
  document.querySelector('[data-key="sheetsGrid"]').closest(".row")
    .classList.toggle("off", !settings.sheets);
}

browser.storage.local.get(DEFAULTS).then(render);

for (const box of boxes) {
  box.addEventListener("change", async () => {
    await browser.storage.local.set({ [box.dataset.key]: box.checked });
    render(await browser.storage.local.get(DEFAULTS));
  });
}
