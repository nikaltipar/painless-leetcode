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

// Current settings (loaded async)
let settings = { ...defaultSettings };

// Load settings from storage
async function loadSettings() {
  try {
    const result = await browser.storage.sync.get(defaultSettings);
    settings = result;
  } catch (e) {
    console.log('Error loading settings:', e);
    settings = { ...defaultSettings };
  }
}

// Disable submit shortcut
function setupSubmitBlocker() {
  document.addEventListener('keydown', function(e) {
    if (settings.disableSubmit && e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

// Hide difficulty labels to prevent bias when attempting problems.
function hideDifficulty() {
  if (!settings.hideDifficulty) return;
  
  // Only run on problem list and individual problem pages
  const path = window.location.pathname;
  const isProblemList = path.includes('/problemset');
  const isProblemPage = path.includes('/problems/') && !path.includes('/problems/random');
  
  if (!isProblemList && !isProblemPage) return;

  const difficultySelectors = [
    '.text-sd-easy',
    '.text-sd-medium',
    '.text-sd-hard',
    '[class*="difficulty"]',
    '[class*="Difficulty"]',
  ];

  difficultySelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

// Hide problems that have already been solved.
function hideSolvedProblems() {
  if (!settings.hideSolved || !window.location.pathname.includes('/problemset')) {
    return;
  }

  document.querySelectorAll('[data-icon="check"]').forEach(el => {
    // Try to find the problem row
    let row = el.closest('div[role="row"]');
    
    // Fallback: find a parent that contains a problem link
    if (!row) {
      let parent = el.parentElement;
      while (parent) {
        if (parent.parentElement && parent.parentElement.children.length > 1) {
          const siblings = parent.parentElement.children;
          if (siblings.length > 5) {
            row = parent;
            break;
          }
        }
        parent = parent.parentElement;
      }
    }
    
    if (row) {
      row.style.display = 'none';
    }
  });
}

function applyEnhancements() {
  hideDifficulty();
  hideSolvedProblems();
}

// Initialize
async function init() {
  await loadSettings();
  setupSubmitBlocker();

  // Run on page load and observe for dynamic content changes (React SPA)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEnhancements);
  } else {
    applyEnhancements();
  }

  // Use MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver(() => {
    applyEnhancements();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

// Listen for settings changes
browser.storage.onChanged.addListener((changes) => {
  for (const key of Object.keys(changes)) {
    settings[key] = changes[key].newValue;
  }
  // Re-apply enhancements with new settings
  // Note: For hide features, page reload may be needed to "unhide" elements
});

init();
