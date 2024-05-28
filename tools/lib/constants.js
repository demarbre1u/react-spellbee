import { join } from "path";

export const DICT_URL =
    "https://raw.githubusercontent.com/abourtnik/tusmo-bot/main/words.txt";

export const DICT_PATH = join(".", "data", "dictionary.csv");
export const PARSED_DICT_PATH = join(".", "data", "parsed-dictionary.csv");
export const PLAYABLE_LETTERS_PATH = join(".", "out", "playable-letters.csv");
export const PLAYABLE_LETTERS_DIR = join(".", "out", "playable-letters-dict");

export const MIN_WORD_LENGTH = 4;
export const MAX_LETTERS = 7;
