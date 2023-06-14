import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { Collections } from "./components/Collections";
import { Importer } from "./components/Import";
import { Marker } from "./components/Bookmark";
import "./index.css";

function Body(): JSX.Element {
  const [tabUrl, setTabUrl] = createSignal<string | undefined | null>(null);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    setTabUrl(tabs[0].url),
  );

  const page = () => {
    const url = tabUrl();

    if (!url) return Collections();

    const gFontUrl = new URL(url);
    const path: string = gFontUrl.pathname;
    const splitPath: string[] = path.split("/");

    const specimenIndex: number = splitPath.indexOf("specimen");

    if (specimenIndex !== -1) {
      return Marker(splitPath[specimenIndex + 1].replaceAll("+", " "));
    }

    if (path === "/share") {
      return Importer(
        gFontUrl.searchParams.get("selection.family")?.split("|") ?? [],
      );
    }
  };

  return (
    <div class="w-80 border border-[#5f6368] bg-[#202124] text-[#e8eaed]">
      {tabUrl !== null && page()}
    </div>
  );
}

render(Body, document.body);