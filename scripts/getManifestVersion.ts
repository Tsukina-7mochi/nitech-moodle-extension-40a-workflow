import * as JSONC from "@std/jsonc";

let content = "";

await Deno.stdin.readable
  .pipeThrough(new TextDecoderStream())
  .pipeTo(
    new WritableStream({
      write(chunk) {
        content += chunk;
      },
    }),
  );

const manifest = JSONC.parse(content);

console.log(manifest.version);
