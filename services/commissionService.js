import fetch from 'node-fetch';
import errorMsg from '../error-messages/commission-errors';

const host = 'http://private-38e18c-uzduotis.apiary-mock.com';

const getCashInConfig = async () => {
  const response = await fetch(`${host}/config/cash-in`);
  return response.json();
};

/* It fetches cash out configs based of specified userType */
const getCashOutConfig = async (userType) => {
  if (userType !== 'natural' && userType !== 'juridical') {
    throw Error(`${errorMsg.UNKNOWN_USER_TYPE}. Received: ${userType}, ${userType !== 'natural'}`);
  }
  const response = await fetch(`${host}/config/cash-out/${userType}`);
  return response.json();
};

/* This fetches and combines all 3 types of transactions (in parallel) */
const getAllTxnConfigs = async () => {
  const [cashIn, naturalCashOut, juridicalCashOut] = await Promise.all([
    getCashInConfig(),
    getCashOutConfig('natural'),
    getCashOutConfig('juridical'),
  ]);

  return {
    cash_in: cashIn,
    cash_out: {
      natural: naturalCashOut,
      juridical: juridicalCashOut,
    },
  };
};

export { getAllTxnConfigs, getCashInConfig, getCashOutConfig };
