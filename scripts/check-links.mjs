import fs from 'node:fs/promises';
import path from 'node:path';

async function readLinks() {
  const file = path.join(process.cwd(), 'scripts', 'external-links.json');
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
}

async function checkLink(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Received status ${response.status}`);
    }
    return { url, ok: true };
  } catch (error) {
    return { url, ok: false, error };
  }
}

async function main() {
  const links = await readLinks();
  const results = await Promise.all(links.map((url) => checkLink(url)));
  const failures = results.filter((result) => !result.ok);

  if (failures.length > 0) {
    failures.forEach((failure) => {
      console.error(`[check:links] ${failure.url} failed: ${failure.error?.message ?? 'Unknown error'}`);
    });
    process.exitCode = 1;
    return;
  }

  console.log(`[check:links] All ${results.length} external links reachable.`);
}

main().catch((error) => {
  console.error('[check:links] Unexpected failure', error);
  process.exitCode = 1;
});
