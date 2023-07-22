import type { Component } from "solid-js";
import { bookmarks, FontList, isEditing } from "../components/FontList";
import { Header } from "../components/Header";
import { pluralize } from "../components/utils";

const Collections: Component<{ tabIndex: number }> = (props) => {
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
          <div class="flex flex-1 flex-col items-center justify-center gap-2">
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
        actionIndicator={(bookmarkedFontNames: string[]) => (
          <>
            <div class="text-neutral-content">
              ({bookmarkedFontNames.length})
            </div>
            <div class="text-xs">{isEditing() ? "Ⅰ\nRename" : "↗\nView"}</div>
          </>
        )}
        onCardClick={(clickedBookmark) => {
          chrome.tabs.create({
            index: props.tabIndex + 1,
            url: clickedBookmark.url,
          });
        }}
      />
    </>
  );
};

export default Collections;
