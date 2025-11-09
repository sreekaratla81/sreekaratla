import { Cli } from "clipanion";
import { run } from "@contentlayer/cli";

if (process.argv.length <= 2) {
  process.argv = [...process.argv.slice(0, 2), "build"];
}

function normalizeExitCode(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    if ("documentCount" in value) {
      return 0;
    }

    const candidate = "code" in value ? Number(value.code) : Number(value.value);
    if (Number.isFinite(candidate)) {
      return candidate;
    }
  }

  if (typeof value === "undefined") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 1;
}

const originalRunExit = Cli.prototype.runExit;

Cli.prototype.runExit = async function patchedRunExit(input, context) {
  try {
    const result = await this.run(input, context);
    const code = normalizeExitCode(result);
    process.exit(code);
  } catch (error) {
    console.error("[contentlayer:build] CLI failure", error);
    process.exit(1);
  }
};

run()
  .catch((error) => {
    console.error("[contentlayer:build] Unexpected failure", error);
    process.exit(1);
  })
  .finally(() => {
    Cli.prototype.runExit = originalRunExit;
  });
