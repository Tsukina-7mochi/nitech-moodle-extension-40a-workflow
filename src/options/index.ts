import * as preact from "preact";

import { EditPreferences } from "./components/EditPreferences.tsx";

globalThis.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("preferences");
  if (!root) throw Error("element #preferences is not found");

  preact.render(
    preact.createElement(EditPreferences, null),
    root,
  );
});
