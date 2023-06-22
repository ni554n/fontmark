import type { JSX } from "solid-js/jsx-runtime";
import {
  FontList,
  bookmarks,
  hoveringCard,
  isEditing,
  setBookmarks,
} from "../components/FontList";
import { Header } from "../components/Header";
import { animateRipple, pluralize } from "../components/utils";

export function Importer(gFontUrl: URL) {
  const sharedFonts: string[] =
    gFontUrl.searchParams.get("selection.family")?.split("|") ?? [];

  const addIntoNewBookmark: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e,
  ) => {
    animateRipple(e);

    chrome.bookmarks.create(
      {
        title: "Collection - Google Fonts",
        url: gFontUrl.href,
      },
      (addedBookmark) => {
        setBookmarks(bookmarks.length, addedBookmark);

        e.currentTarget.scrollIntoView({ behavior: "smooth" });
      },
    );
  };

  return (
    <>
      <Header title={`Import ${pluralize(sharedFonts.length, "font")}`}>
        Into {bookmarks.length === 0 ? "a new" : "an existing"} collection
      </Header>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex h-40 flex-1 flex-col items-center justify-center gap-2.5">
            <button
              class="mx-auto mt-1 block w-fit rounded-lg border border-[#5f6368] p-2 text-center"
              onClick={addIntoNewBookmark}
            >
              ★ Bookmark
            </button>

            <p class="w-3/4 text-center">
              A new bookmark will be added in the
              <br />
              <span class="font-bold">Other bookmarks</span> folder, but it can
              be reorganized.
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

          const areFontsImported =
            savedFonts.length === new Set(savedFonts.concat(sharedFonts)).size;

          return (
            <button
              class={`swap-fade relative basis-[15%] before:content-['☆_Undo'] after:content-['★'] ${
                isEditing() || !areFontsImported
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
              ) : areFontsImported ? null : (
                <span>
                  +<br />
                  Import
                </span>
              )}
            </button>
          );
        }}
        onCardClick={(clickedBookmark, index) => {
          const bookmarkUrl = new URL(clickedBookmark.url!);

          const bookmarkedFontString: string =
            bookmarkUrl.searchParams.get("selection.family") ?? "";

          const savedFonts: string[] = bookmarkedFontString
            ? bookmarkedFontString.split("|")
            : [];

          const set = new Set(savedFonts.concat(sharedFonts));

          if (savedFonts.length === set.size)
            sharedFonts.forEach(set.delete.bind(set));

          bookmarkUrl.searchParams.set(
            "selection.family",
            Array.from(set).join("|"),
          );

          // `|` gets encoded while setting `searchParams`.
          // But the share link format prefers it to be decoded.
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
