import {
  bookmarks,
  FontList,
  hoveringCard,
  isEditing,
} from "../components/FontList";
import { Header } from "../components/Header";
import { pluralize } from "../components/utils";

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
      <Header title="Collections">
        {pluralize(countFonts(), "font")} in{" "}
        {pluralize(bookmarks.length, "collection")}
      </Header>

      <FontList
        class="px-3 py-3.5"
        emptyState={
          <div class="flex h-40 flex-1 flex-col items-center justify-center gap-2">
            <p>༼ つ ◕_◕ ༽つ</p>
            <p class="w-3/4 text-center text-sm">
              Visit a Google Fonts page like
              <br />
              <a
                class="underline underline-offset-2"
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
            class={`relative basis-[15%] transition-opacity duration-500 ${
              hoveringCard() === hoveredBookmark.id
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {isEditing() ? (
              <span>
                Ⅰ<br />
                Rename
              </span>
            ) : (
              <span>
                ↗<br />
                View
              </span>
            )}
          </button>
        )}
        onCardClick={(clickedBookmark) => {
          chrome.tabs.create({ url: clickedBookmark.url });
        }}
      />
    </>
  );
}
