import ASCIIFolder from "fold-to-ascii";
import readline from "readline";
import process from "process";
import {
  createReadStream,
  existsSync,
  unlinkSync,
  appendFileSync,
  mkdirSync,
} from "node:fs";
import { promptFetch } from "./prompt.js";
import { fetchData } from "./fetch-data.js";
import {
  DICT_PATH,
  MAX_LETTERS,
  MIN_WORD_LENGTH,
  PARSED_DICT_PATH,
  PLAYABLE_LETTERS_DIR,
  PLAYABLE_LETTERS_PATH,
} from "./constants.js";
import { join } from "path";

export async function buildData({ fetch }) {
  const shouldFetch = fetch || (await promptFetch());
  if (shouldFetch) {
    await fetchData({ overwrite: true });
  } else {
    console.log("Fetching required, the command will be terminated.");
    process.exit(0);
  }

  await buildParsedDict();
  const playableLetters = await buildPlayableLetters();
  await buildPlayableLettersDict(playableLetters);
}

async function buildParsedDict() {
  console.log("Building the parsed dictionary...");

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream(DICT_PATH),
    });

    if (existsSync(PARSED_DICT_PATH)) {
      unlinkSync(PARSED_DICT_PATH);
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

      appendFileSync(PARSED_DICT_PATH, `${line}\n`);
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
      input: createReadStream(PARSED_DICT_PATH),
    });

    if (existsSync(PLAYABLE_LETTERS_PATH)) {
      unlinkSync(PLAYABLE_LETTERS_PATH);
    }

    lineReader.on("line", (line) => {
      const letters = new Set(line.split("").sort());

      if (letters.size === MAX_LETTERS) {
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
    appendFileSync(PLAYABLE_LETTERS_PATH, `${letters}\n`);
  }

  return playableLetters;
}

async function buildPlayableLettersDict(playableLetters) {
  console.log("Building the playable letter dictionaries...");

  if (!existsSync(PLAYABLE_LETTERS_DIR)) {
    mkdirSync(PLAYABLE_LETTERS_DIR);
  }

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream(PARSED_DICT_PATH),
    });

    lineReader.on("line", (word) => {
      for (const letters of playableLetters) {
        const regex = new RegExp(`^[${letters}]+$`);
        if (!regex.test(word)) {
          continue;
        }

        appendFileSync(
          join(PLAYABLE_LETTERS_DIR, `${letters}.csv`),
          `${word}\n`
        );
      }
    });

    lineReader.on("close", resolve);

    lineReader.on("error", reject);
  });
}
