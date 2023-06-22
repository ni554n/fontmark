import {
  For,
  Show,
  createSignal,
  type Accessor,
  type Component,
  type JSX,
  type JSXElement,
} from "solid-js";
import { createStore } from "solid-js/store";
import { animateRipple } from "./utils";

export const [bookmarks, setBookmarks] = createStore<
  chrome.bookmarks.BookmarkTreeNode[]
>([]);

chrome.bookmarks.search("https://fonts.google.com/share?", setBookmarks);

export const [hoveringCard, setHoveringCard] = createSignal<string>("");

export const [isEditing, setIsEditing] = createSignal(false);

export const FontList: Component<{
  class: string;
  emptyState: JSXElement;
  actionIndicator: (url: chrome.bookmarks.BookmarkTreeNode) => JSXElement;
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
    <Show when={bookmarks.length > 0} fallback={props.emptyState}>
      <div class="max-h-80 overflow-y-auto">
        <div class={`flex flex-col gap-3 ${props.class}`}>
          <For each={bookmarks}>
            {(bookmark, index) => (
              <div class="flex gap-2">
                <button
                  class="flex w-full items-center justify-between gap-2 rounded-lg border border-[#5f6368] p-4 text-start hover:border-[#8ab4f8] hover:bg-[#292c35]"
                  onClick={[clickCard, { bookmark, index }]}
                  onMouseOver={() => setHoveringCard(bookmark.id)}
                  onMouseOut={() => setHoveringCard("")}
                >
                  <div class="basis-[85%]">
                    <div class="flex">
                      <input
                        type="text"
                        value={bookmark.title}
                        placeholder="Collection Name"
                        class={`text-xm flex-1 bg-transparent ${
                          isEditing()
                            ? "rounded-sm outline outline-1 outline-offset-1 outline-[#e8eaed] focus:outline-[#8ab4f8]"
                            : "pointer-events-none"
                        }`}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          chrome.bookmarks.update(bookmark.id, {
                            title: event.currentTarget.value,
                          });
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") event.currentTarget.blur();
                        }}
                      />
                    </div>

                    <p class="text-[#9aa0a6]">{getFontNames(bookmark.url!)}</p>
                  </div>

                  {props.actionIndicator(bookmark)}
                </button>

                <Show when={isEditing()}>
                  <button
                    class="rounded-lg hover:text-[#8ab4f8]"
                    onClick={[
                      deleteBookmark,
                      { bookmarkId: bookmark.id, index },
                    ]}
                  >
                    × Delete
                  </button>
                </Show>
              </div>
            )}
          </For>
          {isEditing() ? null : props.children}
        </div>
      </div>
    </Show>
  );
};

function getFontNames(url: string): string {
  const fontString = new URL(url).searchParams.get("selection.family");

  if (!fontString) return "No fonts added";

  const fonts = fontString.split("|");

  const firstThree = fonts.slice(0, 3);
  const remainingCount = fonts.length - firstThree.length;

  const joined = firstThree.join(", ");

  return remainingCount === 0
    ? joined
    : `${joined} and ${remainingCount} more…`;
}
