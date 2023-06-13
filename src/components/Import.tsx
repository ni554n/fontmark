import {
  FontList,
  hoveringCard,
  hoveringInput,
  setBookmarks,
} from "./FontList";
import { pluralize } from "./utils";

export function Importer(sharedFonts: string[]) {
  return (
    <>
      <div class="border-b border-b-[#5f6368] p-4">
        <h1 class="text-xl font-medium">Import</h1>
        <p class="text-[#9aa0a6]">
          {pluralize(sharedFonts.length, "font")} into an existing collection
        </p>
      </div>

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
              class={`action relative basis-[15%] transition-opacity duration-500 before:content-['+_Import'] after:content-['Ⅰ_Rename'] ${
                areFontsImported || hoveringCard() === hoveredBookmark.id
                  ? "opacity-100"
                  : "opacity-0"
              } ${
                hoveringInput() === hoveredBookmark.id
                  ? "before:opacity-0 after:opacity-100"
                  : "before:opacity-100 after:opacity-0"
              } ${
                areFontsImported
                  ? `${
                      hoveringCard() === hoveredBookmark.id
                        ? "before:text-lg before:[--tw-content:'☆']"
                        : "before:text-lg before:text-[#8ab4f8] before:[--tw-content:'★']"
                    }`
                  : null
              }`}
            />
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
