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
import { createProgressBar, getLineCount } from "./utils.js";

/**
 * Builds the game data by doing the following :
 *  - parses the game dictionary, sanitizes words and filters invalid ones
 *  - creates of file containing every possible combination of playable letters
 *  - for each set of playable letters, creates of file containing every valid word
 * @async
 *
 * @param {object} param
 * @param {boolean} param.fetch Whether the game data should be fetched before building
 */
export async function buildData({ fetch }) {
  const alreadyExists = existsSync(DICT_PATH);

  if (alreadyExists) {
    if (fetch) {
      console.log("Game data already exists. Skipping fetching.");
    }
  } else {
    const shouldFetch = fetch || (await promptFetch());
    if (shouldFetch) {
      await fetchData({ overwrite: true });
    } else {
      console.log("Fetching required, the command will be terminated.");
      process.exit(0);
    }
  }

  await buildParsedDict();
  const playableLetters = await buildPlayableLetters();
  await buildPlayableLettersDict(playableLetters);
}

/**
 * Reads through the base dictionary to build a parsed dictionary
 *
 * The parse dictionary contains valid words that have been formatted
 * @async
 */
async function buildParsedDict() {
  console.log("Building the parsed dictionary...");

  const lineCount = await getLineCount(DICT_PATH);

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream(DICT_PATH),
    });

    if (existsSync(PARSED_DICT_PATH)) {
      unlinkSync(PARSED_DICT_PATH);
    }

    const progressBar = createProgressBar();
    progressBar.start(lineCount, 1);

    lineReader.on("line", (line) => {
      progressBar.increment();

      // Removing accents and formatting to lower case
      line = ASCIIFolder.foldReplacing(line);
      line = line.toLowerCase();

      // If the word doesn't contain only letters, it is invalid
      if (!/^[a-z]+$/.test(line)) {
        return;
      }

      // If the word is too short, it is invalid
      if (line.length < MIN_WORD_LENGTH) {
        return;
      }

      // If the word contains too many different letters, it is invalid
      const letters = new Set(line.split(""));
      if (letters.size > MAX_LETTERS) {
        return;
      }

      appendFileSync(PARSED_DICT_PATH, `${line}\n`);
    });

    lineReader.on("close", () => {
      progressBar.stop();
      resolve();
    });

    lineReader.on("error", (err) => {
      progressBar.stop();
      reject(err);
    });
  });
}

/**
 * Reads through the parsed dictionary to build a set of playable letters
 * @async
 *
 * @returns {Promise<Set<string>>} A set containing every combinations of playable letters
 */
async function buildPlayableLetters() {
  console.log("Building the playable letters file...");

  const playableLetters = new Set();
  const lineCount = await getLineCount(PARSED_DICT_PATH);

  await new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream(PARSED_DICT_PATH),
    });

    if (existsSync(PLAYABLE_LETTERS_PATH)) {
      unlinkSync(PLAYABLE_LETTERS_PATH);
    }

    const progressBar = createProgressBar();
    progressBar.start(lineCount, 1);

    lineReader.on("line", (line) => {
      progressBar.increment();

      const letters = new Set(line.split("").sort());

      // If the word contains the max number of unique letters allowed,
      // then we found a valid combination of playable letters
      if (letters.size === MAX_LETTERS) {
        let sortedLetters = [];
        for (const letter of letters) {
          sortedLetters.push(letter);
        }
        sortedLetters = sortedLetters.sort();

        playableLetters.add(sortedLetters.join(""));
      }
    });

    lineReader.on("close", () => {
      progressBar.stop();
      resolve();
    });

    lineReader.on("error", (err) => {
      progressBar.stop();
      reject(err);
    });
  });

  for (const letters of playableLetters) {
    appendFileSync(PLAYABLE_LETTERS_PATH, `${letters}\n`);
  }

  return playableLetters;
}

/**
 * Reads through the playable letters and the parsed dictionary
 *
 * For each combination of playable letters,
 * creates a file containing every valid words found in the parsed dictionary
 * @async
 */
async function buildPlayableLettersDict(playableLetters) {
  console.log("Building the playable letters dictionaries...");

  if (!existsSync(PLAYABLE_LETTERS_DIR)) {
    mkdirSync(PLAYABLE_LETTERS_DIR);
  }

  const lineCount = await getLineCount(PARSED_DICT_PATH);

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: createReadStream(PARSED_DICT_PATH),
    });

    const progressBar = createProgressBar();
    progressBar.start(lineCount, 1);

    lineReader.on("line", (word) => {
      for (const letters of playableLetters) {
        const lettersArray = letters.split("");

        // If the word doesn't contain letters found in the current combination of playable letter,
        // then it is invalid for this combination
        const invalid = word
          .split("")
          .some((letter) => !lettersArray.includes(letter));
        if (invalid) {
          continue;
        }

        appendFileSync(
          join(PLAYABLE_LETTERS_DIR, `${letters}.csv`),
          `${word}\n`
        );
      }

      progressBar.increment();
    });

    lineReader.on("close", () => {
      progressBar.stop();
      resolve();
    });

    lineReader.on("error", (err) => {
      progressBar.stop();
      reject(err);
    });
  });
}
