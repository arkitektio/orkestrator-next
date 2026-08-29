#!/usr/bin/env node
/**
 * Validate the kraph GraphQL documents against a schema SDL.
 *
 * `pnpm kraph` emits four artifacts from one config and graphql-codegen fails the
 * whole run on any document error, so it writes nothing — including the schema-ast
 * output — while a single document is broken. That makes "regenerate, then fix the
 * documents" impossible to execute. This script closes the loop instead: point it
 * at the SDL the server is actually serving, drive it to zero, then run codegen
 * once.
 *
 *   curl -s http://jhnnsrs-lab/kraph/schema -o /tmp/kraph.graphql
 *   node scripts/validate-kraph-documents.mjs /tmp/kraph.graphql
 *
 * Exits non-zero while any document is invalid, so it also works as a gate.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const g = require("graphql");

const DOCUMENTS_ROOT = "graphql/kraph";

const schemaPath = process.argv[2];
if (!schemaPath) {
  console.error("usage: node scripts/validate-kraph-documents.mjs <schema.graphql>");
  process.exit(2);
}

// `assumeValidSDL` because the served SDL carries federation `@key` / `@link`
// directives that graphql-js has no definitions for and would otherwise reject
// before it ever looks at a document.
const schema = g.buildSchema(fs.readFileSync(schemaPath, "utf8"), { assumeValidSDL: true });

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (p.endsWith(".graphql")) files.push(p);
  }
})(DOCUMENTS_ROOT);
files.sort();

// Concatenated so fragment spreads resolve across files, the way codegen sees
// them. `starts` maps a line in the combined document back to the file it came
// from, which is the whole point — an error at "line 4213" is not actionable.
let combined = "";
const starts = [];
for (const file of files) {
  starts.push({ file, start: combined.split("\n").length });
  combined += fs.readFileSync(file, "utf8") + "\n";
}

let document;
try {
  document = g.parse(combined);
} catch (error) {
  console.error("PARSE ERROR:", error.message);
  process.exit(1);
}

const errors = g.validate(
  schema,
  document,
  // A fragment used only by another file's operation looks unused here because
  // everything is one document; that rule is codegen's business, not ours.
  g.specifiedRules.filter((rule) => rule.name !== "NoUnusedFragmentsRule"),
  { maxErrors: 10000 },
);

const perFile = new Map();
for (const error of errors) {
  const line = error.locations?.[0]?.line ?? 0;
  let owner = "<unattributed>";
  for (const entry of starts) if (entry.start <= line) owner = entry.file;
  if (!perFile.has(owner)) perFile.set(owner, new Set());
  perFile.get(owner).add(error.message);
}

console.log(`ERRORS: ${errors.length}  BROKEN FILES: ${perFile.size} / ${files.length}`);
for (const file of [...perFile.keys()].sort()) {
  console.log(`\n### ${file}`);
  for (const message of perFile.get(file)) console.log(`   - ${message}`);
}

process.exit(errors.length ? 1 : 0);
