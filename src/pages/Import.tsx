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
      url: gFontUrl.href,
    });

    setBookmarks(bookmarks.length, addedBookmark);

    buttonElement.scrollIntoView({ behavior: "smooth" });
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
              class="mx-auto mt-1 block w-fit rounded-lg border border-neutral p-2 text-center"
              onClick={addIntoNewBookmark}
            >
              ★ Bookmark
            </button>

            <p class="w-3/4 text-center">
              A new bookmark will be added in the{" "}
              <span class="font-bold">Fonts</span> folder, which can be moved or
              reorganized.
            </p>
          </div>
        }
        actionIndicator={(bookmarkedFontNames) => {
          const areFontsImported =
            bookmarkedFontNames.length ===
            new Set(bookmarkedFontNames.concat(sharedFonts)).size;

          return (
            <>
              <div
                class={`${
                  areFontsImported && !isEditing()
                    ? "text-lg text-accent"
                    : "text-xs text-neutral-content"
                }`}
              >
                {areFontsImported && !isEditing()
                  ? "★"
                  : `(${bookmarkedFontNames.length})`}
              </div>
              <div class="text-xs">
                {isEditing()
                  ? "Ⅰ\nRename"
                  : areFontsImported
                  ? "☆\nUndo"
                  : "+\nImport"}
              </div>
            </>
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
          class="ml-auto mt-1 block w-fit rounded-lg border border-neutral p-2 text-center"
          title="Create a new bookmark in the Fonts folder"
          onClick={addIntoNewBookmark}
        >
          + Create new
        </button>
      </FontList>
    </>
  );
}
