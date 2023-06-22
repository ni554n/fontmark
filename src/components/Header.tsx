import { Show, type Component, type JSXElement } from "solid-js";
import { bookmarks, isEditing, setIsEditing } from "./FontList";
import { EditIcon } from "./assets/EditIcon";

export const Header: Component<{
  title: string;
  children: JSXElement;
}> = (props) => (
  <div class="flex items-center border-b border-b-[#5f6368] p-4">
    <div class="flex-1">
      <h1 class="text-xl font-medium">
        {isEditing() ? "Edit Collections" : props.title}
      </h1>

      <p class="text-[#9aa0a6]">
        {isEditing() ? (
          <span>Undo changes by pressing ctrl + z in chrome://bookmarks</span>
        ) : (
          props.children
        )}
      </p>
    </div>

    <Show when={bookmarks.length > 0}>
      <button
        class={`rounded-full p-2 transition-colors hover:bg-[#464749] ${
          isEditing() ? "bg-[#e8eaed] hover:bg-[#e8eaed]" : null
        }`}
        onClick={() => setIsEditing((isEditing) => !isEditing)}
      >
        <EditIcon class="h-6 w-6 fill-[#9aa0a6]" />
      </button>
    </Show>
  </div>
);
