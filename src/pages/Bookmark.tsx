import { type JSX } from "solid-js/jsx-runtime";
import {
  FontList,
  hoveringCard,
  isEditing,
  setBookmarks,
} from "../components/FontList";
import { Header } from "../components/Header";

export function Marker(fontName: string) {
  const addIntoNewBookmark: JSX.EventHandler<HTMLButtonElement, MouseEvent> = ({
    currentTarget,
  }) => {
    chrome.bookmarks.create(
      {
        title: "Collection - Google Fonts",
        url: `https://fonts.google.com/share?selection.family=${fontName.replaceAll(
          " ",
          "+",
        )}`,
      },
      (addedBookmark) => {
        setBookmarks((bookmarks) => bookmarks.concat(addedBookmark));

        e.currentTarget.scrollIntoView({ behavior: "smooth" });
        chrome.action.setBadgeText({ tabId, text: "✓" });
      },
    );
  };

  return (
    <>
      <Header title="Bookmark">
        <p class="text-[#9aa0a6]">
          Add <span class="font-bold">{fontName}</span> to a collection
        </p>
      </Header>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex flex-1 flex-col items-center justify-center">
            <h1>No collection</h1>
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

          const bookmarkedFontString: string =
            bookmarkUrl.searchParams.get("selection.family") ?? "";

          const savedFonts = bookmarkedFontString.split("|") ?? [];
          const position = savedFonts.indexOf(fontName);

          if (position === -1) {
            bookmarkUrl.searchParams.set(
              "selection.family",
              `${bookmarkedFontString}|${fontName.replaceAll(" ", "+")}`,
            );

            chrome.action.setBadgeText({ tabId, text: "✓" });
          } else {
            savedFonts.splice(position, 1);

            bookmarkUrl.searchParams.set(
              "selection.family",
              savedFonts.join("|"),
            );

            chrome.action.setBadgeText({ tabId, text: "" });
          }

          // `|` gets encoded in `searchParams`.
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
          class="ml-auto mt-1 block w-fit rounded-lg border border-[#5f6368] p-2 text-center"
          onClick={addIntoNewBookmark}
        >
          + Create new
        </button>
      </FontList>
    </>
  );
}
