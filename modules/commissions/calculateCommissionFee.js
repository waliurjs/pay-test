import getWeek from 'date-fns/getWeek';
import errorMsg from '../../error-messages/commission-errors';

const cashInFee = (amount, { percents, max }) => {
  let fee = (amount * percents) / 100;
  fee = fee > max.amount ? max.amount : fee;
  return fee;
};

const naturalCashOutFee = (txn, { percents }) => {
  let fee;
  if (txn.freeBalance === 0) {
    fee = (txn.operation.amount * percents) / 100;
  } else if (txn.freeBalance <= txn.operation.amount) {
    fee = ((txn.operation.amount - txn.freeBalance) * percents) / 100;
  } else if (txn.freeBalance > txn.operation.amount) {
    fee = 0;
  }
  return fee;
};

const juridicalCashOutFee = (txn, { percents, min }) => {
  let fee = (txn.operation.amount * percents) / 100;
  fee = fee < min.amount ? min.amount : fee;
  return fee;
};

/* Calculates a single transaction's commission fee */
const calculateCommissionFee = (input, configs) => {
  let fee;
  if (input.type === 'cash_in') {
    fee = cashInFee(input.operation.amount, configs.cash_in);
  } else if (input.type === 'cash_out' && input.user_type === 'natural') {
    fee = naturalCashOutFee(input, configs.cash_out.natural);
  } else if (input.type === 'cash_out' && input.user_type === 'juridical') {
    fee = juridicalCashOutFee(input, configs.cash_out.juridical);
  } else {
    throw errorMsg.UNKNOWN_TRANSACTION_TYPE;
  }
  fee = Math.round(fee * 100) / 100;
  fee = fee.toFixed(2);

  return fee;
};

/* Calculates available weekly free balance right before each transaction is made */
const calculateWeeksFreeBalance = (transactions, config) => {
  const weeksFreeBalance = {};
  return transactions.map((txn) => {
    if (!(txn.type === 'cash_out' && txn.user_type === 'natural')) {
      return txn;
    }

    const week = getWeek(new Date(txn.date), { weekStartsOn: 1 });
    const key = `user:${txn.user_id}-week:${week}`;

    if (!(key in weeksFreeBalance)) {
      weeksFreeBalance[key] = config.week_limit.amount;
    }

    const balanceBeforeTxn = weeksFreeBalance[key];
    const balanceAfterTxn = weeksFreeBalance[key] - txn.operation.amount;
    weeksFreeBalance[key] = balanceAfterTxn > 0 ? balanceAfterTxn : 0;

    return { ...txn, freeBalance: balanceBeforeTxn };
  });
};

/* Calculates all users fees for each transaction */
const getFees = (_transactions, configs) => {
  if (!(Array.isArray(_transactions) && _transactions.length)) {
    return [];
  }

  const transactions = calculateWeeksFreeBalance(_transactions, configs.cash_out.natural);
  const fees = transactions.map((txn) => calculateCommissionFee(txn, configs));
  return fees;
};

export { calculateCommissionFee, calculateWeeksFreeBalance, getFees };
