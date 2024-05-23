import { createReadStream } from "fs";
import wc from "wc-stream";
import chalk from "chalk";
import cliProgress from "cli-progress";

/**
 * Returns the number of line of a file
 * @async
 *
 * @param {string} filepath The path of the file
 *
 * @returns {Promise<number>} The number of line
 */
export async function getLineCount(filepath) {
  return new Promise((resolve, reject) => {
    createReadStream(filepath)
      .pipe(wc())
      .on("data", (data) => resolve(data.line))
      .on("error", reject);
  });
}

/**
 * Creates a progress bar
 *
 * @returns {cliProgress.SingleBar} The progress bar
 */
export function createProgressBar() {
  const progressBar = new cliProgress.SingleBar({
    format: chalk.green("{bar}") + "| {percentage}% ({value} / {total})",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  return progressBar;
}
