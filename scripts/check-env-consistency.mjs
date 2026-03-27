import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const envExamplePath = path.join(root, ".env.example");

function parseEnv(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith("#")) continue;
    const eqIndex = raw.indexOf("=");
    if (eqIndex < 1) continue;
    const key = raw.slice(0, eqIndex).trim();
    const value = raw.slice(eqIndex + 1).trim().replace(/^"|"$/g, "");
    entries.push({ key, value, line: i + 1 });
  }

  return entries;
}

function findDuplicateKeys(entries) {
  const seen = new Map();
  const duplicates = [];
  for (const entry of entries) {
    if (seen.has(entry.key)) {
      duplicates.push(entry);
    } else {
      seen.set(entry.key, entry.line);
    }
  }
  return duplicates;
}

function findValue(entries, key) {
  for (const entry of entries) {
    if (entry.key === key) return entry.value;
  }
  return "";
}

function main() {
  if (!fs.existsSync(envPath)) {
    console.log("[env-check] .env not found, skip");
    process.exit(0);
  }

  const envEntries = parseEnv(fs.readFileSync(envPath, "utf8"));
  const issues = [];

  const duplicates = findDuplicateKeys(envEntries);
  for (const dup of duplicates) {
    issues.push(`Duplicate key in .env: ${dup.key} (line ${dup.line})`);
  }

  const baseUrl = findValue(envEntries, "DATA_GO_TH_BASE_URL");
  if (baseUrl && baseUrl.includes("data.go.th/api/3/action")) {
    issues.push(
      "DATA_GO_TH_BASE_URL uses legacy endpoint; use https://opend.data.go.th/get-ckan for this project"
    );
  }

  const nodeEnv = findValue(envEntries, "NODE_ENV");
  const databaseUrl = findValue(envEntries, "DATABASE_URL");
  if (nodeEnv === "production" && databaseUrl.includes("localhost")) {
    issues.push("DATABASE_URL points to localhost while NODE_ENV=production");
  }

  if (fs.existsSync(envExamplePath)) {
    const exampleEntries = parseEnv(fs.readFileSync(envExamplePath, "utf8"));
    const requiredKeys = [
      "DATABASE_URL",
      "SESSION_SECRET",
      "JWT_SECRET",
      "FRONTEND_ORIGINS",
      "DATA_GO_TH_API_KEY",
      "DATA_GO_TH_BASE_URL",
    ];
    for (const key of requiredKeys) {
      if (!exampleEntries.some((entry) => entry.key === key)) {
        issues.push(`.env.example missing required key: ${key}`);
      }
    }
  }

  if (issues.length) {
    console.error("[env-check] FAILED");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log("[env-check] OK");
}

main();
