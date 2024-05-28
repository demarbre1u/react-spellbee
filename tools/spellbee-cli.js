import { Command } from "commander";

import { buildData } from "./lib/build-data.js";
import { fetchData } from "./lib/fetch-data.js";

const program = new Command();

program
  .name("spellbee-cli")
  .description("CLI to fetch and build the game data for the game")
  .version("1.0.0");

program
  .command("fetch")
  .description("Fetches the game data")
  .option(
    "-o, --overwrite",
    "overwrite the game data if they are already written on disk"
  )
  .action(async options => {
    await fetchData({ overwrite: options.overwrite });
  });

program
  .command("build")
  .description("Builds the game data")
  .option(
    "-f, --fetch",
    "fetch the game data before building if they don't exist"
  )
  .action(async options => {
    await buildData({ fetch: options.fetch });
  });

program.parse();
