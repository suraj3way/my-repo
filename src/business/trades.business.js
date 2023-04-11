// Models
import TradesModel from '@/models/trades.model';
import LedgersModel from '@/models/ledgers.model';
import AuthBusiness from '@/business/auth.business';

const getAllBuyRates = async () => {
  const mcxtrades = await TradesModel.find({ segment: 'mcx' });
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({ segment: 'eq' });
  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate);
  const eqsumBuyRates = eqbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    mcx: mcxsumBuyRates,
    eq: eqsumBuyRates
  };
};

const getAllsellRates = async () => {
  const mcxtrades = await TradesModel.find({ segment: 'mcx' });
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate);
  const mcxsumsellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({ segment: 'eq' });
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate);
  const eqsumsellRates = eqsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    mcx: mcxsumsellRates,
    eq: eqsumsellRates
  };
};

const getAllternover = async () => {
  const mcxtrades = await TradesModel.find({ segment: 'mcx' });
  const eqtrades = await TradesModel.find({ segment: 'eq' });
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate);
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const mcxsumSellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate);
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate);
  const eqsumBuyRates = eqbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const eqsumSellRates = eqsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    totalmcx: mcxsumBuyRates + mcxsumSellRates,
    totaleq: eqsumBuyRates + eqsumSellRates
  };
};

const getactivetrade = async () => {
  // Database query
  const mcxtrades = await TradesModel.find({
    status: 'active',
    segment: 'mcx'
  }).count();
  const eqtrades = await TradesModel.find({
    status: 'active',
    segment: 'eq'
  }).count();

  return {
    mcx: mcxtrades,
    eq: eqtrades
  };
};

const getAllProfitandloss = async () => {
  // Database query
  const mcxtrades = await TradesModel.find({ segment: 'mcx' });

  // Calculate profit and loss for each trade
  const mcxprofit = mcxtrades.map((trades) => trades.profit);
  const mcxallprofit = mcxprofit.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const mcxloss = mcxtrades.map((trades) => trades.loss);
  const mcxallloss = mcxloss.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  let mcxprofitloss = mcxallprofit - mcxallloss;

  const eqtrades = await TradesModel.find({ segment: 'eq' });

  // Calculate profit and loss for each trade
  const eqprofit = eqtrades.map((trades) => trades.profit);
  const eqallprofit = eqprofit.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqloss = eqtrades.map((trades) => trades.loss);
  const eqallloss = eqloss.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  let eqprofitloss = eqallprofit - eqallloss;

  return {
    mcx: mcxprofitloss,
    eq: eqprofitloss
  };
};

const getAllactive_buy = async () => {
  // Database query
  const mcxtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'buy',
    segment: 'mcx'
  });
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'buy',
    segment: 'eq'
  });
  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate);
  const eqsumBuyRates = eqbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    activemcx: mcxsumBuyRates,
    activeeq: eqsumBuyRates
  };
};

const getAllactive_sell = async () => {
  // Database query
  const mcxtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'sell',
    segment: 'mcx'
  });
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate);
  const mcxsumsellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'sell',
    segment: 'eq'
  });
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate);
  const eqsumsellRates = eqsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    activemcx: mcxsumsellRates,
    activeeq: eqsumsellRates
  };
};

const Brokerege = async () => {
  const mcxTrades = await TradesModel.find({ segment: 'mcx' });
  const mcxLedgers = await LedgersModel.find({
    trade_id: { $in: mcxTrades.map((trade) => trade._id) }
  });
  const mcxBrokerage = mcxLedgers.reduce(
    (accumulator, ledger) => accumulator + ledger.brokerage,
    0
  );

  const eqTrades = await TradesModel.find({ segment: 'eq' });
  const eqLedgers = await LedgersModel.find({
    trade_id: { $in: eqTrades.map((trade) => trade._id) }
  });
  const eqBrokerage = eqLedgers.reduce(
    (accumulator, ledger) => accumulator + ledger.brokerage,
    0
  );

  return {
    mcx: mcxBrokerage,
    eq: eqBrokerage
  };
};

// const Brokerege = async () => {
//   const mcxledgers = await LedgersModel.find().populate('trade_id',{segment:'mcx'}).count();
//   const eqledgers = await LedgersModel.find().populate('trade_id',{segment:'eq'}).count();

