import fs from 'fs';
import { getAllTxnConfigs } from './services/commissionService';
import { getFees } from './modules/commissions';

const [, , inputFilePath] = process.argv;

const run = async () => {
  try {
    const blob = fs.readFileSync(`${__dirname}/${inputFilePath}`);
    const inputs = JSON.parse(blob);
    const configs = await getAllTxnConfigs();
    const fees = getFees(inputs, configs);
    fees.forEach((fee) => process.stdout.write(`${fee}\n`));
  } catch (error) {
    process.stdout.write(`${error}\n`);
  }
};

if (!inputFilePath) {
  process.stdout.write(`Error: Expecting a json file path as single argument. Ex: input.json\n`);
  process.exit();
} else {
  run();
}
