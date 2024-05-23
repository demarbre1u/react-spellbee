import { createReadStream } from "fs";
import wc from "wc-stream";
import chalk from "chalk";
import cliProgress from "cli-progress";

export async function getLineCount(filepath) {
  return new Promise((resolve, reject) => {
    createReadStream(filepath)
      .pipe(wc())
      .on("data", (data) => resolve(data.line))
      .on("error", reject);
  });
}

export function createProgressBar() {
  const progressBar = new cliProgress.SingleBar({
    format: chalk.green("{bar}") + "| {percentage}% ({value} / {total})",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  return progressBar;
}
