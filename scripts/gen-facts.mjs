// gen-facts.mjs — generate the website's grounded facts from the
// family's committed goldens: the CLI's commands.json (the command
// table), the ten services' openapi.yaml contracts (the service
// roster and each service's operation count) and each contract's
// deployment keys. The sources are tested; this render is locked by
// the e2e harness, which regenerates and diffs. Narrative numbers on
// the site read from src/data/facts.json — a typed count can no
// longer drift from the artifact it counts.
//
// Usage: node scripts/gen-facts.mjs   (from the repo root; assumes
// the family checkout ../unidpp-*)

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { parse } from "yaml";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "..", "src", "data", "facts.json");
const FAMILY = process.env.UNIDPP_FAMILY_DIR ?? path.join(here, "..", "..");

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

const commands = await readJson(path.join(FAMILY, "unidpp-cli", "commands.json"));

const services = [];
for (const name of [
  "registry",
  "trust",
  "log",
  "issuer",
  "projector",
  "gateway",
  "archive",
  "resolver",
  "hub",
  "console",
]) {
  const doc = parse(
    await readFile(path.join(FAMILY, `unidpp-${name}`, "openapi.yaml"), "utf8"),
  );
  let operations = 0;
  for (const item of Object.values(doc.paths ?? {})) {
    for (const method of ["get", "post", "put", "delete", "patch"]) {
      if (item[method]) operations += 1;
    }
  }
  services.push({
    name,
    title: doc.info?.title ?? `UniDPP ${name}`,
    operations,
    env_keys: doc.info?.["x-unidpp-env-keys"] ?? [],
  });
}

const facts = {
  generated_at: new Date().toISOString().slice(0, 10),
  cli: {
    commands: commands.commands.map((c) => c.name),
    command_count: commands.commands.length,
  },
  services: {
    names: services.map((s) => s.name),
    count: services.length,
    operations_total: services.reduce((sum, s) => sum + s.operations, 0),
    per_service: Object.fromEntries(services.map((s) => [s.name, s.operations])),
  },
};

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(facts, null, 2) + "\n");
console.log(
  `gen-facts: ${facts.cli.command_count} commands, ${facts.services.count} services, ${facts.services.operations_total} operations -> ${OUT}`,
);
