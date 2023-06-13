import { type JSX } from "solid-js/jsx-runtime";
import {
  FontList,
  hoveringCard,
  hoveringInput,
  setBookmarks,
} from "./FontList";

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

        currentTarget.scrollIntoView({ behavior: "smooth" });
      },
    );
  };

  return (
    <>
      <div class="border-b border-b-[#5f6368] p-4">
        <h1 class="text-lg">Add to collection</h1>
        <p class="text-[#9aa0a6]">{fontName}</p>
      </div>

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
              class={`action relative basis-[15%] transition-opacity duration-500 before:content-['+_Add'] after:content-['Ⅰ_Rename'] ${
                isFontSaved || hoveringCard() === hoveredBookmark.id
                  ? "opacity-100"
                  : "opacity-0"
              } ${
                hoveringInput() === hoveredBookmark.id
                  ? "before:opacity-0 after:opacity-100"
                  : "before:opacity-100 after:opacity-0"
              } ${
                isFontSaved
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

          const savedFonts = bookmarkedFontString.split("|") ?? [];
          const position = savedFonts.indexOf(fontName);

          if (position === -1) {
            bookmarkUrl.searchParams.set(
              "selection.family",
              `${bookmarkedFontString}|${fontName.replaceAll(" ", "+")}`,
            );
          } else {
            savedFonts.splice(position, 1);

            bookmarkUrl.searchParams.set(
              "selection.family",
              savedFonts.join("|"),
            );
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
          + Create & Save
        </button>
      </FontList>
    </>
  );
}
