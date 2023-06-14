chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading" || !changeInfo.url) return;

  const paths = new URL(changeInfo.url).pathname.split("/");
  const specimenIndex = paths.indexOf("specimen");

  if (specimenIndex !== -1) {
    chrome.bookmarks.search("https://fonts.google.com/share?", (bookmarks) => {
      const fontName = paths[specimenIndex + 1];

      for (const bookmark of bookmarks) {
        if (bookmark.url?.includes(fontName)) {
          chrome.action.setBadgeText({ tabId, text: "✓" });
          break;
        }
      }
    });
  }
});
