import { calculateWeeksFreeBalance } from '..';
import * as commissionService from '../../../services/commissionService';

const inputs = require('../../../__mocks__/statics/input.test.json');

jest.mock('../../../services/commissionService');

describe(`Week's Free Cash Out balance calculation`, () => {
  test('Should not calculate balance for cash in transactions', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const [config] = await calculateWeeksFreeBalance([inputs[0]], allTxnConfigs.cash_out.natural);
    expect(config).not.toHaveProperty('freeBalance');
  });

  test('Should not calculate balance for juridical cash out transactions', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const [config] = await calculateWeeksFreeBalance([inputs[1]], allTxnConfigs.cash_out.natural);
    expect(config).not.toHaveProperty('freeBalance');
  });

  test('Should calculate balance for natural cash out transactions', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const [config] = await calculateWeeksFreeBalance([inputs[2]], allTxnConfigs.cash_out.natural);
    expect(config).toHaveProperty('freeBalance', 1000);
  });
});
