import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse } from "yaml";

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "rest-api-spec-test-"));
try {
  const installed = path.join(temporary, "node_modules/@figma/rest-api-spec");
  fs.mkdirSync(installed, { recursive: true });
  execFileSync("tar", [
    "-xzf",
    ".release/package.tgz",
    "--strip-components=1",
    "-C",
    installed,
  ]);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(installed, "package.json"), "utf8"),
  );
  const document = parse(
    fs.readFileSync(path.join(installed, "openapi/openapi.yaml"), "utf8"),
  );
  assert.equal(document.openapi, "3.1.0");
  assert.equal(document.info.version, pkg.version);
  assert(Object.keys(document.paths).length > 0);
  function checkReferences(value) {
    if (!value || typeof value !== "object") return;
    if (value.$ref) {
      assert(value.$ref.startsWith("#/"), "Expected a local OpenAPI reference");
      let target = document;
      for (const part of value.$ref.slice(2).split("/")) {
        target = target?.[part.replaceAll("~1", "/").replaceAll("~0", "~")];
      }
      assert(
        target !== undefined,
        `Unresolved OpenAPI reference: ${value.$ref}`,
      );
    }
    for (const child of Object.values(value)) checkReferences(child);
  }
  checkReferences(document);
  fs.writeFileSync(
    path.join(temporary, "consumer.ts"),
    `
import type { GetFileResponse } from '@figma/rest-api-spec'
function fileName(file: GetFileResponse): string { return file.name }
// @ts-expect-error Unknown response field
type Missing = GetFileResponse['notAResponseField']
`,
  );
  execFileSync(
    path.resolve("node_modules/.bin/tsc"),
    [
      "--noEmit",
      "--strict",
      "--target",
      "es2020",
      "--moduleResolution",
      "node",
      path.join(temporary, "consumer.ts"),
    ],
    { stdio: "inherit" },
  );
  console.log(
    "Packed OpenAPI references, version, and TypeScript consumer passed",
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
