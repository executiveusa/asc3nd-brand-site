import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = async (path) => readFile(new URL(path, import.meta.url), "utf8");
const campaign = "https://www.zeffy.com/en-US/donation-form/project-joy-asc3nd-the-joy";
const general = "https://www.zeffy.com/en-US/donation-form/the-asc3nd-collective";

test("Project Joy has the client-approved distinct Zeffy campaign", async () => {
  const initiative = await read("../lib/initiative-content.ts");
  const donation = await read("../lib/donation-config.ts");
  assert.ok(initiative.includes(campaign));
  assert.ok(donation.includes(general));
  assert.ok(!donation.includes(campaign));
  assert.match(initiative, /New Beginnings/);
  assert.match(initiative, /Friends of Youth/);
  assert.match(initiative, /toys, gifts, and essential items/);
});

test("Both languages render the same official Project Joy component", async () => {
  const en = await read("../app/projects/project-joy/page.tsx");
  const es = await read("../app/es/proyectos/project-joy/page.tsx");
  const component = await read("../components/ProjectJoyPageContent.tsx");
  assert.match(en, /ProjectJoyPageContent locale="en"/);
  assert.match(es, /ProjectJoyPageContent locale="es"/);
  assert.match(component, /projectJoy\.donationUrl/g);
  assert.match(component, /projectJoy\.artworkUrl/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /mailto:main@asc3ndcollective\.com/);
  assert.ok(!component.includes("initiative-pending-slot"));
});

test("Both events index cards feature the official Project Joy artwork", async () => {
  for (const path of ["../app/events/page.tsx","../app/es/eventos/page.tsx"]) {
    const s = await read(path);
    assert.match(s, /src=\{projectJoy\.artworkUrl\}/);
    assert.ok(!s.includes("Pending approved Project Joy campaign artwork"));
  }
});
