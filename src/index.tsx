import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import { Bookmark } from "./pages/Bookmark";
import { Collections } from "./pages/Collections";
import { Importer } from "./pages/Import";

function Body(): JSX.Element {
  const [tab, setTab] = createSignal<chrome.tabs.Tab | undefined | null>(null);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    setTab(tabs[0]),
  );

  const page = () => {
    const url: string | undefined = tab()?.url;

    if (!url) return Collections();

    const gFontUrl = new URL(url);
    const path: string = gFontUrl.pathname;
    const splitPath: string[] = path.split("/");

    const specimenIndex: number = splitPath.indexOf("specimen");

    if (specimenIndex !== -1) {
      return Bookmark(
        splitPath[specimenIndex + 1].replaceAll("+", " "),
        tab()?.id ?? -1,
      );
    }

    if (path === "/share") {
      return Importer(gFontUrl);
    }

    return Collections();
  };

  return (
    <div class="w-80 border border-[#5f6368] bg-[#202124] text-[#e8eaed]">
      {tab() !== null && page()}
    </div>
  );
}

render(Body, document.body);
