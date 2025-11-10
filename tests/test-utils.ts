import Module from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const rootRequire = Module.createRequire(path.join(process.cwd(), 'package.json'));
const testsDist = path.join(process.cwd(), '.tests-dist');
const ModuleCtor = Module.Module;
const moduleAny = ModuleCtor as unknown as {
  _resolveFilename: (
    request: string,
    parent: NodeModule | undefined,
    isMain: boolean,
    options: unknown
  ) => string;
};
const originalResolveFilename = moduleAny._resolveFilename;

if (!(globalThis as { __testsPatched?: boolean }).__testsPatched) {
  (globalThis as { __testsPatched?: boolean }).__testsPatched = true;
  moduleAny._resolveFilename = function resolveFilename(
    request: string,
    parent: NodeModule | undefined,
    isMain: boolean,
    options: unknown
  ) {
    if (request === 'contentlayer/generated') {
      return request;
    }
    if (request.startsWith('@/')) {
      const candidate = ensureJs(path.join(testsDist, request.slice(2)));
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return originalResolveFilename.call(ModuleCtor, request, parent, isMain, options);
  };
}

export const mockModule = (specifier: string, exports: Record<string, unknown>) => {
  const resolved = resolveSpecifier(specifier);
  const mocked = new Module.Module(resolved);
  mocked.filename = resolved;
  mocked.paths = [];
  mocked.exports = exports;
  mocked.loaded = true;
  require.cache[resolved] = mocked;
};

const resolveSpecifier = (specifier: string) => {
  if (specifier.startsWith('@/')) {
    return ensureJs(path.join(testsDist, specifier.slice(2)));
  }
  if (specifier.startsWith('.') || specifier.startsWith('..')) {
    return ensureJs(path.join(testsDist, 'tests', specifier));
  }
  if (specifier === 'contentlayer/generated') {
    return specifier;
  }
  return rootRequire.resolve(specifier);
};

const ensureJs = (candidate: string) => {
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  const withJs = `${candidate}.js`;
  if (fs.existsSync(withJs)) {
    return withJs;
  }
  return candidate;
};
