import { FontList, hoveringCard, isEditing, setBookmarks } from "./FontList";
import { Header } from "./Header";
import { pluralize } from "./utils";

export function Importer(sharedFonts: string[]) {
  return (
    <>
      <Header title="Import">
        {pluralize(sharedFonts.length, "font")} into an existing collection
      </Header>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex flex-1 flex-col items-center justify-center">
            <h1>No collection to import into</h1>
            <p>Bookmark it normally</p>
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
              class={`swap-fade relative basis-[15%] before:content-['☆_Remove'] after:content-['★'] ${
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
              {isEditing() ? "Ⅰ Rename" : areFontsImported ? null : "+ Import"}
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
        <p class="mt-2 text-center">You can also bookmark it normally</p>
      </FontList>
    </>
  );
}
