import { bookmarks, FontList, hoveringCard, hoveringInput } from "./FontList";
import { pluralize } from "./utils";

export function Collections() {
  const countFonts = () => {
    let count = 0;

    for (const { url } of bookmarks) {
      count +=
        new URL(url!).searchParams.get("selection.family")?.split("|")
          ?.length ?? 0;
    }

    return count;
  };

  return (
    <>
      <div class="border-b border-b-[#5f6368] p-4">
        <h1 class="text-xl font-medium">Collection</h1>
        <p class="text-[#9aa0a6]">
          {pluralize(countFonts(), "font")} in{" "}
          {pluralize(bookmarks.length, "collection")}
        </p>
      </div>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex flex-1 flex-col items-center justify-center">
            <h1>No collection</h1>
            <p>
              Visit a font page like{" "}
              <a
                class="underline"
                href="https://fonts.google.com/specimen/Roboto"
                target="_blank"
              >
                Roboto
              </a>{" "}
              to bookmark it
            </p>
          </div>
        }
        actionIndicator={(hoveredBookmark) => (
          <button
            class={`action relative basis-[15%] transition-opacity duration-500 before:content-['↗_View'] after:content-['Ⅰ_Rename'] ${
              hoveringCard() === hoveredBookmark.id
                ? "opacity-100"
                : "opacity-0"
            } ${
              hoveringInput() === hoveredBookmark.id
                ? "before:opacity-0 after:opacity-100"
                : "before:opacity-100 after:opacity-0"
            }`}
          />
        )}
        onCardClick={(clickedBookmark) => {
          chrome.tabs.create({ url: clickedBookmark.url });
        }}
      />
    </>
  );
}
