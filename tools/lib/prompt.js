import inquirer from "inquirer";

export async function promptOverride() {
  const { overwrite } = await inquirer.prompt([
    {
      type: "confirm",
      name: "overwrite",
      message:
        "A file containing the game data already exist. Would you like to overwrite it?",
      default: false,
    },
  ]);

  return overwrite;
}

export async function promptFetch() {
  const { fetch } = await inquirer.prompt([
    {
      type: "confirm",
      name: "fetch",
      message: "No game data were found. Would you like to fetch them?",
      default: true,
    },
  ]);

  return fetch;
}
