import fs from 'fs';
import { getAllTxnConfigs } from './services/commissionService';
import { getFees } from './modules/commissions';

/* Takes the third argument as input file's path */
const [, , inputFilePath] = process.argv;

const run = async () => {
  try {
    /* Reads the input file */
    const blob = fs.readFileSync(`${__dirname}/${inputFilePath}`);
    const inputs = JSON.parse(blob);

    /* Fetches all 3 configs in parallel */
    const configs = await getAllTxnConfigs();

    /* Calculates the transaction fees */
    const fees = getFees(inputs, configs);

    /* Prints out fees in terminal */
    fees.forEach((fee) => process.stdout.write(`${fee}\n`));
  } catch (error) {
    process.stdout.write(`${error}\n`);
  }
};

/* Checks for a valid input file path */
if (!inputFilePath) {
  process.stdout.write(`Error: Expecting a json file path as single argument. Ex: input.json\n`);
  process.exit();
} else {
  run();
}
