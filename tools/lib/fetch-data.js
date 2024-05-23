import stream from "node:stream";
import fs from "node:fs";

export async function fetchData({ overwrite }) {
  // TODO: check the overwrite param

  stream.Readable.fromWeb(
    (
      await fetch(
        "https://raw.githubusercontent.com/abourtnik/tusmo-bot/main/words.txt"
      )
    ).body
  ).pipe(fs.createWriteStream("./data/dictionary.csv"));
}
