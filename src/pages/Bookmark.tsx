import { type JSX } from "solid-js/jsx-runtime";
import {
  FontList,
  bookmarks,
  hoveringCard,
  isEditing,
  setBookmarks,
} from "../components/FontList";
import { Header } from "../components/Header";
import { animateRipple } from "../components/utils";

export function Bookmark(fontName: string, tabId: number) {
  const addIntoNewBookmark: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e,
  ) => {
    animateRipple(e);

    chrome.bookmarks.create(
      {
        title: "Collection - Google Fonts",
        url: `https://fonts.google.com/share?selection.family=${fontName.replaceAll(
          " ",
          "+",
        )}`,
      },
      (addedBookmark) => {
        setBookmarks(bookmarks.length, addedBookmark);

        e.currentTarget.scrollIntoView({ behavior: "smooth" });
        chrome.action.setBadgeText({ tabId, text: "✓" });
      },
    );
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
          <div class="flex h-40 flex-1 flex-col items-center justify-center gap-2.5">
            <button
              class="mx-auto mt-1 block w-fit rounded-lg border border-current p-2 text-center text-accent hover:bg-accent/10"
              onClick={addIntoNewBookmark}
            >
              + New collection
            </button>
            <p class="w-3/4 text-center">
              This font will be added to a new bookmark in the{" "}
              <span class="font-bold text-white">Other bookmarks</span> folder,
              but it can be reorganized.
            </p>
          </div>
        }
        actionIndicator={(
          hoveredBookmark: chrome.bookmarks.BookmarkTreeNode,
        ) => {
          const savedFonts: string[] =
            new URL(hoveredBookmark.url!).searchParams
              .get("selection.family")
              ?.split("|") ?? [];

          const isFontSaved: boolean = savedFonts.includes(fontName);

          return (
            <button
              class={`swap-fade relative basis-[15%] before:content-['☆_Remove'] after:content-['★'] ${
                isEditing() || !isFontSaved
                  ? hoveringCard() === hoveredBookmark.id
                    ? "opacity-100"
                    : "opacity-0"
                  : `opacity-100 ${
                      hoveringCard() === hoveredBookmark.id
                        ? "before:opacity-100"
                        : "after:opacity-100"
                    }`
              }`}
            >
              {isEditing() ? (
                <span>
                  Ⅰ<br />
                  Rename
                </span>
              ) : isFontSaved ? null : (
                <span>
                  +<br />
                  Add
                </span>
              )}
            </button>
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
          onClick={addIntoNewBookmark}
        >
          + Create new
        </button>
      </FontList>
    </>
  );
}
