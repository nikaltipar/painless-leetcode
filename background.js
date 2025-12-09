// Open random LeetCode problem when toolbar button is clicked
browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: 'https://leetcode.com/problems/random-one-question/all'
  });
});
