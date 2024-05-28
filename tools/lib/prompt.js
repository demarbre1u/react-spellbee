import inquirer from "inquirer";

/**
 * Prompts the user to ask them whether they would like to overwrite their data or not
 * @async
 *
 * @returns {Promise<boolean>} What the user chose
 */
export async function promptOverride() {
    const { overwrite } = await inquirer.prompt([
        {
            type: "confirm",
            name: "overwrite",
            message:
                "A file containing the game data already exist. Would you like to overwrite it?",
            default: false
        }
    ]);

    return overwrite;
}

/**
 * Prompts the user to ask them whether they would like to fetch their data or not
 * @async
 *
 * @returns {Promise<boolean>} What the user chose
 */
export async function promptFetch() {
    const { fetch } = await inquirer.prompt([
        {
            type: "confirm",
            name: "fetch",
            message: "No game data were found. Would you like to fetch them?",
            default: true
        }
    ]);

    return fetch;
}
