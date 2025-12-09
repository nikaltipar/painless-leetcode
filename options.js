const defaultSettings = {
  disableSubmit: true,
  hideDifficulty: true,
  hideSolved: true
};

// Load settings from storage
async function loadSettings() {
  const result = await browser.storage.sync.get(defaultSettings);
  
  document.getElementById('disableSubmit').checked = result.disableSubmit;
  document.getElementById('hideDifficulty').checked = result.hideDifficulty;
  document.getElementById('hideSolved').checked = result.hideSolved;
}

// Save settings to storage
async function saveSettings() {
  const settings = {
    disableSubmit: document.getElementById('disableSubmit').checked,
    hideDifficulty: document.getElementById('hideDifficulty').checked,
    hideSolved: document.getElementById('hideSolved').checked
  };
  
  await browser.storage.sync.set(settings);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadSettings);

// Save on any toggle change
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', saveSettings);
});
