// Chrome/Edge compatibility (Firefox has `browser`, Chrome/Edge have `chrome`)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// Default settings
const defaultSettings = {
  disableSubmit: true,
  hideDifficulty: true,
  hideSolved: true
};

// Disable submit shortcut
function setupSubmitBlocker(enabled) {
  if (!enabled) return;

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

// Add or remove a style element by ID
function setStyle(id, css, enabled) {
  const existing = document.getElementById(id);
  if (enabled && !existing) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  } else if (!enabled && existing) {
    existing.remove();
  }
}

// Apply styles based on current URL
async function applyStyles() {
  const settings = await browser.storage.sync.get(defaultSettings);
  const path = window.location.pathname;
  const isProblemListPage = path.includes('/problemset');
  const isProblemPage = path.includes('/problems/');

  // Hide difficulty labels
  setStyle('painless-hide-difficulty', `
    .text-sd-easy,
    .text-sd-medium,
    .text-sd-hard,
    [class*="difficulty"],
    [class*="Difficulty"] {
      display: none !important;
    }
  `, settings.hideDifficulty && (isProblemListPage || isProblemPage));

  // Hide solved problems
  setStyle('painless-hide-solved', `
    a[href^="/problems/"][id]:has([data-icon="check"]) {
      display: none !important;
    }
  `, settings.hideSolved && (isProblemListPage || isProblemPage));
}

// Watch for SPA navigation
let lastPath = location.pathname;
new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    applyStyles();
  }
}).observe(document, { subtree: true, childList: true });

// Initialize
async function init() {
  const settings = await browser.storage.sync.get(defaultSettings);
  setupSubmitBlocker(settings.disableSubmit);
  applyStyles();
}

init();
