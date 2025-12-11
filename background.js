// Chrome/Edge compatibility (Firefox has `browser`, Chrome/Edge have `chrome`)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// background.js
browser.action.onClicked.addListener(async () => {
  const granted = await browser.permissions.request({
    origins: ["*://*.leetcode.com/*"]
  });

  if (granted) {
    // Permission granted, now you can safely open tab or access content
    browser.tabs.create({ url: "https://leetcode.com/problems/random/" });
  } else {
    console.log("User denied host permission");
  }
});

// Open random LeetCode problem when toolbar button is clicked
browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: 'https://leetcode.com/problems/random-one-question/all'
  });
});
