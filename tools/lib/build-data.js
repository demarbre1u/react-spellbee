import ASCIIFolder from "fold-to-ascii";
import readline from "readline";
import {
  createReadStream,
  existsSync,
  unlinkSync,
  appendFileSync,
  mkdirSync,
} from "node:fs";

const MIN_WORD_LENGTH = 4;
const MAX_LETTERS = 7;

export async function buildData({ fetch }) {
  await buildParsedDict();
  const playableLetters = await buildPlayableLetters();
  await buildPlayableLettersDict(playableLetters);
}

async function buildParsedDict() {
  console.log("Building the parsed dictionary...");

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream("./data/dictionary.csv"),
    });

    if (existsSync("./data/parsed-dictionary.csv")) {
      unlinkSync("./data/parsed-dictionary.csv");
    }

    lineReader.on("line", (line) => {
      line = ASCIIFolder.foldReplacing(line);
      line = line.toLowerCase();
      if (!/^[a-z]+$/.test(line)) {
        return;
      }

      if (line.length < MIN_WORD_LENGTH) {
        return;
      }

      const letters = new Set(line.split(""));
      if (letters.size > MAX_LETTERS) {
        return;
      }

      appendFileSync("./data/parsed-dictionary.csv", `${line}\n`);
    });

    lineReader.on("close", resolve);

    lineReader.on("error", reject);
  });
}

async function buildPlayableLetters() {
  console.log("Building the playable letters file...");

  const playableLetters = new Set();

  await new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream("./data/parsed-dictionary.csv"),
    });

    if (existsSync("./out/playable-letters.csv")) {
      unlinkSync("./out/playable-letters.csv");
    }

    lineReader.on("line", (line) => {
      const letters = new Set(line.split("").sort());

      if (letters.size === 7) {
        let sortedLetters = [];
        for (const letter of letters) {
          sortedLetters.push(letter);
        }
        sortedLetters = sortedLetters.sort();

        playableLetters.add(sortedLetters.join(""));
      }
    });

    lineReader.on("close", resolve);

    lineReader.on("error", reject);
  });

  for (const letters of playableLetters) {
    appendFileSync("./out/playable-letters.csv", `${letters}\n`);
  }

  return playableLetters;
}

async function buildPlayableLettersDict(playableLetters) {
  console.log("Building the playable letter dictionaries...");

  if (!existsSync("./out/playable-letters-dict")) {
    mkdirSync("./out/playable-letters-dict");
  }

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream("./data/parsed-dictionary.csv"),
    });

    lineReader.on("line", (word) => {
      for (const letters of playableLetters) {
        const regex = new RegExp(`^[${letters}]+$`);
        if (!regex.test(word)) {
          continue;
        }

        appendFileSync(
          `./out/playable-letters-dict/${letters}.csv`,
          `${word}\n`
        );
      }
    });

    lineReader.on("close", resolve);

    lineReader.on("error", reject);
  });
}
