import type { Component, JSXElement } from "solid-js";
import { isEditing, setIsEditing } from "./FontList";
import { EditIcon } from "./assets/EditIcon";

export const Header: Component<{
  title: string;
  children: JSXElement;
}> = (props) => (
  <div class="flex items-center border-b border-b-[#5f6368] p-4">
    <div class="flex-1">
      <h1 class="text-xl font-medium">{props.title}</h1>
      <p class="text-[#9aa0a6]">{props.children}</p>
    </div>
    <button
      class={`rounded-full p-2 transition-colors hover:bg-[#464749] ${
        isEditing() ? "bg-[#e8eaed] hover:bg-[#e8eaed]" : null
      }`}
      title="Rename Collections"
      onClick={() => setIsEditing((isEditing) => !isEditing)}
    >
      <EditIcon class="h-6 w-6 fill-[#9aa0a6]" />
    </button>
  </div>
);