//   return {
//     mcx:mcxledgers,
//     eq:eqledgers
//   };
// }

// const Brokerege = async () => {
//   const buyledgers = await LedgersModel.find({type:'buy'});
//   const totalbuyBrokerage = buyledgers.reduce((accumulator, currentValue) => accumulator + currentValue.brokerage, 0);

//   const sellledgers = await LedgersModel.find({type:'sell'});
//   const totalsellBrokerage = sellledgers.reduce((accumulator, currentValue) => accumulator + currentValue.brokerage, 0);

//   return {
//     buyBrokerage:totalbuyBrokerage,
//     sellBrokerage:totalsellBrokerage
//   };
// }

const getAll = async () => {
  // Database query
  return await TradesModel.find({});
};

const getAllLedgers = async () => {
  // Database query
  return await LedgersModel.find({})
    .populate('trade_id')
    .populate('user_id')
    .populate('broker_id');
};

const getAllByStatus = async (status) => {
  // Database query
  return await TradesModel.find({ status });
};

const getByStatus = async (user_id, status) => {
  // Database query
  return await TradesModel.find({ user_id, status });
};

const getAllLogged = async (user_id) => {
  // Database query
  return await TradesModel.find({ user_id });
};

function getBrokarage(total, BrokeragePerCrore) {
  var broker_per = parseInt(BrokeragePerCrore) / 10000;
  var amaount = (total * broker_per) / 100;
  return amaount;
}

function checkBalanceInPercentage(fund, total) {
  if (fund >= 0.9 * total) {
    return true;
  } else {
    return false;
  }
}

async function closeAllTrades(user_id){
  var active_trades = await TradesModel.find({
    user_id: user_id,
    status: 'active'
  });
  var pendin_trades = await TradesModel.find({
    user_id: user_id,
    status: 'pending'
  });
  active_trades.forEach((trade) => {
    trade['status'] = "closed";
    trade.user_id = user_id;
    update(trade.id,trade)
  });
  pendin_trades.forEach((trade) => {
    trade['status'] = "closed";
    trade.user_id = user_id;
    update(trade.id,trade)
  });
  
}
async function getActivetradeAmount(user_id) {
  var active_trades = await TradesModel.find({
    user_id: user_id,
    status: 'active'
  });
  var pendin_trades = await TradesModel.find({
    user_id: user_id,
    status: 'pending'
  });
  var active_amount = 0;
  var pending_amaount = 0;
  active_trades.forEach((body) => {
    active_amount =
      active_amount +
      parseInt(body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate);
  });
  pendin_trades.forEach((body) => {
    pending_amaount =
      pending_amaount +
      parseInt(body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate);
  });

  return active_amount + pending_amaount;
}
const create = async (body, res) => {
  var user = await AuthBusiness.me(body?.user_id);
  var total_traded_amaount = await getActivetradeAmount(body?.user_id);
  var current_percentage_funds = await checkBalanceInPercentage(
    user?.funds,
    total_traded_amaount
  );
  console.log("375 --------- ",user?.funds,
  total_traded_amaount);

  if (current_percentage_funds) {
    var brokerage = 0;
    var amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
    if (body?.segment == 'mcx') {
      if(body.lots){
        amount = body?.lots * amount;
      }else{
        return {
          message:
            'Lots must not be empty'
        };
      }
      brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
    } else if (body?.segment == 'eq') {
      if(body.lots){
        amount = body?.lots * amount;
      }
      else if(body.units){
        amount = body?.units * amount;
      }
      brokerage = getBrokarage(amount, user?.EQBrokragePerCrore);
    } else {
      return {
        message:
          'You are not connected with any broker, please ask Admin to update your profile.'
      };
    }

    if (user?.funds && user?.funds > amount) {
      if (body?.isDirect) {
        body.status = 'active';
      }
      
      const trade = await TradesModel.create({
        ...body
      }); //.select({user_id:1,buy_rate:1});
      var remainingFund = user?.funds - amount;
      await AuthBusiness.updateFund(body?.user_id, remainingFund);
      //console.log("user",user)
      var ledger = {
        trade_id: trade._id,
        user_id: body?.user_id,
        broker_id: body.broker_id,
        amount: amount,
        brokerage: brokerage,
        type: body?.purchaseType ? body?.purchaseType : 'buy'
      };
      ///console.log("ledger",ledger)
      await LedgersModel.create({
        ...ledger
      });
      // const selectedTrade = await TradesModel.findOne({ _id: trade._id }).populate('user_id', 'name').select({ buy_rate: 1, _id:0  });
      //  return selectedTrade;
      return {
        name: user.name,
        buy_rate: trade.buy_rate
      };
    } else {
      return {
        message: "You don't have enough funds to excecute this trade."
      };
    }
  }else{
    await closeAllTrades(body.user_id)
    return {
      message:
        '90% of Your Fund is Used'
    };
  }
};

