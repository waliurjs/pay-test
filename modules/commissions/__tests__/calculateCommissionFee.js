import { calculateCommissionFee, getFees } from '../calculateCommissionFee';
import * as commissionService from '../../../services/commissionService';

const inputJson = require('../../../__mocks__/statics/input.test.json');
const outputJson = require('../../../__mocks__/statics/output.test.json');
const inputWithBalanceJson = require('../../../__mocks__/statics/inputWithFreeBalance.test.json');

jest.mock('../../../services/commissionService');
describe('Commission fee calculation', () => {
  test('Calculate Cash in fee', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const fee = await calculateCommissionFee(inputJson[0], allTxnConfigs);
    expect(fee).toEqual('0.06');
  });

  test('Calculate Juridical Cash Out fee', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const fee = await calculateCommissionFee(inputJson[1], allTxnConfigs);
    expect(fee).toEqual('0.90');
  });

  test('Calculate Natural Cash Out fee (having free cash out balance)', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const fee = await calculateCommissionFee(inputWithBalanceJson[2], allTxnConfigs);
    expect(fee).toEqual('87.00');
  });

  test('Calculate Natural Cash Out fee (not having free cash out balance)', async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const fee = await calculateCommissionFee(inputWithBalanceJson[3], allTxnConfigs);
    expect(fee).toEqual('3.00');
  });

  test(`Should calculate multiple user's fees correctly`, async () => {
    const allTxnConfigs = await commissionService.getAllTxnConfigs();
    const outputs = await getFees(inputJson, allTxnConfigs);
    expect(outputs).toEqual(outputJson);
  });
});
