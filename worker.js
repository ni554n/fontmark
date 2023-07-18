chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "loading" || !changeInfo.url) return;

  const paths = new URL(changeInfo.url).pathname.split("/");
  const specimenIndex = paths.indexOf("specimen");

  let isFontSaved = false;

  if (specimenIndex !== -1) {
    const fontName = paths[specimenIndex + 1];

    const bookmarks = await chrome.bookmarks.search(
      "https://fonts.google.com/share?",
    );

    for (const bookmark of bookmarks) {
      if (bookmark.url?.includes(fontName)) {
        isFontSaved = true;
        break;
      }
    }
  }

  chrome.action.setBadgeText({ tabId, text: isFontSaved ? "✓" : "" });
});
