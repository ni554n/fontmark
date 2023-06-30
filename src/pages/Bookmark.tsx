import type { Component } from "solid-js";
import { type JSX } from "solid-js/jsx-runtime";
import {
  FontList,
  bookmarks,
  isEditing,
  setBookmarks,
} from "../components/FontList";
import { Header } from "../components/Header";
import { animateRipple } from "../components/utils";

const Bookmark: Component<{ fontName: string; tabId: number }> = ({
  fontName,
  tabId,
}) => {
  const addIntoNewBookmark: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = async (e) => {
    const buttonElement = e.currentTarget;

    animateRipple(e);

    const fontsFolder = await chrome.bookmarks.search({ title: "Fonts" });

    if (fontsFolder.length === 0) {
      fontsFolder.push(
        await chrome.bookmarks.create({ title: "Fonts", parentId: "1" }),
      );
    }

    const addedBookmark = await chrome.bookmarks.create({
      parentId: fontsFolder[0].id,
      title: "Collection - Google Fonts",
      url: `https://fonts.google.com/share?selection.family=${fontName.replaceAll(
        " ",
        "+",
      )}`,
    });

    setBookmarks(bookmarks.length, addedBookmark);

    buttonElement.scrollIntoView({ behavior: "smooth" });
    chrome.action.setBadgeText({ tabId, text: "✓" });
  };

  return (
    <>
      <Header title="Bookmark">
        <p class="text-neutral-content">
          Add <span class="font-bold">{fontName}</span> to{" "}
          {bookmarks.length === 0 ? "a new" : "a"} collection
        </p>
      </Header>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex flex-1 flex-col items-center justify-center gap-2.5">
            <button
              class="border-current mx-auto mt-1 block w-fit rounded-lg border p-2 text-center text-accent hover:bg-accent/10"
              onClick={addIntoNewBookmark}
            >
              + New collection
            </button>
            <p class="w-3/4 text-center">
              This font will be added to a new bookmark in a{" "}
              <span class="text-white font-bold">Fonts</span> folder, which can
              be moved or reorganized.
            </p>
          </div>
        }
        actionIndicator={(bookmarkedFontNames) => {
          const isFontSaved: boolean = bookmarkedFontNames.includes(fontName);

          return (
            <>
              <div
                class={`${
                  isFontSaved && !isEditing()
                    ? "text-lg text-accent"
                    : "text-xs text-neutral-content"
                }`}
              >
                {isFontSaved && !isEditing()
                  ? "★"
                  : `(${bookmarkedFontNames.length})`}
              </div>
              <div class="text-xs">
                {isEditing()
                  ? "Ⅰ\nRename"
                  : isFontSaved
                  ? "☆\nRemove"
                  : "+\nAdd"}
              </div>
            </>
          );
        }}
        onCardClick={(clickedBookmark, index) => {
          const bookmarkUrl = new URL(clickedBookmark.url!);

          // Replaces + with spaces.
          const bookmarkedFontString: string =
            bookmarkUrl.searchParams.get("selection.family") ?? "";

          const savedFonts = bookmarkedFontString
            ? bookmarkedFontString.split("|")
            : [];

          const position = savedFonts.indexOf(fontName);

          if (position === -1) {
            chrome.action.setBadgeText({ tabId, text: "✓" });

            savedFonts.push(fontName);
          } else {
            chrome.action.setBadgeText({ tabId, text: "" });

            savedFonts.splice(position, 1);
          }

          // Replaces spaces with + and `|` with %7C.
          bookmarkUrl.searchParams.set(
            "selection.family",
            savedFonts.join("|"),
          );

          // But Google Fonts website share link format prefers it to be `|`.
          bookmarkUrl.search = decodeURIComponent(bookmarkUrl.search);

          chrome.bookmarks.update(
            clickedBookmark.id,
            { url: bookmarkUrl.href },
            (updatedBookmark) => {
              setBookmarks(index, updatedBookmark);
            },
          );
        }}
      >
        <button
          class="ml-auto mt-1 block w-fit rounded-lg border border-neutral p-2 text-center"
          title="Create a new bookmark in the Fonts folder"
          onClick={addIntoNewBookmark}
        >
          + Create new
        </button>
      </FontList>
    </>
  );
};

export default Bookmark;
