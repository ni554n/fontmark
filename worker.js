chrome.runtime.onInstalled.addListener(() => {
  chrome.bookmarks.search("https://fonts.google.com/share?", reset);
});

function reset(bookmarks) {
  chrome.contextMenus.removeAll();
  // chrome.action.disable();

  // for (let i = 0; i < 6; i++) {
  //   chrome.contextMenus.create({
  //     id: `f${i}`,
  //     title: `link #${i}`,
  //     contexts: ["action"],
  //     type: "checkbox",
  //     documentUrlPatterns: ["*://fonts.google.com/*"],
  //     checked: false,
  //     visible: false,
  //   });
  // }

  // for (let i = 0; i < 6; i++) {
  //   chrome.contextMenus.create({
  //     id: `m${i}`,
  //     title: `Menu #${i}`,
  //     contexts: ["action"],
  //     type: "checkbox",
  //     checked: false,
  //   });
  // }

  // for (const { id, title } of bookmarks) {
  //   chrome.contextMenus.create({
  //     id,
  //     title,
  //     contexts: ["action"],
  //     type: "checkbox",
  //     checked: false,
  //   });
  // }

  // // Page actions are disabled by default and enabled on select tabs

  // // Clear all rules to ensure only our expected rules are set
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  //   // Declare a rule to enable the action on example.com pages
  //   let exampleRule = {
  //     conditions: [
  //       new chrome.declarativeContent.PageStateMatcher({
  //         pageUrl: { hostSuffix: "fonts.google.com" },
  //       }),
  //     ],
  //     actions: [new chrome.declarativeContent.ShowAction()],
  //   };

  //   // Finally, apply our new array of rules
  //   let rules = [exampleRule];
  //   chrome.declarativeContent.onPageChanged.addRules(rules);
  // });
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(tabId, JSON.stringify(changeInfo), tab);
// });

chrome.runtime.onStartup.addListener(() => {});

chrome.contextMenus.onClicked.addListener((menuItem, tab) => {

});

chrome.management.onEnabled.addListener(() => {});

// chrome.action.onClicked.addListener((tab) => {
//   // if (!(tab.url ?? "").startsWith("http")) return;
//   // const tabUrl = new URL(tab.url);
// });
