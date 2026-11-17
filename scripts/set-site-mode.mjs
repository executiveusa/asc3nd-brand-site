#!/usr/bin/env node
/**
 * Deliberately boring deployment mode controller: a reviewed config-file
 * change is deployed through the existing Netlify Git integration.
 * Does not touch DNS or the still-live Vercel landing site.
 */
import { readFileSync, writeFileSync } from "node:fs";

const mode = process.argv[2];
const confirmation = process.argv[3];
if (!["full", "standby"].includes(mode) || confirmation !== "APPROVE_ASC3ND_MODE_SWITCH") {
  console.error("Usage: node scripts/set-site-mode.mjs <full|standby> APPROVE_ASC3ND_MODE_SWITCH");
  process.exit(2);
}
const file = new URL("../config/site-mode.json", import.meta.url);
const previous = JSON.parse(readFileSync(file, "utf8"));
if (!["full", "standby"].includes(previous.mode)) {
  console.error("Invalid existing mode. Refusing to change it.");
  process.exit(2);
}
if (previous.mode === mode) {
  console.log("Already in " + mode + " mode: no changes");
  process.exit(0);
}
writeFileSync(file, JSON.stringify({ mode }, null, 2) + "\n");
console.log("Changed Netlify site mode from " + previous.mode + " to " + mode + ".");
console.log("This does not change the public apex DNS. Verify deployment before claiming success.");
