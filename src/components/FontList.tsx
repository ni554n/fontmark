import {
  For,
  Show,
  createSignal,
  type Component,
  type JSXElement,
  type Accessor,
  type JSX,
} from "solid-js";
import { createStore } from "solid-js/store";

export const [bookmarks, setBookmarks] = createStore<
  chrome.bookmarks.BookmarkTreeNode[]
>([]);

chrome.bookmarks.search("https://fonts.google.com/share?", setBookmarks);

export const [hoveringCard, setHoveringCard] = createSignal<string>("");
export const [hoveringInput, setHoveringInput] = createSignal<string>("");

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
  function clickLink({
    bookmark,
    index,
  }: {
    bookmark: chrome.bookmarks.BookmarkTreeNode;
    index: Accessor<number>;
  }) {
    if (hoveringInput()) {
      setHoveringInput("");
      return;
    }

    props.onCardClick(bookmark, index());
  }

  return (
    <Show when={bookmarks.length > 0} fallback={props.emptyState}>
      <div
        class={`flex max-h-80 flex-col gap-3 overflow-y-auto ${props.class}`}
      >
        <For each={bookmarks}>
          {(bookmark, index) => (
            <section
              class="flex w-full items-center justify-between gap-2 rounded-lg border border-[#5f6368] p-4 hover:cursor-pointer hover:border-[#8ab4f8] hover:bg-[#292c35]"
              onClick={[clickLink, { bookmark, index }]}
              onMouseOver={() => setHoveringCard(bookmark.id)}
              onMouseOut={() => setHoveringCard("")}
            >
              <div class="basis-[85%]">
                <div class="flex">
                  <input
                    type="text"
                    value={bookmark.title}
                    placeholder="Collection Name"
                    class="text-xm flex-1 bg-transparent"
                    onClick={(event) => event.stopPropagation()}
                    onMouseEnter={() => {
                      setHoveringInput(bookmark.id);
                    }}
                    onMouseLeave={(event) => {
                      if (document.activeElement !== event.currentTarget)
                        setHoveringInput("");
                    }}
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
            </section>
          )}
        </For>
        {props.children}
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
