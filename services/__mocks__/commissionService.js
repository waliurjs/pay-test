import errorMsg from '../../error-messages/commission-errors';

const getAllTxnConfigsResponse = require('../../__mocks__/statics/getAllTxnConfigs.json');
const getCashInConfigResponse = require('../../__mocks__/statics/getCashInConfig.json');
const getNaturalCashOutConfigResponse = require('../../__mocks__/statics/getNaturalCashOutConfig.json');
const getJuridicalCashOutConfigResponse = require('../../__mocks__/statics/getJuridicalCashOutConfig.json');

export const getAllTxnConfigs = async () => getAllTxnConfigsResponse;
export const getCashInConfig = async () => getCashInConfigResponse;
export const getCashOutConfig = async (userType) => {
  if (userType === 'natural') return getNaturalCashOutConfigResponse;
  if (userType === 'juridical') return getJuridicalCashOutConfigResponse;
  throw Error(errorMsg.UNKNOWN_USER_TYPE);
};
