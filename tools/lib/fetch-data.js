import stream from "node:stream";
import fs from "node:fs";
import process from "process";
import { promptOverride } from "./prompt.js";
import { DICT_PATH, DICT_URL } from "./constants.js";

export async function fetchData({ overwrite }) {
  const alreadyExists = fs.existsSync(DICT_PATH);
  if (alreadyExists) {
    const shouldOverwrite = overwrite || (await promptOverride());
    if (!shouldOverwrite) {
      process.exit(0);
    }
  }

  console.log("Fetching data...");

  stream.Readable.fromWeb((await fetch(DICT_URL)).body).pipe(
    fs.createWriteStream(DICT_PATH)
  );

  console.log("Data fetched successfully");
}
