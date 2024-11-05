import * as JSONC from "@std/jsonc";

export type ContentScript = {
  matches: string[];
  js?: string[];
  css?: string[];
  run_at: "document_start" | "document_end" | "document_idle";
  match_about_blank: boolean;
  match_origin_as_fallback: boolean;
};

export type OptionsUi = {
  page: string;
  open_in_tab: boolean;
  browser_style: boolean;
};

export type WebExtensionManifest = {
  manifest_version: 3;
  name: string;
  version: string;

  description: string;

  author: string;
  content_scripts: ContentScript[];
  content_security_policy: {
    extension_pages?: string;
    sandbox?: string;
  };
  options_ui: OptionsUi;

  permissions: string[];
  host_permissions: string[];
};

export type ExtendedWebExtensionManifest = WebExtensionManifest & {
  options_ui: OptionsUi & {
    js?: string[];
    css?: string[];
  };
};

export class Manifest {
  private manifest: ExtendedWebExtensionManifest;

  get manifest_version(): (typeof this.manifest)["manifest_version"] {
    return this.manifest.manifest_version;
  }

  get name(): (typeof this.manifest)["name"] {
    return this.manifest.name;
  }

  get version(): (typeof this.manifest)["version"] {
    return this.manifest.version;
  }

  private constructor(manifest: Manifest["manifest"]) {
    this.manifest = manifest;
  }

  static parse(text: string): Manifest {
    return new Manifest(JSONC.parse(text) as Manifest["manifest"]);
  }

  stringify(): string {
    return JSON.stringify({
      ...this.manifest,
      options_ui: {
        ...this.manifest.options_ui,
        js: undefined,
        css: undefined,
      },
    });
  }

  getScripts(): string[] {
    return [
      ...this.manifest.content_scripts.flatMap((entry) => entry.js ?? []),
      ...this.manifest.options_ui.js ?? [],
    ];
  }

  getStylesheets(): string[] {
    return [
      ...this.manifest.content_scripts.flatMap((entry) => entry.css ?? []),
      ...this.manifest.options_ui.css ?? [],
    ];
  }

  getFilesToCopy(): string[] {
    return [this.manifest.options_ui.page];
  }

  resourceFileReplaced(map: Map<string, string>): Manifest {
    const manifest = structuredClone(this.manifest);
    const newManifest: ExtendedWebExtensionManifest = {
      ...manifest,
      content_scripts: manifest.content_scripts.map((contentScript) => ({
        ...contentScript,
        js: contentScript.js?.map((js) => map.get(js) ?? js),
        css: contentScript.css?.map((css) => map.get(css) ?? css),
      })),
      options_ui: {
        ...manifest.options_ui,
        page: map.get(manifest.options_ui.page) ?? manifest.options_ui.page,
        js: manifest.options_ui.js?.map((js) => map.get(js) ?? js),
        css: manifest.options_ui.css?.map((css) => map.get(css) ?? css),
      },
    };

    return new Manifest(newManifest);
  }
}