// s = 100
// b = 200

const update = async (id, body) => {
  var thisTrade = await TradesModel.findById(id);
  //console.log(body);
  var isProfit = false;
  if (body?.status == 'closed') {
    if (body?.buy_rate && body?.sell_rate) {
      if (thisTrade?.purchaseType == 'sell') {
        if (body?.sell_rate > body?.buy_rate) {
          body.profit = (body?.sell_rate - body?.buy_rate) * body?.lots;
          isProfit = true;
        }
        if (body?.sell_rate < body?.buy_rate) {
          body.loss = (body?.buy_rate - body?.sell_rate) * body?.lots;
        }
      } else {
        if (body?.sell_rate > body?.buy_rate) {
          body.profit = (body?.sell_rate - body?.buy_rate) * body?.lots;
          isProfit = true;
        }
        if (body?.sell_rate < body?.buy_rate) {
          body.loss = (body?.buy_rate - body?.sell_rate)* body?.lots;
        }
      }
    }
  }
  const trade = await TradesModel.findByIdAndUpdate(id, body, { new: true });
  var amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;

  if (body?.status == 'closed') {
    var user = await AuthBusiness.me(body?.user_id);
    // console.log("user",user);
    var brokerage = thisTrade?.brokerage ? thisTrade?.brokerage : 0;
    console.log("brok",brokerage)
    if (body?.segment == 'mcx') {
      if(body.lots){
        amount = body?.lots * amount;
      }else{
        return {
          message:
            'Lots must not be empty'
        };
      }
      brokerage = brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
    }
    if (body?.segment == 'eq') {
      if(body.lots){
        amount = body?.lots * amount;
      }
      else if(body.units){
        amount = body?.units * amount;
      }
      brokerage = brokerage + getBrokarage(amount, user?.EQBrokragePerCrore);
    }
    var ledger = {
      trade_id: id,
      user_id: body?.user_id,
      broker_id: body?.broker_id,
      amount: body?.sell_rate,
      brokerage: brokerage,
      type: body?.purchaseType ? body?.purchaseType : 'buy'
    };
    
    var remainingFund = user?.funds - amount - brokerage;
    console.log("funds",user?.funds , amount , brokerage)
    if (isProfit && body.buy_rate < body.sell_rate) {
      remainingFund = user?.funds + (amount - brokerage);
      console.log('profit');
    } 
    else if(isProfit && body.buy_rate > body.sell_rate){
      remainingFund = user?.funds - (amount - brokerage);
      console.log('loss');
    }
    else{
      remainingFund = user?.funds + body.buy_rate - brokerage;
      console.log("no profit/loss");
    }
    
    await AuthBusiness.updateFund(body?.user_id, remainingFund);
    await LedgersModel.create({
      ...ledger
    });
  }

  return trade;
};

const ledgerbalance = async (brokerageId) => {
  let data = await LedgersModel.find({ broker_id: brokerageId });
  const broker = data.map((broker) => broker.brokerage);
  const mcxsumBuyRates = broker.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return mcxsumBuyRates;
};

export default {
  getAll,
  getAllLogged,
  create,
  update,
  getAllByStatus,
  getByStatus,
  getAllLedgers,
  getAllBuyRates,
  getAllsellRates,
  getAllternover,
  getactivetrade,
  getAllProfitandloss,
  getAllactive_buy,
  getAllactive_sell,
  Brokerege,
  ledgerbalance
};
