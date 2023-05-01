// Models
import BrokersModel from '@/models/broker.model';
import LedgersModel from '@/models/ledgers.model';
import TradesModel from '@/models/trades.model';
/**
 * login
 *
 * @param {*} email
 * @param {*} password
 * @returns {object}
 */
 
const login = async (username, password) => {
  const Broker = await BrokersModel.findOne({
    $or: [
      {
        email: username
      },
      {
        mobile: username
      }
    ]
  })
    .select('+password')
    .lean();

  if (Broker) {
    if (!Broker.password)
      throw {
        code: 'ERROR_LOGIN_2',
        message: `Don't have a password, try in recover password`
      };
    // const isMatchBrokers = await BrokersModel.compare(password, Broker.password);
    if (Broker.password !== password)
      throw {
        code: 'ERROR_LOGIN_3',
        message: `Incorrect password`
      };
    return Broker;
  } else {
    throw {
      code: 'ERROR_LOGIN_4',
      message: `User not found`
    };
  }
};



const getAll = async () => {
  // Database query
  return await BrokersModel.find({});
};

const getAllByStatus = async (status) => {
  // Database query
  return await BrokersModel.find({status});
};

const getByStatus = async (user_id,status) => {
  // Database query
  return await BrokersModel.find({ user_id,status });
};

const getAllLogged = async (user_id) => {
  // Database query
  return await BrokersModel.find({ user_id });
};


const create = async (body) => {
 
    const trade = await BrokersModel.create({
      ...body
    });
    return trade;
  
};

const update = async (id, body) => {

  const trade = BrokersModel.findByIdAndUpdate(id, body, { new: true })
  return trade;

};

const buybroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },segment:'mcx'});
  const mcxbuyRates = mcxtrades.map(trade => trade.buy_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },segment:'eq'});
  const eqbuyRates = eqtrades.map(trade => trade.buy_rate || 0);
  const eqsumBuyRates = eqbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    mcx:mcxsumBuyRates,
    eq:eqsumBuyRates
  };
};


const sellbroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },segment:'mcx'});
  const mcxbuyRates = mcxtrades.map(trade => trade.sell_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },segment:'eq'});
  const eqbuyRates = eqtrades.map(trade => trade.sell_rate || 0);
  const eqsumBuyRates = eqbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    mcx:mcxsumBuyRates,
    eq:eqsumBuyRates
  };
};




const totalbroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxbuytradeIds = data.map(ledger => ledger.trade_id);
  const mcxbuytrades = await TradesModel.find({ _id: { $in: mcxbuytradeIds },segment:'mcx'});
  const mcxbuyRates = mcxbuytrades.map(trade => trade.buy_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const mcxselltradeIds = data.map(ledger => ledger.trade_id);
  const mcxselltrades = await TradesModel.find({ _id: { $in: mcxselltradeIds },segment:'mcx'});
  const mcxsellRates = mcxselltrades.map(trade => trade.sell_rate || 0);
  const mcxsumsellRates = mcxsellRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqselltradeIds = data.map(ledger => ledger.trade_id);
  const eqselltrades = await TradesModel.find({ _id: { $in: eqselltradeIds },segment:'eq'});
  const eqbuyRates = eqselltrades.map(trade => trade.buy_rate || 0);
  const eqsumBuyRates = eqbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },segment:'eq'});
  const eqsellRates = eqtrades.map(trade => trade.sell_rate || 0);
  const eqsumsellRates = eqsellRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    mcx:mcxsumsellRates+mcxsumBuyRates,
    eq:eqsumsellRates+eqsumBuyRates
  };
};



const activebroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },status:'active',segment:'mcx'}).count();
  
  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },status:'active',segment:'eq'}).count();

  return {
    mcx:mcxtrades,
    eq:eqtrades
  };
};




const profitlossbroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },segment:'mcx'});

  const mcxprofit = mcxtrades.map(trades=>trades.profit  || 0);
  const mcxallprofit = mcxprofit.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
  const mcxloss = mcxtrades.map(trades=>trades.loss || 0);
  const mcxallloss = mcxloss.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  let mcxprofitloss=mcxallprofit-mcxallloss

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },segment:'eq'});
  
  const eqprofit = eqtrades.map(trades=>trades.profit || 0);
  const eqallprofit = eqprofit.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
  const eqloss = eqtrades.map(trades=>trades.loss || 0);
  const eqallloss = eqloss.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  let eqprofitloss=eqallprofit-eqallloss

  return {
    mcx:mcxprofitloss,
    eq:eqprofitloss
  };
};




const activebuybroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },status:'active',purchaseType: 'buy',segment:'mcx'});
  const mcxbuyRates = mcxtrades.map(trade => trade.buy_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },status:'active',purchaseType: 'buy',segment:'eq'});
  const eqbuyRates = eqtrades.map(trade => trade.buy_rate || 0);
  const eqsumBuyRates = eqbuyRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    mcx:mcxsumBuyRates,
    eq:eqsumBuyRates
  };
};





const activesellbroker = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },status:'active',purchaseType: 'sell',segment:'mcx'});
  const mcxsellRates = mcxtrades.map(trade => trade.sell_rate || 0);
  const mcxsumsellRates = mcxsellRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },status:'active',purchaseType: 'sell',segment:'eq'});
  const eqsellRates = eqtrades.map(trade => trade.sell_rate || 0);
  const eqsumsellRates = eqsellRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    mcx:mcxsumsellRates,
    eq:eqsumsellRates
  };
};



const Brokerage = async (brokerageId) => {

  let data = await LedgersModel.find({ broker_id: brokerageId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },segment:'mcx'});
  const mcxLedgers = await LedgersModel.find({trade_id: {$in: mcxtrades.map(trade => trade._id)}});
  const mcxBrokerage = mcxLedgers.reduce((accumulator, ledger) => accumulator + ledger.brokerage, 0);

  const eqtradeIds = data.map(ledger => ledger.trade_id);
  const eqtrades = await TradesModel.find({ _id: { $in: eqtradeIds },segment:'eq'});
  const eqLedgers = await LedgersModel.find({trade_id: {$in: eqtrades.map(trade => trade._id)}});
  const eqBrokerage = eqLedgers.reduce((accumulator, ledger) => accumulator + ledger.brokerage, 0);


  return {
    mcx:mcxBrokerage,
    eq:eqBrokerage
  };
};



const getbrokerageByStatus = async (brokerId,status) => {

  let data = await LedgersModel.find({ broker_id: brokerId });

  const mcxtradeIds = data.map(ledger => ledger.trade_id);
  const mcxtrades = await TradesModel.find({ _id: { $in: mcxtradeIds },status});

 return mcxtrades;

};




export default {
  getAll,
  getAllLogged,
  create,
  update,
  getAllByStatus,
  getByStatus,
  login,
  buybroker,
  sellbroker,
  totalbroker,
  activebroker,
  profitlossbroker,
  activebuybroker,
  activesellbroker,
  Brokerage,
  getbrokerageByStatus
};
