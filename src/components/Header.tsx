import { Show, type Component, type JSXElement } from "solid-js";
import { bookmarks, isEditing, setIsEditing } from "./FontList";
import { EditIcon } from "./assets/EditIcon";
import { animateRipple } from "./utils";

export const Header: Component<{
  title: string;
  children: JSXElement;
}> = (props) => (
  <div class="flex items-center border-b border-b-neutral p-4">
    <div class="flex-1">
      <h1 class={`font-medium ${isEditing() ? "text-lg" : "text-xl"}`}>
        {isEditing() ? "Edit Collections" : props.title}
      </h1>

      <p class="text-neutral-content">
        {isEditing() ? (
          <span>Undo changes by pressing ctrl + z in chrome://bookmarks</span>
        ) : (
          props.children
        )}
      </p>
    </div>

    <Show when={bookmarks.length > 0}>
      <button
        class={`rounded-full p-2 transition-colors ${
          isEditing() ? "bg-base-content" : "hover:bg-neutral/30"
        }`}
        title={isEditing() ? "Exit editing mode" : "Edit collections"}
        onClick={(e) => {
          animateRipple(e);
          setIsEditing((isEditing) => !isEditing);
        }}
      >
        <EditIcon
          class={`h-6 w-6 ${
            isEditing() ? "fill-neutral" : "fill-neutral-content"
          }`}
        />
      </button>
    </Show>
  </div>
);
