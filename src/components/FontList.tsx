import {
  For,
  Show,
  createSignal,
  type Accessor,
  type Component,
  type JSX,
  type JSXElement,
  batch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { animateRipple } from "./utils";

export const [bookmarks, setBookmarks] = createStore<
  chrome.bookmarks.BookmarkTreeNode[]
>([]);

const [isLoaded, setIsLoaded] = createSignal(false);

chrome.bookmarks.search("https://fonts.google.com/share?", (bookmarks) => {
  batch(() => {
    setBookmarks(bookmarks);
    setIsLoaded(true);
  });
});

export const [hoveringCard, setHoveringCard] = createSignal<string>("");

export const [isEditing, setIsEditing] = createSignal(false);

export const FontList: Component<{
  class: string;
  emptyState: JSXElement;
  actionIndicator: (bookmarkedFontNames: string[]) => JSXElement;
  children?: JSXElement;
  onCardClick: (
    bookmark: chrome.bookmarks.BookmarkTreeNode,
    index: number,
  ) => void;
}> = (props) => {
  function clickCard(
    {
      bookmark,
      index,
    }: {
      bookmark: chrome.bookmarks.BookmarkTreeNode;
      index: Accessor<number>;
    },
    e: Parameters<JSX.EventHandler<HTMLElement, MouseEvent>>[0],
  ) {
    if (isEditing()) return;
    animateRipple(e);

    props.onCardClick(bookmark, index());
  }

  function deleteBookmark(
    {
      bookmarkId,
      index,
    }: {
      bookmarkId: string;
      index: Accessor<number>;
    },
    e: Parameters<JSX.EventHandler<HTMLElement, MouseEvent>>[0],
  ) {
    animateRipple(e);

    chrome.bookmarks.remove(bookmarkId, () => {
      setBookmarks((bookmarks) => {
        const clonedBookmarks = Array.from(bookmarks);
        clonedBookmarks.splice(index(), 1);
        return clonedBookmarks;
      });
    });
  }

  return (
    <Show when={isLoaded()}>
      <Show when={bookmarks.length > 0} fallback={props.emptyState}>
        <div class="overflow-y-auto">
          <div class={`flex flex-col gap-3 ${props.class}`}>
            <For each={bookmarks}>
              {(bookmark, index) => {
                const bookmarkedFontNames =
                  new URL(bookmark.url!).searchParams
                    .get("selection.family")
                    ?.split("|") || [];

                return (
                  <div class="flex gap-2">
                    <button
                      class={`flex w-full items-center justify-between gap-4 rounded-lg border border-neutral p-4 text-start transition-colors hover:bg-accent/5 ${
                        isEditing() ? "" : "hover:border-accent"
                      }`}
                      onClick={[clickCard, { bookmark, index }]}
                      onMouseOver={() => setHoveringCard(bookmark.id)}
                      onMouseOut={() => setHoveringCard("")}
                    >
                      <div class="w-0 basis-[85%]">
                        <div class="flex">
                          <input
                            type="text"
                            value={bookmark.title}
                            placeholder="Collection Name"
                            class={`text-xm flex-1 bg-transparent ${
                              isEditing()
                                ? "rounded-sm outline outline-1 outline-offset-2 outline-base-content/40 focus:outline-accent"
                                : "pointer-events-none"
                            }`}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => {
                              chrome.bookmarks.update(bookmark.id, {
                                title: event.currentTarget.value,
                              });
                            }}
                            onKeyPress={(event) => {
                              if (event.key === "Enter")
                                event.currentTarget.blur();
                            }}
                          />
                        </div>

                        <p
                          class={`truncate text-neutral-content ${
                            isEditing() ? "mt-1" : ""
                          }`}
                        >
                          {bookmarkedFontNames.slice(0, 5).join(", ")}
                        </p>
                      </div>

                      <div
                        class={`swap-fade basis-[15%] text-center ${
                          hoveringCard() === bookmark.id
                            ? "[&>:last-child]:opacity-100"
                            : "[&>:first-child]:opacity-100"
                        }`}
                      >
                        {props.actionIndicator(bookmarkedFontNames)}
                      </div>
                    </button>

                    <Show when={isEditing()}>
                      <button
                        class="rounded-lg hover:text-accent"
                        onClick={[
                          deleteBookmark,
                          { bookmarkId: bookmark.id, index },
                        ]}
                      >
                        × Delete
                      </button>
                    </Show>
                  </div>
                );
              }}
            </For>
            {isEditing() ? "" : props.children}
          </div>
        </div>
      </Show>
    </Show>
  );
};
