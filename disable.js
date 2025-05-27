document.addEventListener('keydown', function(e) {
  // Disable submit shortcut.
  // This will prevent accidental code submissions and maintain your acceptance rate.
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);