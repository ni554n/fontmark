import { Show, createSignal, lazy, type JSX } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";

function Body(): JSX.Element {
  const [tab, setTab] = createSignal<chrome.tabs.Tab | undefined | null>(null);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    setTab(tabs[0]),
  );

  const Page = () => {
    const url: string | undefined = tab()?.url;

    if (!url) {
      const Collections = lazy(() => import("./pages/Collections"));
      return <Collections />;
    }

    const gFontUrl = new URL(url);
    const path: string = gFontUrl.pathname;
    const splitPath: string[] = path.split("/");

    const specimenIndex: number = splitPath.indexOf("specimen");

    if (specimenIndex !== -1) {
      const Bookmark = lazy(() => import("./pages/Bookmark"));
      return (
        <Bookmark
          fontName={splitPath[specimenIndex + 1].replaceAll("+", " ")}
          tabId={tab()?.id ?? -1}
        />
      );
    }

    if (path === "/share") {
      const Import = lazy(() => import("./pages/Import"));
      return <Import gFontUrl={gFontUrl} />;
    }

    const Collections = lazy(() => import("./pages/Collections"));
    return <Collections />;
  };

  return (
    <div class="h-[25rem] w-80 bg-base text-base-content dark:border dark:border-neutral">
      <div class="flex h-full flex-col">
        <Show when={tab() !== null}>
          <Page />
        </Show>
      </div>
    </div>
  );
}

render(Body, document.body);
