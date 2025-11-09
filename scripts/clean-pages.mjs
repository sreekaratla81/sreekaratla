#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const NEXT_DIR = '.next';
const LIMIT_BYTES = 24 * 1024 * 1024; // 24 MiB safety threshold
const ALLOWED_PREFIXES = [
  '.next/static/',
  '.next/server/app/',
  '.next/pagefind/'
];

async function pathExists(target) {
  try {
    await fs.stat(target);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function getPathSize(target) {
  const stats = await fs.stat(target);
  if (stats.isDirectory()) {
    const entries = await fs.readdir(target);
    const sizes = await Promise.all(
      entries.map((entry) => getPathSize(path.join(target, entry)))
    );
    return sizes.reduce((total, size) => total + size, 0);
  }
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

async function removeCache(nextDir, summary) {
  const cachePath = path.join(nextDir, 'cache');
  if (!(await pathExists(cachePath))) {
    return;
  }
  const cacheSize = await getPathSize(cachePath);
  await fs.rm(cachePath, { recursive: true, force: true });
  summary.push({ type: 'dir', path: '.next/cache', size: cacheSize });
}

async function pruneLargeFiles(nextDir, summary) {
  const queue = [nextDir];
  while (queue.length > 0) {
    const current = queue.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      const relativeFromRoot = path
        .relative(process.cwd(), entryPath)
        .split(path.sep)
        .join('/');

      if (entry.isDirectory()) {
        if (ALLOWED_PREFIXES.some((prefix) => relativeFromRoot.startsWith(prefix))) {
          queue.push(entryPath);
          continue;
        }
        queue.push(entryPath);
        continue;
      }

      const stats = await fs.stat(entryPath);
      if (stats.size <= LIMIT_BYTES) {
        continue;
      }

      const shouldKeep = ALLOWED_PREFIXES.some((prefix) =>
        relativeFromRoot.startsWith(prefix)
      );
      if (shouldKeep) {
        continue;
      }

      await fs.rm(entryPath, { force: true });
      summary.push({ type: 'file', path: relativeFromRoot, size: stats.size });
    }
  }
}

async function main() {
  const nextDir = path.join(process.cwd(), NEXT_DIR);
  if (!(await pathExists(nextDir))) {
    console.log('[clean:pages] .next directory not found; skipping.');
    return;
  }

  const summary = [];

  await removeCache(nextDir, summary);
  await pruneLargeFiles(nextDir, summary);

  if (summary.length === 0) {
    console.log('[clean:pages] No cache or oversized files to remove.');
    return;
  }

  let totalFreed = 0;
  for (const item of summary) {
    totalFreed += item.size || 0;
    const label = item.type === 'dir' ? 'Removed directory' : 'Removed file';
    console.log(`[clean:pages] ${label}: ${item.path} (${formatBytes(item.size || 0)})`);
  }

  console.log(`[clean:pages] Total reclaimed: ${formatBytes(totalFreed)}.`);
}

main().catch((error) => {
  console.error('[clean:pages] Failed:', error);
  process.exitCode = 1;
});
