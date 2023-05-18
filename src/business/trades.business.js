// Models
import TradesModel from '@/models/trades.model';
import LedgersModel from '@/models/ledgers.model';
import AuthBusiness from '@/business/auth.business';
import BrokersBusiness from '@/business/broker.business';
import adminNotificationBusiness from '@/business/adminnotification.bussiness';
import userNotificationBusiness from '@/business/usernotification.bussiness';
import NotificationBusiness from '@/business/notification.bussiness';
import TradesBusiness from '@/business/trades.business';

import admin from '@/firebase/firebase';

import UserModel from '@/models/user.model';
import { async } from '@babel/runtime/regenerator';
import { isCancel } from 'apisauce';
const ObjectId = require('mongodb').ObjectId;

const io = require('socket.io-client');
const socket = io('ws://5.22.221.190:8000', {
  transports: ['websocket']
});
const socket2 = io('ws://5.22.221.190:5000', {
  transports: ['websocket']
});

const getAllBuyRates = async () => {
  const mcxtrades = await TradesModel.find({ segment: 'mcx' });
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({ segment: 'eq' });
  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate || 0);
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
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate || 0);
  const mcxsumsellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({ segment: 'eq' });
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate || 0);
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
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate || 0);
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const mcxsumSellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate || 0);
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate || 0);
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
  const mcxprofit = mcxtrades.map((trades) => trades.profit || 0);
  const mcxallprofit = mcxprofit.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const mcxloss = mcxtrades.map((trades) => trades.loss || 0);
  const mcxallloss = mcxloss.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  let mcxprofitloss = mcxallprofit - mcxallloss;

  const eqtrades = await TradesModel.find({ segment: 'eq' });

  // Calculate profit and loss for each trade
  const eqprofit = eqtrades.map((trades) => trades.profit || 0);
  const eqallprofit = eqprofit.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqloss = eqtrades.map((trades) => trades.loss || 0);
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
  const mcxbuyRates = mcxtrades.map((trade) => trade.buy_rate || 0);
  const mcxsumBuyRates = mcxbuyRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'buy',
    segment: 'eq'
  });
  const eqbuyRates = eqtrades.map((trade) => trade.buy_rate || 0);
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
  const mcxsellRates = mcxtrades.map((trade) => trade.sell_rate || 0);
  const mcxsumsellRates = mcxsellRates.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const eqtrades = await TradesModel.find({
    status: 'active',
    purchaseType: 'sell',
    segment: 'eq'
  });
  const eqsellRates = eqtrades.map((trade) => trade.sell_rate || 0);
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
  let data = await TradesModel.find({});
  const userIds = data.map((trade) => trade.user_id);
  // Fetch user data and map it with trade data
  const users = await UserModel.find({ _id: { $in: userIds } });
  const newData = data.map((trade) => {
    const user = users.find(
      (user) => user?._id.toString() === trade.user_id.toString()
    );
    return {
      ...trade.toObject(),
      name: user ? user?.name : null,
      username: user ? user?.username : null
    };
  });
  return newData;
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
  const today = new Date();

  const startOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
  );
  const endOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
  );
  const data = await TradesModel.find({
    status,
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });

  // Extract trade IDs and user IDs from the trade information
  const tradeIds = data.map((trade) => trade._id);
  const userIds = data.map((trade) => trade.user_id);

  // Fetch user information
  const users = await UserModel.find({ _id: { $in: userIds } });

  // Map user IDs to user names
  const userIdToNameMap = {};
  users.forEach((user) => {
    userIdToNameMap[user._id.toString()] = user?.user_id;
  });

  // Fetch ledger information
  const ledgers = await LedgersModel.find({ trade_id: { $in: tradeIds } });

  // Map the brokerage values to an array
  const brokerages = ledgers.map((ledger) => ledger.brokerage || 0);

  // Add brokerage value and user name to each trade object
  const dataWithBrokerageAndUserName = data.map((trade) => {
    const matchingLedger = ledgers.find(
      (ledger) => ledger.trade_id.toString() === trade._id.toString()
    );
    return {
      ...trade._doc,
      brokerage: matchingLedger ? matchingLedger.brokerage : 0,
      user_name: userIdToNameMap[trade.user_id.toString()] || 'Unknown User'
    };
  });

  return dataWithBrokerageAndUserName;
};

// const getByStatus = async (user_id, status) => {
//   // Database query
//   return await TradesModel.find({ user_id, status });
// };

const getByStatus = async (user_id, status) => {
  let data;
  if (status === 'closed') {
    const today = new Date();

    const startOfWeek = new Date(
      today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
    );

    // Database query with filter for the current week (Monday to Friday)
    return await TradesModel.find({
      status,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek }
    });
  } else {
    // For all other statuses, send data
    data = await TradesModel.find({ user_id, status });
  }
  return data;
};

const getAllLogged = async (user_id) => {
  // Database query
  return await TradesModel.find({ user_id });
};

function profit_sharing(total, profitLossPercentage) {
  var amaount = (total * profitLossPercentage) / 100;
  return amaount;
}

function getBrokarage(total, BrokeragePerCrore) {
  var broker_per = parseInt(BrokeragePerCrore) / 100000;
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
// async function closeAllTradesPL(user_id, profit, loss, sell) {
//   var active_trades = await TradesModel.updateMany(
//     {
//       user_id: user_id,
//       status: 'active'
//     },
//     { $set: { status: 'closed', sell_rate: sell, profit: profit, loss: loss } }
//   );
// }
async function closeAllTradesPL(user_id, profit, loss, rate, purchaseType) {
  var updateFields = {
    status: 'closed',
    profit: profit,
    loss: loss
  };

  if (purchaseType === 'buy') {
    updateFields.sell_rate = rate;
  } else if (purchaseType === 'sell') {
    updateFields.buy_rate = rate;
  }

  var active_trades = await TradesModel.updateMany(
    {
      user_id: user_id,
      status: 'active'
    },
    { $set: updateFields }
  );
}

// { $set: { status: 'closed', loss: loss } }
async function closeAllTrades(user_id) {
  var active_trades = await TradesModel.updateMany(
    {
      user_id: user_id,
      status: 'active'
    },
    { status: 'closed' }
  );
  // var pendin_trades = await TradesModel.find({
  //   user_id: user_id,
  //   status: 'pending'
  // });
  // active_trades.forEach((trade) => {
  //   trade['status'] = 'closed';
  //   trade.user_id = user_id;
  //   update(trade.id, trade);
  // });
  // pendin_trades.forEach((trade) => {
  //   trade['status'] = 'closed';
  //   trade.user_id = user_id;
  //   update(trade.id, trade);
  // });
}
async function getActivetradeAmount(user_id) {
  var active_trades = await TradesModel.find({
    user_id: user_id,
    status: 'active'
  });
  // var pendin_trades = await TradesModel.find({
  //   user_id: user_id,
  //   status: 'pending'
  // });
  var active_amount = 0;
  // var pending_amaount = 0;
  active_trades.forEach((body) => {
    active_amount =
      active_amount +
      parseInt(body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate);
  });
  // pendin_trades.forEach((body) => {
  //   pending_amaount =
  //     pending_amaount +
  //     parseInt(body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate);
  // });

  return active_amount;
}

async function getActivetrades(user_id) {
  var active_trades = await TradesModel.find({
    user_id: user_id,
    status: 'active'
  });
  return active_trades;
}

async function getpendingtrades(user_id) {
  var pending_trades = await TradesModel.find({
    user_id: user_id,
    status: 'pending'
  });
  return pending_trades;
}

async function getAllactivetrade(tradeId) {
  var active_trades = await TradesModel.find({
    trade_id: tradeId,
    status: 'active'
  });
  return active_trades;
}

const create = async (body, res) => {
  var user = await AuthBusiness.me(body?.user_id);
  var broker = await BrokersBusiness.findbroker(body.broker_id);
  socket.emit('join', body.script);
  if (body?.status != 'pending') {
    var total_traded_amaount = await getActivetradeAmount(body?.user_id);
    var current_percentage_funds = await checkBalanceInPercentage(
      user?.funds,
      total_traded_amaount
    );
    var all_active_trades = await getActivetrades(body?.user_id);
    if (current_percentage_funds) {
      var brokerage = 0;
      var amount =
        body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
      if (body?.segment.toLowerCase() == 'mcx') {
        if (body.lots) {
          amount = body?.lots * amount;
        } else {
          return {
            message: 'Lots must not be empty'
          };
        }
        if (broker.type == 'profit sharing') {
          brokerage = profit_sharing(amount, broker?.profitLossPercentage);
        } else {
          brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      } else if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          amount = body?.lots * amount;
        } else if (user?.equityTradeType == 'units' && body.units) {
          amount = body?.units * amount;
        } else {
          return {
            message: 'Lots or Units must not be empty'
          };
        }
        if (broker.type == 'profit sharing') {
          brokerage = profit_sharing(amount, broker?.profitLossPercentage);
        } else {
          brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      } else {
        return {
          message:
            'You are not connected with any broker, please ask Admin to update your profile.'
        };
      }

      var intradayMCXmarging = 0;
      if (body?.segment.toLowerCase() == 'mcx' && amount) {
        if (body.lots) {
          intradayMCXmarging =
            (amount * body.lot_size) / user?.intradayExposureMarginMCX;
        } else {
          intradayMCXmarging =
            (amount * body.units) / user?.intradayExposureMarginMCX;
        }
      } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
        if (body.lots) {
          intradayMCXmarging =
            (amount * body.lot_size) / user?.intradayExposureMarginMCX;
        } else if (body.units) {
          intradayMCXmarging =
            (amount * body.units) / user?.intradayExposureMarginMCX;
        }
      }
      var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
      if (availbleIntradaymargingMCX < 0) {
        return { message: 'intradayMCXmarging not availble' };
      }

      var intradayEQmarging = 0;
      if (body?.segment.toLowerCase() == 'eq' && amount) {
        if (body.lots) {
          intradayEQmarging =
            (amount * body.lot_size) / user?.intradayExposureMarginEQ;
        } else {
          intradayEQmarging =
            (amount * body.units) / user?.intradayExposureMarginEQ;
        }
      } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
        if (body.lots) {
          intradayEQmarging =
            (amount * body.lot_size) / user?.intradayExposureMarginEQ;
        } else if (body.units) {
          intradayEQmarging =
            (amount * body.units) / user?.intradayExposureMarginEQ;
        }
      }
      all_active_trades.forEach(async (body) => {
        if (body?.segment.toLowerCase() == 'mcx' && amount) {
          if (body.lots) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.lot_size) / user?.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
          if (body.lots) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.lot_size) / user?.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        }
        var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;

        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }

        if (body?.segment.toLowerCase() == 'eq' && amount) {
          if (body.lots) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.lot_size) / user?.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.units) / user?.intradayExposureMarginEQ;
          }
        } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
          if (body.lots) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.lot_size) / user?.intradayExposureMarginEQ;
          } else if (body.units) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.units) / user?.intradayExposureMarginEQ;
          }
        }
      });
      var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

      if (availbleIntradaymargingEQ < 0) {
        return { message: 'intradayEQmarging not availble' };
      }

      const currentTime = new Date();
      const marketOpenTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        9,
        0
      );
      const marketCloseTime =
        body.segment === 'eq'
          ? new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate(),
              15,
              30
            )
          : new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate(),
              23,
              30
            );

      if (currentTime < marketOpenTime || currentTime > marketCloseTime) {
        return {
          message: 'Out of market hours. Cannot execute the trade.'
        };
      }

      if (user?.funds > 0) {
        if (body?.isDirect) {
          body.status = 'active';
        }

        const trade = await TradesModel.create({
          ...body
        }); //.select({user_id:1,buy_rate:1});
        // var remainingFund = user?.funds - amount;
        // await AuthBusiness.updateFund(body?.user_id, remainingFund);
        //console.log("user",user)
        // var ledger = {
        //   trade_id: trade._id,
        //   user_id: body?.user_id,
        //   broker_id: body.broker_id,
        //   amount: amount,
        //   brokerage: brokerage,
        //   type: body?.purchaseType ? body?.purchaseType : 'buy'
        // };
        ///console.log("ledger",ledger)
        // await LedgersModel.create({
        //   ...ledger
        // });
        // const selectedTrade = await TradesModel.findOne({ _id: trade._id }).populate('user_id', 'name').select({ buy_rate: 1, _id:0  });
        //  return selectedTrade;

        var all_active_trade = await getActivetrades(body?.user_id);
        var script = all_active_trade.map((trade) => trade.script);
        var mcx_scripts = script;
        var done_scripts = [];

        let mcx_eq =
          body.segment == 'mcx'
            ? availbleIntradaymargingMCX
            : availbleIntradaymargingEQ;

        let totalResult = 0;

        // var socket = io('ws://5.22.221.190:8000', {
        //   transports: ['websocket']
        // });
        for (const script of mcx_scripts) {
          socket.emit('join', script);
        }

        var seventy = false;
        socket.on('stock', async (data) => {
          // console.log(data.ask,'mcx');
          for (const script of mcx_scripts) {
            var result = 0;
            all_active_trade = await getActivetrades(body?.user_id);
            // var alllots = all_active_trade.map((trade) => trade.lots);
            var current_trade = all_active_trade.filter(
              (trade) => trade.script == script
            );
            current_trade = current_trade[0];
            var user = await UserModel.find({ _id: current_trade?.user_id });
            user = user[0];
            var amount =
              current_trade?.purchaseType == 'buy'
                ? current_trade?.buy_rate
                : current_trade?.sell_rate;
            let lotunit =
              current_trade?.lots > 0
                ? current_trade?.lots * current_trade?.lot_size
                : current_trade?.units;
            if (body?.segment.toLowerCase() == 'mcx' && amount) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            } else if (
              body?.segment.toLowerCase() == 'mcx' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else if (body.units) {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            }

            availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
            if (availbleIntradaymargingMCX < 0) {
              return { message: 'intradayMCXmarging not availble' };
            }

            if (body?.segment.toLowerCase() == 'eq' && amount) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            } else if (
              body?.segment.toLowerCase() == 'eq' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else if (current_trade?.units) {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            }
            all_active_trades.forEach(async (current_trade) => {
              if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'mcx' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else if (current_trade?.units) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              }
              availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;

              if (availbleIntradaymargingMCX < 0) {
                return { message: 'intradayMCXmarging not availble' };
              }

              if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'eq' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else if (current_trade?.units) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              }
            });
            availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

            if (availbleIntradaymargingEQ < 0) {
              return { message: 'intradayEQmarging not availble' };
            }
            if (body.purchaseType == 'buy') {
              result = (data.ask - current_trade?.buy_rate) * lotunit;
              // totalResults += results;
            } else {
              result = (data.bid - current_trade?.sell_rate) * lotunit;
              // totalResults += results;
            }
          }

          let mcx_eq =
            body.segment == 'mcx'
              ? availbleIntradaymargingMCX
              : availbleIntradaymargingEQ;

          var remainingblance = user?.funds - result;
          let finalmarign = mcx_eq + result;

          if (0.3 * user?.funds >= finalmarign && !seventy) {
            seventy = true;
            console.log('70%');
            const payload = {
              notification: {
                title: 'New Notification',
                body: `User Used 70% blance availble blance ${remainingblance} by STOPLOSS(762)`
              }
            };
            await NotificationBusiness.create({
              notification: payload.notification.body
            });

            const adminnotification = await adminNotificationBusiness.getAll();
            const admintokens = adminnotification.map(
              (user) => user?.fcm_token
            );

            const usernotification = await userNotificationBusiness.getAll();
            const usertokens = usernotification.map((user) => user?.fcm_token);

            const tokens = admintokens || usertokens;

            const multicastMessage = {
              tokens: tokens,
              webpush: {
                notification: payload.notification
              }
            };
            admin
              .messaging()
              .sendMulticast(multicastMessage)
              .then((response) => {
                // socket.disconnect();
                // console.log('Notification sent successfully:', response);
              })
              .catch((error) => {
                console.log('Error sending notification');
              });
          }
        });

        for (const script of mcx_scripts) {
          socket2.emit('join', script);
        }

        var eqseventy = false;
        socket2.on('stock', async (data) => {
          // console.log(data.ask,'eq');
          for (const script of mcx_scripts) {
            var result = 0;
            all_active_trade = await getActivetrades(body?.user_id);
            // var alllots = all_active_trade.map((trade) => trade.lots);
            var current_trade = all_active_trade.filter(
              (trade) => trade.script == script
            );
            current_trade = current_trade[0];
            var user = await UserModel.find({ _id: current_trade?.user_id });
            user = user[0];
            var amount =
              current_trade?.purchaseType == 'buy'
                ? current_trade?.buy_rate
                : current_trade?.sell_rate;
            let lotunit =
              current_trade?.lots > 0
                ? current_trade?.lots * current_trade?.lot_size
                : current_trade?.units;
            if (body?.segment.toLowerCase() == 'mcx' && amount) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            } else if (
              body?.segment.toLowerCase() == 'mcx' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else if (body.units) {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            }

            availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
            if (availbleIntradaymargingMCX < 0) {
              return { message: 'intradayMCXmarging not availble' };
            }

            if (body?.segment.toLowerCase() == 'eq' && amount) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            } else if (
              body?.segment.toLowerCase() == 'eq' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else if (current_trade?.units) {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            }
            all_active_trades.forEach(async (current_trade) => {
              if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'mcx' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else if (current_trade?.units) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              }
              availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;

              if (availbleIntradaymargingMCX < 0) {
                return { message: 'intradayMCXmarging not availble' };
              }

              if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'eq' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else if (current_trade?.units) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              }
            });
            availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

            if (availbleIntradaymargingEQ < 0) {
              return { message: 'intradayEQmarging not availble' };
            }
            if (body.purchaseType == 'buy') {
              result = (data.ask - current_trade?.buy_rate) * lotunit;
              // totalResults += results;
            } else {
              result = (data.bid - current_trade?.sell_rate) * lotunit;
              // totalResults += results;
            }
          }
          let mcx_eq =
            body.segment == 'mcx'
              ? availbleIntradaymargingMCX
              : availbleIntradaymargingEQ;

          var remainingblance = user?.funds - result;
          let finalmarign = mcx_eq + result;
          // console.log(finalmarign,'finalmarign');
          if (0.3 * user?.funds >= finalmarign && !eqseventy) {
            eqseventy = true;
            console.log('70%');
            const payload = {
              notification: {
                title: 'New Notification',
                body: `User Used 70% blance availble blance ${remainingblance} by STOPLOSS(762)`
              }
            };
            await NotificationBusiness.create({
              notification: payload.notification.body
            });

            const adminnotification = await adminNotificationBusiness.getAll();
            const admintokens = adminnotification.map(
              (user) => user?.fcm_token
            );

            const usernotification = await userNotificationBusiness.getAll();
            const usertokens = usernotification.map((user) => user?.fcm_token);

            const tokens = admintokens || usertokens;

            const multicastMessage = {
              tokens: tokens,
              webpush: {
                notification: payload.notification
              }
            };
            admin
              .messaging()
              .sendMulticast(multicastMessage)
              .then((response) => {
                // socket.disconnect();
                // console.log('Notification sent successfully:', response);
              })
              .catch((error) => {
                console.log('Error sending notification');
              });
          }
        });

        for (const script of mcx_scripts) {
          socket.emit('join', script);
        }

        var ninty = false;
        socket.on('stock', async (data) => {
          for (const script of mcx_scripts) {
            var results = 0;
            all_active_trade = await getActivetrades(body?.user_id);
            // var alllots = all_active_trade.map((trade) => trade.lots);
            var current_trade = all_active_trade.filter(
              (trade) => trade.script == script
            );
            current_trade = current_trade[0];
            var user = await UserModel.find({ _id: current_trade?.user_id });
            user = user[0];
            var amount =
              current_trade?.purchaseType == 'buy'
                ? current_trade?.buy_rate
                : current_trade?.sell_rate;
            let lotunits =
              current_trade?.lots > 0
                ? current_trade?.lots * current_trade?.lot_size
                : current_trade?.units;
            if (body?.segment.toLowerCase() == 'mcx' && amount) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            } else if (
              body?.segment.toLowerCase() == 'mcx' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else if (body.units) {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            }

            availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
            if (availbleIntradaymargingMCX < 0) {
              return { message: 'intradayMCXmarging not availble' };
            }

            if (body?.segment.toLowerCase() == 'eq' && amount) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            } else if (
              body?.segment.toLowerCase() == 'eq' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else if (current_trade?.units) {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            }
            all_active_trades.forEach(async (current_trade) => {
              if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'mcx' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else if (current_trade?.units) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              }
              availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
              if (availbleIntradaymargingMCX < 0) {
                return { message: 'intradayMCXmarging not availble' };
              }

              if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'eq' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else if (current_trade?.units) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              }
            });
            availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

            if (availbleIntradaymargingEQ < 0) {
              return { message: 'intradayEQmarging not availble' };
            }
            if (body.purchaseType == 'buy') {
              results = (data.ask - current_trade?.buy_rate) * lotunits;
              // totalResults += results;
            } else {
              results = (data.bid - current_trade?.sell_rate) * lotunits;
              // totalResults += results;
            }
          }

          let mcx_eqs =
            body.segment == 'mcx'
              ? availbleIntradaymargingMCX
              : availbleIntradaymargingEQ;

          var remainingblances = user?.funds - results;
          let finalmarigns = mcx_eqs + results;
          if (0.1 * user?.funds >= finalmarigns && !ninty) {
            ninty = true;
            console.log('90%');
            const payload = {
              notification: {
                title: 'New Notification',
                body: `User Used 90% blance availble blance ${remainingblances} by STOPLOSS(762)`
              }
            };
            await NotificationBusiness.create({
              notification: payload.notification.body
            });

            const adminnotification = await adminNotificationBusiness.getAll();
            const admintokens = adminnotification.map(
              (user) => user?.fcm_token
            );

            const usernotification = await userNotificationBusiness.getAll();
            const usertokens = usernotification.map((user) => user?.fcm_token);

            const tokens = admintokens || usertokens;

            const multicastMessage = {
              tokens: tokens,
              webpush: {
                notification: payload.notification
              }
            };
            admin
              .messaging()
              .sendMulticast(multicastMessage)
              .then((response) => {
                // console.log('Notification sent successfully:', response);
              })
              .catch((error) => {
                console.log('Error sending notification');
              });

            var brokerage = 0;
            amount =
              body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
            if (body?.segment.toLowerCase() == 'mcx') {
              if (current_trade?.lots) {
                amount = body?.lots * body?.lot_size * amount;
              } else {
                return {
                  message: 'Lots must not be empty'
                };
              }
              if (broker.type == 'profit sharing') {
                brokerage = profit_sharing(
                  amount,
                  broker?.profitLossPercentage
                );
              } else {
                brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
              }
            } else if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots' && current_trade?.lots) {
                amount = current_trade?.lots * current_trade?.lot_size * amount;
              } else if (
                user?.equityTradeType == 'units' &&
                current_trade?.units
              ) {
                amount = current_trade?.units * amount;
              } else {
                return {
                  message: 'Lots or Units must not be empty'
                };
              }
              if (broker.type == 'profit sharing') {
                brokerage = profit_sharing(
                  amount,
                  broker?.profitLossPercentage
                );
              } else {
                brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
              }
            }

            var buybrokerage = 0;
            var buyamount =
              current_trade?.purchaseType == 'buy' ? data.bid : data.ask;
            if (current_trade?.segment.toLowerCase() == 'mcx') {
              if (current_trade?.lots) {
                buyamount =
                  current_trade?.lots * current_trade?.lot_size * buyamount;
              } else {
                return {
                  message: 'Lots must not be empty'
                };
              }

              if (broker.type == 'profit sharing') {
                buybrokerage = profit_sharing(
                  buyamount,
                  broker?.profitLossPercentage
                );
              } else {
                buybrokerage = getBrokarage(
                  buyamount,
                  user?.mcxBrokeragePerCrore
                );
              }
            }
            if (current_trade?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots' && body.lots) {
                buyamount = current_trade?.lots * buyamount;
              } else if (user?.equityTradeType == 'units' && body.units) {
                buyamount = current_trade?.units * buyamount;
              }
              if (broker.type == 'profit sharing') {
                buybrokerage = profit_sharing(
                  buyamount,
                  broker?.profitLossPercentage
                );
              } else {
                buybrokerage = getBrokarage(
                  buyamount,
                  user?.mcxBrokeragePerCrore
                );
              }
            }

            // // await closeAllTrades(body.user_id);
            all_active_trade.map(async (trade) => {
              var isProfit = false;

              if (trade.purchaseType == 'sell') {
                if (current_trade?.sell_rate > data.ask) {
                  current_trade.profit =
                    (current_trade?.sell_rate - data.ask) *
                    current_trade.lot_size *
                    current_trade.lots;
                  isProfit = true;
                }
                if (current_trade?.sell_rate < data.ask) {
                  current_trade.loss =
                    (data.ask - current_trade?.sell_rate) *
                    current_trade.lot_size *
                    current_trade.lots;
                }
              } else {
                if (data.bid > current_trade?.buy_rate) {
                  current_trade.profit =
                    (data.bid - current_trade?.buy_rate) *
                    current_trade.lot_size *
                    current_trade.lots;
                  isProfit = true;
                }
                if (data.bid < current_trade?.buy_rate) {
                  current_trade.loss =
                    (current_trade?.buy_rate - data.bid) *
                    current_trade.lot_size *
                    current_trade.lots;
                }
              }

              let p_l = current_trade.profit - current_trade.loss;

              let remainingFund =
                user?.funds + p_l - parseFloat(brokerage + buybrokerage);
              await closeAllTradesPL(
                current_trade.user_id,
                current_trade.profit,
                current_trade.loss,
                trade.purchaseType === 'buy' ? data.bid : data.ask,
                trade.purchaseType
              );
              await AuthBusiness.updateFund(
                current_trade?.user_id,
                remainingFund
              );
              var ledger = {
                trade_id: trade._id,
                user_id: current_trade?.user_id,
                broker_id: current_trade.broker_id,
                amount: amount,
                brokerage: brokerage + buybrokerage,
                type: current_trade?.purchaseType
                  ? current_trade?.purchaseType
                  : 'buy'
              };
              await LedgersModel.create({
                ...ledger
              });
            });
          }
        });

        for (const script of mcx_scripts) {
          socket2.emit('join', script);
        }

        var eqninty = false;
        socket2.on('stock', async (data) => {
          for (const script of mcx_scripts) {
            var results = 0;
            all_active_trade = await getActivetrades(body?.user_id);
            // var alllots = all_active_trade.map((trade) => trade.lots);
            var current_trade = all_active_trade.filter(
              (trade) => trade.script == script
            );
            current_trade = current_trade[0];
            var user = await UserModel.find({ _id: current_trade?.user_id });
            user = user[0];
            var amount =
              current_trade?.purchaseType == 'buy'
                ? current_trade?.buy_rate
                : current_trade?.sell_rate;
            let lotunits =
              current_trade?.lots > 0
                ? current_trade?.lots * current_trade?.lot_size
                : current_trade?.units;
            if (body?.segment.toLowerCase() == 'mcx' && amount) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            } else if (
              body?.segment.toLowerCase() == 'mcx' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayMCXmarging =
                  (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
              } else if (body.units) {
                intradayMCXmarging =
                  (amount * body.units) / user?.intradayExposureMarginMCX;
              }
            }

            availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
            if (availbleIntradaymargingMCX < 0) {
              return { message: 'intradayMCXmarging not availble' };
            }

            if (body?.segment.toLowerCase() == 'eq' && amount) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            } else if (
              body?.segment.toLowerCase() == 'eq' &&
              current_trade?.sell_rate
            ) {
              if (current_trade?.lots) {
                intradayEQmarging =
                  (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
              } else if (current_trade?.units) {
                intradayEQmarging =
                  (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
              }
            }
            all_active_trades.forEach(async (current_trade) => {
              if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'mcx' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.lot_size * current_trade?.lots) /
                      user?.intradayExposureMarginMCX;
                } else if (current_trade?.units) {
                  intradayMCXmarging =
                    intradayMCXmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginMCX;
                }
              }
              availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
              if (availbleIntradaymargingMCX < 0) {
                return { message: 'intradayMCXmarging not availble' };
              }

              if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              } else if (
                current_trade?.segment.toLowerCase() == 'eq' &&
                current_trade?.sell_rate
              ) {
                if (current_trade?.lots) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.lot_size) /
                      user?.intradayExposureMarginEQ;
                } else if (current_trade?.units) {
                  intradayEQmarging =
                    intradayEQmarging +
                    (amount * current_trade?.units) /
                      user?.intradayExposureMarginEQ;
                }
              }
            });
            availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

            if (availbleIntradaymargingEQ < 0) {
              return { message: 'intradayEQmarging not availble' };
            }
            if (body.purchaseType == 'buy') {
              results = (data.ask - current_trade?.buy_rate) * lotunits;
              // totalResults += results;
            } else {
              results = (data.bid - current_trade?.sell_rate) * lotunits;
              // totalResults += results;
            }
          }

          let mcx_eqs =
            body.segment == 'mcx'
              ? availbleIntradaymargingMCX
              : availbleIntradaymargingEQ;

          var remainingblances = user?.funds - results;
          let finalmarigns = mcx_eqs + results;
          if (0.1 * user?.funds >= finalmarigns && !eqninty) {
            eqninty = true;
            console.log('90%');
            const payload = {
              notification: {
                title: 'New Notification',
                body: `User Used 90% blance availble blance ${remainingblances} by STOPLOSS(762)`
              }
            };
            await NotificationBusiness.create({
              notification: payload.notification.body
            });

            const adminnotification = await adminNotificationBusiness.getAll();
            const admintokens = adminnotification.map(
              (user) => user?.fcm_token
            );

            const usernotification = await userNotificationBusiness.getAll();
            const usertokens = usernotification.map((user) => user?.fcm_token);

            const tokens = admintokens || usertokens;

            const multicastMessage = {
              tokens: tokens,
              webpush: {
                notification: payload.notification
              }
            };
            admin
              .messaging()
              .sendMulticast(multicastMessage)
              .then((response) => {
                // console.log('Notification sent successfully:', response);
              })
              .catch((error) => {
                console.log('Error sending notification');
              });

            var brokerage = 0;
            amount =
              body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
            if (body?.segment.toLowerCase() == 'mcx') {
              if (current_trade?.lots) {
                amount = body?.lots * body?.lot_size * amount;
              } else {
                return {
                  message: 'Lots must not be empty'
                };
              }
              if (broker.type == 'profit sharing') {
                brokerage = profit_sharing(
                  amount,
                  broker?.profitLossPercentage
                );
              } else {
                brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
              }
            } else if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots' && current_trade?.lots) {
                amount = current_trade?.lots * current_trade?.lot_size * amount;
              } else if (
                user?.equityTradeType == 'units' &&
                current_trade?.units
              ) {
                amount = current_trade?.units * amount;
              } else {
                return {
                  message: 'Lots or Units must not be empty'
                };
              }
              if (broker.type == 'profit sharing') {
                brokerage = profit_sharing(
                  amount,
                  broker?.profitLossPercentage
                );
              } else {
                brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
              }
            }

            var buybrokerage = 0;
            var buyamount =
              current_trade?.purchaseType == 'buy' ? data.bid : data.ask;
            if (current_trade?.segment.toLowerCase() == 'mcx') {
              if (current_trade?.lots) {
                buyamount =
                  current_trade?.lots * current_trade?.lot_size * buyamount;
              } else {
                return {
                  message: 'Lots must not be empty'
                };
              }

              if (broker.type == 'profit sharing') {
                buybrokerage = profit_sharing(
                  buyamount,
                  broker?.profitLossPercentage
                );
              } else {
                buybrokerage = getBrokarage(
                  buyamount,
                  user?.mcxBrokeragePerCrore
                );
              }
            }
            if (current_trade?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots' && body.lots) {
                buyamount = current_trade?.lots * buyamount;
              } else if (user?.equityTradeType == 'units' && body.units) {
                buyamount = current_trade?.units * buyamount;
              }
              if (broker.type == 'profit sharing') {
                buybrokerage = profit_sharing(
                  buyamount,
                  broker?.profitLossPercentage
                );
              } else {
                buybrokerage = getBrokarage(
                  buyamount,
                  user?.mcxBrokeragePerCrore
                );
              }
            }

            // // await closeAllTrades(body.user_id);
            all_active_trade.map(async (trade) => {
              var isProfit = false;

              if (trade.purchaseType == 'sell') {
                if (current_trade?.sell_rate > data.ask) {
                  current_trade.profit =
                    (current_trade?.sell_rate - data.ask) *
                    current_trade.lot_size *
                    current_trade.lots;
                  isProfit = true;
                }
                if (current_trade?.sell_rate < data.ask) {
                  current_trade.loss =
                    (data.ask - current_trade?.sell_rate) *
                    current_trade.lot_size *
                    current_trade.lots;
                }
              } else {
                if (data.bid > current_trade?.buy_rate) {
                  current_trade.profit =
                    (data.bid - current_trade?.buy_rate) *
                    current_trade.lot_size *
                    current_trade.lots;
                  isProfit = true;
                }
                if (data.bid < current_trade?.buy_rate) {
                  current_trade.loss =
                    (current_trade?.buy_rate - data.bid) *
                    current_trade.lot_size *
                    current_trade.lots;
                }
              }

              let p_l = current_trade.profit - current_trade.loss;

              let remainingFund =
                user?.funds + p_l - parseFloat(brokerage + buybrokerage);
              await closeAllTradesPL(
                current_trade.user_id,
                current_trade.profit,
                current_trade.loss,
                trade.purchaseType === 'buy' ? data.bid : data.ask,
                trade.purchaseType
              );
              await AuthBusiness.updateFund(
                current_trade?.user_id,
                remainingFund
              );
              var ledger = {
                trade_id: trade._id,
                user_id: current_trade?.user_id,
                broker_id: current_trade.broker_id,
                amount: amount,
                brokerage: brokerage + buybrokerage,
                type: current_trade?.purchaseType
                  ? current_trade?.purchaseType
                  : 'buy'
              };
              await LedgersModel.create({
                ...ledger
              });
            });
          }
        });

        return {
          name: user?.name,
          buy_rate: trade.buy_rate,
          sell_rate: trade.sell_rate
        };
      } else {
        return {
          message: "You don't have enough funds to excecute this trade."
        };
      }
    } else {
      // await closeAllTrades(body.user_id);
      return {
        message: '90% of Your Fund is Used'
      };
    }
  } else {
    const pendingtrade = await TradesModel.create({
      ...body
    });
    let pendingdata = await getpendingtrades(body?.user_id);
    var pendimcx_scripts = pendingdata.map((trade) => trade.script);
    // var done_scripts = [];
    // const socket = io('ws://5.22.221.190:8000', {
    //   transports: ['websocket']
    // });

    for (const script of pendimcx_scripts) {
      socket.emit('join', script);
    }

    socket.on('stock', async (data) => {
      for (const script of pendimcx_scripts) {
        pendingdata = await getpendingtrades(body?.user_id);
        var currentPend_trade = pendingdata.filter(
          (trade) => trade.script == script
        );
        currentPend_trade = currentPend_trade[0];
        // if (currentPend_trade.isCancel == false) {
        if (data.ask >= currentPend_trade?.buy_rate) {
          console.log('done...');
          await TradesBusiness.update(
            currentPend_trade?._id,
            { status: 'active' },
            { new: true }
          );
        } else if (data.bid >= currentPend_trade?.sell_rate) {
          console.log('done 2...');
          await TradesBusiness.update(
            currentPend_trade?._id,
            { status: 'active' },
            { new: true }
          );
        }
        var result = 0;
        var seventy = 0;
        all_active_trade = await getActivetrades(body?.user_id);
        // var alllots = all_active_trade.map((trade) => trade.lots);
        var current_trade = all_active_trade.filter(
          (trade) => trade.script == script
        );
        current_trade = current_trade[0];
        var user = await UserModel.find({ _id: current_trade?.user_id });
        user = user[0];
        var amount =
          current_trade?.purchaseType == 'buy'
            ? current_trade?.buy_rate
            : current_trade?.sell_rate;
        let lotunit =
          current_trade?.lots > 0
            ? current_trade?.lots * current_trade?.lot_size
            : current_trade?.units;
        if (body?.segment.toLowerCase() == 'mcx' && amount) {
          if (current_trade?.lots) {
            intradayMCXmarging =
              (amount * current_trade?.lot_size * current_trade?.lots) /
              user?.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        } else if (
          body?.segment.toLowerCase() == 'mcx' &&
          current_trade?.sell_rate
        ) {
          if (current_trade?.lots) {
            intradayMCXmarging =
              (amount * current_trade?.lot_size * current_trade?.lots) /
              user?.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        }

        var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }

        if (body?.segment.toLowerCase() == 'eq' && amount) {
          if (current_trade?.lots) {
            intradayEQmarging =
              (amount * current_trade?.lot_size) /
              user?.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              (amount * current_trade?.units) / user?.intradayExposureMarginEQ;
          }
        } else if (
          body?.segment.toLowerCase() == 'eq' &&
          current_trade?.sell_rate
        ) {
          if (current_trade?.lots) {
            intradayEQmarging =
              (amount * current_trade?.lot_size) /
              user?.intradayExposureMarginEQ;
          } else if (current_trade?.units) {
            intradayEQmarging =
              (amount * current_trade?.units) / user?.intradayExposureMarginEQ;
          }
        }
        var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }
        all_active_trade.forEach(async (current_trade) => {
          if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
            if (current_trade?.lots) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
            } else {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginMCX;
            }
          } else if (
            current_trade?.segment.toLowerCase() == 'mcx' &&
            current_trade?.sell_rate
          ) {
            if (current_trade?.lots) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
            } else if (current_trade?.units) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginMCX;
            }
          }
          availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;

          if (availbleIntradaymargingMCX < 0) {
            return { message: 'intradayMCXmarging not availble' };
          }

          if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
            if (current_trade?.lots) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
            } else {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
            }
          } else if (
            current_trade?.segment.toLowerCase() == 'eq' &&
            current_trade?.sell_rate
          ) {
            if (current_trade?.lots) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
            } else if (current_trade?.units) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
            }
          }
        });
        availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

        if (availbleIntradaymargingEQ < 0) {
          return { message: 'intradayEQmarging not availble' };
        }
        if (body.purchaseType == 'buy') {
          result = (data.ask - current_trade?.buy_rate) * lotunit;
          // totalResults += results;
        } else {
          result = (data.bid - current_trade?.sell_rate) * lotunit;
          // totalResults += results;
        }
      }

      let mcx_eq =
        body.segment == 'mcx'
          ? availbleIntradaymargingMCX
          : availbleIntradaymargingEQ;

      var remainingblance = user?.funds - result;
      let finalmarign = mcx_eq + result;
      if (0.3 * user?.funds >= finalmarign && !seventy) {
        seventy = true;
        console.log('70%');
        const payload = {
          notification: {
            title: 'New Notification',
            body: `User Used 70% blance availble blance ${remainingblance} by STOPLOSS(762)`
          }
        };
        await NotificationBusiness.create({
          notification: payload.notification.body
        });

        const adminnotification = await adminNotificationBusiness.getAll();
        const admintokens = adminnotification.map((user) => user?.fcm_token);

        const usernotification = await userNotificationBusiness.getAll();
        const usertokens = usernotification.map((user) => user?.fcm_token);

        const tokens = admintokens || usertokens;

        const multicastMessage = {
          tokens: tokens,
          webpush: {
            notification: payload.notification
          }
        };
        admin
          .messaging()
          .sendMulticast(multicastMessage)
          .then((response) => {
            // socket.disconnect();
            // console.log('Notification sent successfully:', response);
          })
          .catch((error) => {
            console.log('Error sending notification');
          });
        let lotunits =
          current_trade?.lots > 0
            ? current_trade?.lots * current_trade?.lot_size
            : current_trade?.units;
        let mcx_eqs =
          body.segment == 'mcx'
            ? availbleIntradaymargingMCX
            : availbleIntradaymargingEQ;
        var results = 0;
        if (body.purchaseType == 'buy') {
          results = (data.ask - current_trade?.buy_rate) * lotunits;
          // totalResults += results;
        } else {
          results = (data.bid - current_trade?.sell_rate) * lotunits;
          // totalResults += results;
        }

        var remainingblances = user?.funds - results;
        let finalmarigns = mcx_eqs + results;
        if (0.1 * user?.funds >= finalmarigns && !ninty) {
          ninty = true;
          console.log('90%');
          const payload = {
            notification: {
              title: 'New Notification',
              body: `User Used 90% blance availble blance ${remainingblances} by STOPLOSS(762)`
            }
          };
          await NotificationBusiness.create({
            notification: payload.notification.body
          });

          const adminnotification = await adminNotificationBusiness.getAll();
          const admintokens = adminnotification.map((user) => user?.fcm_token);

          const usernotification = await userNotificationBusiness.getAll();
          const usertokens = usernotification.map((user) => user?.fcm_token);

          const tokens = admintokens || usertokens;

          const multicastMessage = {
            tokens: tokens,
            webpush: {
              notification: payload.notification
            }
          };
          admin
            .messaging()
            .sendMulticast(multicastMessage)
            .then((response) => {
              // console.log('Notification sent successfully:', response);
            })
            .catch((error) => {
              console.log('Error sending notification');
            });

          var brokerage = 0;
          amount =
            body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
          if (body?.segment.toLowerCase() == 'mcx') {
            if (current_trade?.lots) {
              amount = body?.lots * body?.lot_size * amount;
            } else {
              return {
                message: 'Lots must not be empty'
              };
            }
            if (broker.type == 'profit sharing') {
              brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            } else {
              brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
            }
          } else if (body?.segment.toLowerCase() == 'eq') {
            if (user?.equityTradeType == 'lots' && current_trade?.lots) {
              amount = current_trade?.lots * current_trade?.lot_size * amount;
            } else if (
              user?.equityTradeType == 'units' &&
              current_trade?.units
            ) {
              amount = current_trade?.units * amount;
            } else {
              return {
                message: 'Lots or Units must not be empty'
              };
            }
            if (broker.type == 'profit sharing') {
              brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            } else {
              brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
            }
          }

          var buybrokerage = 0;
          var buyamount =
            current_trade?.purchaseType == 'buy' ? data.bid : data.ask;
          if (current_trade?.segment.toLowerCase() == 'mcx') {
            if (current_trade?.lots) {
              buyamount =
                current_trade?.lots * current_trade?.lot_size * buyamount;
            } else {
              return {
                message: 'Lots must not be empty'
              };
            }

            if (broker.type == 'profit sharing') {
              buybrokerage = profit_sharing(
                buyamount,
                broker?.profitLossPercentage
              );
            } else {
              buybrokerage = getBrokarage(
                buyamount,
                user?.mcxBrokeragePerCrore
              );
            }
          }
          if (current_trade?.segment.toLowerCase() == 'eq') {
            if (user?.equityTradeType == 'lots' && body.lots) {
              buyamount = current_trade?.lots * buyamount;
            } else if (user?.equityTradeType == 'units' && body.units) {
              buyamount = current_trade?.units * buyamount;
            }
            if (broker.type == 'profit sharing') {
              buybrokerage = profit_sharing(
                buyamount,
                broker?.profitLossPercentage
              );
            } else {
              buybrokerage = getBrokarage(
                buyamount,
                user?.mcxBrokeragePerCrore
              );
            }
          }

          // // await closeAllTrades(body.user_id);
          all_active_trade.map(async (trade) => {
            var isProfit = false;

            if (trade.purchaseType == 'sell') {
              if (current_trade?.sell_rate > data.ask) {
                current_trade.profit =
                  (current_trade?.sell_rate - data.ask) *
                  current_trade.lot_size *
                  current_trade.lots;
                isProfit = true;
              }
              if (current_trade?.sell_rate < data.ask) {
                current_trade.loss =
                  (data.ask - current_trade?.sell_rate) *
                  current_trade.lot_size *
                  current_trade.lots;
              }
            } else {
              if (data.bid > current_trade?.buy_rate) {
                current_trade.profit =
                  (data.bid - current_trade?.buy_rate) *
                  current_trade.lot_size *
                  current_trade.lots;
                isProfit = true;
              }
              if (data.bid < current_trade?.buy_rate) {
                current_trade.loss =
                  (current_trade?.buy_rate - data.bid) *
                  current_trade.lot_size *
                  current_trade.lots;
              }
            }

            let p_l = current_trade.profit - current_trade.loss;

            let remainingFund =
              user?.funds + p_l - parseFloat(brokerage + buybrokerage);
            await closeAllTradesPL(
              current_trade.user_id,
              current_trade.profit,
              current_trade.loss,
              trade.purchaseType === 'buy' ? data.bid : data.ask,
              trade.purchaseType
            );
            await AuthBusiness.updateFund(
              current_trade?.user_id,
              remainingFund
            );
            var ledger = {
              trade_id: trade._id,
              user_id: current_trade?.user_id,
              broker_id: current_trade.broker_id,
              amount: amount,
              brokerage: brokerage + buybrokerage,
              type: current_trade?.purchaseType
                ? current_trade?.purchaseType
                : 'buy'
            };
            await LedgersModel.create({
              ...ledger
            });
          });
        }
      }
    });

    for (const script of pendimcx_scripts) {
      socket2.emit('join', script);
    }

    socket2.on('stock', async (data) => {
      for (const script of pendimcx_scripts) {
        pendingdata = await getpendingtrades(body?.user_id);
        var currentPend_trade = pendingdata.filter(
          (trade) => trade.script == script
        );
        currentPend_trade = currentPend_trade[0];
        // if (currentPend_trade.isCancel == false) {
        if (data.ask >= currentPend_trade?.buy_rate) {
          console.log('done...');
          await TradesBusiness.update(
            currentPend_trade?._id,
            { status: 'active' },
            { new: true }
          );
        } else if (data.bid >= currentPend_trade?.sell_rate) {
          console.log('done 2...');
          await TradesBusiness.update(
            currentPend_trade?._id,
            { status: 'active' },
            { new: true }
          );
        }
        var result = 0;
        var seventy = 0;
        all_active_trade = await getActivetrades(body?.user_id);
        // var alllots = all_active_trade.map((trade) => trade.lots);
        var current_trade = all_active_trade.filter(
          (trade) => trade.script == script
        );
        current_trade = current_trade[0];
        var user = await UserModel.find({ _id: current_trade?.user_id });
        user = user[0];
        var amount =
          current_trade?.purchaseType == 'buy'
            ? current_trade?.buy_rate
            : current_trade?.sell_rate;
        let lotunit =
          current_trade?.lots > 0
            ? current_trade?.lots * current_trade?.lot_size
            : current_trade?.units;
        if (body?.segment.toLowerCase() == 'mcx' && amount) {
          if (current_trade?.lots) {
            intradayMCXmarging =
              (amount * current_trade?.lot_size * current_trade?.lots) /
              user?.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        } else if (
          body?.segment.toLowerCase() == 'mcx' &&
          current_trade?.sell_rate
        ) {
          if (current_trade?.lots) {
            intradayMCXmarging =
              (amount * current_trade?.lot_size * current_trade?.lots) /
              user?.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        }

        var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }

        if (body?.segment.toLowerCase() == 'eq' && amount) {
          if (current_trade?.lots) {
            intradayEQmarging =
              (amount * current_trade?.lot_size) /
              user?.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              (amount * current_trade?.units) / user?.intradayExposureMarginEQ;
          }
        } else if (
          body?.segment.toLowerCase() == 'eq' &&
          current_trade?.sell_rate
        ) {
          if (current_trade?.lots) {
            intradayEQmarging =
              (amount * current_trade?.lot_size) /
              user?.intradayExposureMarginEQ;
          } else if (current_trade?.units) {
            intradayEQmarging =
              (amount * current_trade?.units) / user?.intradayExposureMarginEQ;
          }
        }
        var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }
        all_active_trade.forEach(async (current_trade) => {
          if (current_trade?.segment.toLowerCase() == 'mcx' && amount) {
            if (current_trade?.lots) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
            } else {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginMCX;
            }
          } else if (
            current_trade?.segment.toLowerCase() == 'mcx' &&
            current_trade?.sell_rate
          ) {
            if (current_trade?.lots) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.lot_size * current_trade?.lots) /
                  user?.intradayExposureMarginMCX;
            } else if (current_trade?.units) {
              intradayMCXmarging =
                intradayMCXmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginMCX;
            }
          }
          availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;

          if (availbleIntradaymargingMCX < 0) {
            return { message: 'intradayMCXmarging not availble' };
          }

          if (current_trade?.segment.toLowerCase() == 'eq' && amount) {
            if (current_trade?.lots) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
            } else {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
            }
          } else if (
            current_trade?.segment.toLowerCase() == 'eq' &&
            current_trade?.sell_rate
          ) {
            if (current_trade?.lots) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.lot_size) /
                  user?.intradayExposureMarginEQ;
            } else if (current_trade?.units) {
              intradayEQmarging =
                intradayEQmarging +
                (amount * current_trade?.units) /
                  user?.intradayExposureMarginEQ;
            }
          }
        });
        availbleIntradaymargingEQ = user?.funds - intradayEQmarging;

        if (availbleIntradaymargingEQ < 0) {
          return { message: 'intradayEQmarging not availble' };
        }
        if (body.purchaseType == 'buy') {
          result = (data.ask - current_trade?.buy_rate) * lotunit;
          // totalResults += results;
        } else {
          result = (data.bid - current_trade?.sell_rate) * lotunit;
          // totalResults += results;
        }
      }

      let mcx_eq =
        body.segment == 'mcx'
          ? availbleIntradaymargingMCX
          : availbleIntradaymargingEQ;

      var remainingblance = user?.funds - result;
      let finalmarign = mcx_eq + result;
      if (0.3 * user?.funds >= finalmarign && !seventy) {
        seventy = true;
        console.log('70%');
        const payload = {
          notification: {
            title: 'New Notification',
            body: `User Used 70% blance availble blance ${remainingblance} by STOPLOSS(762)`
          }
        };
        await NotificationBusiness.create({
          notification: payload.notification.body
        });

        const adminnotification = await adminNotificationBusiness.getAll();
        const admintokens = adminnotification.map((user) => user?.fcm_token);

        const usernotification = await userNotificationBusiness.getAll();
        const usertokens = usernotification.map((user) => user?.fcm_token);

        const tokens = admintokens || usertokens;

        const multicastMessage = {
          tokens: tokens,
          webpush: {
            notification: payload.notification
          }
        };
        admin
          .messaging()
          .sendMulticast(multicastMessage)
          .then((response) => {
            // socket.disconnect();
            // console.log('Notification sent successfully:', response);
          })
          .catch((error) => {
            console.log('Error sending notification');
          });
        let lotunits =
          current_trade?.lots > 0
            ? current_trade?.lots * current_trade?.lot_size
            : current_trade?.units;
        let mcx_eqs =
          body.segment == 'mcx'
            ? availbleIntradaymargingMCX
            : availbleIntradaymargingEQ;
        var results = 0;
        if (body.purchaseType == 'buy') {
          results = (data.ask - current_trade?.buy_rate) * lotunits;
          // totalResults += results;
        } else {
          results = (data.bid - current_trade?.sell_rate) * lotunits;
          // totalResults += results;
        }

        var remainingblances = user?.funds - results;
        let finalmarigns = mcx_eqs + results;
        if (0.1 * user?.funds >= finalmarigns && !ninty) {
          ninty = true;
          console.log('90%');
          const payload = {
            notification: {
              title: 'New Notification',
              body: `User Used 90% blance availble blance ${remainingblances} by STOPLOSS(762)`
            }
          };
          await NotificationBusiness.create({
            notification: payload.notification.body
          });

          const adminnotification = await adminNotificationBusiness.getAll();
          const admintokens = adminnotification.map((user) => user?.fcm_token);

          const usernotification = await userNotificationBusiness.getAll();
          const usertokens = usernotification.map((user) => user?.fcm_token);

          const tokens = admintokens || usertokens;

          const multicastMessage = {
            tokens: tokens,
            webpush: {
              notification: payload.notification
            }
          };
          admin
            .messaging()
            .sendMulticast(multicastMessage)
            .then((response) => {
              // console.log('Notification sent successfully:', response);
            })
            .catch((error) => {
              console.log('Error sending notification');
            });

          var brokerage = 0;
          amount =
            body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
          if (body?.segment.toLowerCase() == 'mcx') {
            if (current_trade?.lots) {
              amount = body?.lots * body?.lot_size * amount;
            } else {
              return {
                message: 'Lots must not be empty'
              };
            }
            if (broker.type == 'profit sharing') {
              brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            } else {
              brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
            }
          } else if (body?.segment.toLowerCase() == 'eq') {
            if (user?.equityTradeType == 'lots' && current_trade?.lots) {
              amount = current_trade?.lots * current_trade?.lot_size * amount;
            } else if (
              user?.equityTradeType == 'units' &&
              current_trade?.units
            ) {
              amount = current_trade?.units * amount;
            } else {
              return {
                message: 'Lots or Units must not be empty'
              };
            }
            if (broker.type == 'profit sharing') {
              brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            } else {
              brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
            }
          }

          var buybrokerage = 0;
          var buyamount =
            current_trade?.purchaseType == 'buy' ? data.bid : data.ask;
          if (current_trade?.segment.toLowerCase() == 'mcx') {
            if (current_trade?.lots) {
              buyamount =
                current_trade?.lots * current_trade?.lot_size * buyamount;
            } else {
              return {
                message: 'Lots must not be empty'
              };
            }

            if (broker.type == 'profit sharing') {
              buybrokerage = profit_sharing(
                buyamount,
                broker?.profitLossPercentage
              );
            } else {
              buybrokerage = getBrokarage(
                buyamount,
                user?.mcxBrokeragePerCrore
              );
            }
          }
          if (current_trade?.segment.toLowerCase() == 'eq') {
            if (user?.equityTradeType == 'lots' && body.lots) {
              buyamount = current_trade?.lots * buyamount;
            } else if (user?.equityTradeType == 'units' && body.units) {
              buyamount = current_trade?.units * buyamount;
            }
            if (broker.type == 'profit sharing') {
              buybrokerage = profit_sharing(
                buyamount,
                broker?.profitLossPercentage
              );
            } else {
              buybrokerage = getBrokarage(
                buyamount,
                user?.mcxBrokeragePerCrore
              );
            }
          }

          // // await closeAllTrades(body.user_id);
          all_active_trade.map(async (trade) => {
            var isProfit = false;

            if (trade.purchaseType == 'sell') {
              if (current_trade?.sell_rate > data.ask) {
                current_trade.profit =
                  (current_trade?.sell_rate - data.ask) *
                  current_trade.lot_size *
                  current_trade.lots;
                isProfit = true;
              }
              if (current_trade?.sell_rate < data.ask) {
                current_trade.loss =
                  (data.ask - current_trade?.sell_rate) *
                  current_trade.lot_size *
                  current_trade.lots;
              }
            } else {
              if (data.bid > current_trade?.buy_rate) {
                current_trade.profit =
                  (data.bid - current_trade?.buy_rate) *
                  current_trade.lot_size *
                  current_trade.lots;
                isProfit = true;
              }
              if (data.bid < current_trade?.buy_rate) {
                current_trade.loss =
                  (current_trade?.buy_rate - data.bid) *
                  current_trade.lot_size *
                  current_trade.lots;
              }
            }

            let p_l = current_trade.profit - current_trade.loss;

            let remainingFund =
              user?.funds + p_l - parseFloat(brokerage + buybrokerage);
            await closeAllTradesPL(
              current_trade.user_id,
              current_trade.profit,
              current_trade.loss,
              trade.purchaseType === 'buy' ? data.bid : data.ask,
              trade.purchaseType
            );
            await AuthBusiness.updateFund(
              current_trade?.user_id,
              remainingFund
            );
            var ledger = {
              trade_id: trade._id,
              user_id: current_trade?.user_id,
              broker_id: current_trade.broker_id,
              amount: amount,
              brokerage: brokerage + buybrokerage,
              type: current_trade?.purchaseType
                ? current_trade?.purchaseType
                : 'buy'
            };
            await LedgersModel.create({
              ...ledger
            });
          });
        }
      }
    });
    return {
      name: user?.name,
      buy_rate: pendingtrade.buy_rate
    };
  }
};

const update = async (id, body) => {
  try {
    var thisTrade = await TradesModel.findById(id);
    var user = await AuthBusiness.me(body?.user_id);
    var broker = await BrokersBusiness.findbroker(body.broker_id);
    var amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
    var isProfit = false;
    if (body?.status == 'active') {
      const tradePending = await TradesModel.findByIdAndUpdate(id, body, {
        new: true
      });
      return tradePending;
    } else if (body?.status == 'closed') {
      if (body?.buy_rate && body?.sell_rate) {
        if (thisTrade?.purchaseType == 'sell') {
          if (body?.sell_rate > body?.buy_rate) {
            if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots') {
                body.profit =
                  (body?.sell_rate - body?.buy_rate) *
                  body?.lots *
                  thisTrade.lot_size;
              } else if (user?.equityTradeType == 'units') {
                body.profit = (body?.sell_rate - body?.buy_rate) * body?.units;
              } else {
                return {
                  message:
                    'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
                };
              }
            } else {
              body.profit =
                (body?.sell_rate - body?.buy_rate) *
                body?.lots *
                thisTrade.lot_size;
            }
            isProfit = true;
          }
          if (body?.sell_rate < body?.buy_rate) {
            if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots') {
                body.loss =
                  (body?.buy_rate - body?.sell_rate) *
                  body?.lots *
                  thisTrade.lot_size;
              } else if (user?.equityTradeType == 'units') {
                body.loss = (body?.buy_rate - body?.sell_rate) * body?.units;
              } else {
                return {
                  message:
                    'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
                };
              }
            } else {
              body.loss =
                (body?.buy_rate - body?.sell_rate) *
                body?.lots *
                thisTrade.lot_size;
            }
          }
        } else {
          if (body?.sell_rate > body?.buy_rate) {
            if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots') {
                body.profit =
                  (body?.sell_rate - body?.buy_rate) *
                  body?.lots *
                  thisTrade.lot_size;
              } else if (user?.equityTradeType == 'units') {
                body.profit = (body?.sell_rate - body?.buy_rate) * body?.units;
              } else {
                return {
                  message:
                    'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
                };
              }
            } else {
              body.profit =
                (body?.sell_rate - body?.buy_rate) *
                body?.lots *
                thisTrade.lot_size;
            }
            isProfit = true;
          }
          if (body?.sell_rate < body?.buy_rate) {
            if (body?.segment.toLowerCase() == 'eq') {
              if (user?.equityTradeType == 'lots') {
                body.loss =
                  (body?.buy_rate - body?.sell_rate) *
                  body?.lots *
                  thisTrade.lot_size;
              } else if (user?.equityTradeType == 'units') {
                body.loss = (body?.buy_rate - body?.sell_rate) * body?.units;
              } else {
                return {
                  message:
                    'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
                };
              }
            } else {
              body.loss =
                (body?.buy_rate - body?.sell_rate) *
                body?.lots *
                thisTrade.lot_size;
            }
          }
        }
      }
      var buyamount =
        (body?.purchaseType == 'buy' ? body?.sell_rate : body?.buy_rate) *
        thisTrade.lot_size;
      var buybrokerage = thisTrade?.buybrokerage ? thisTrade?.buybrokerage : 0;

      if (body?.segment.toLowerCase() == 'mcx') {
        if (body.lots) {
          buyamount = body?.lots * buyamount;
        } else {
          return {
            message: 'Lots must not be empty'
          };
        }

        if (broker.type == 'profit sharing') {
          buybrokerage =
            buybrokerage +
            profit_sharing(buyamount, broker?.profitLossPercentage);
          console.log(buybrokerage, 'buybrokerage');
        } else {
          buybrokerage =
            buybrokerage + getBrokarage(buyamount, user?.mcxBrokeragePerCrore);
        }
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          buyamount = body?.lots * buyamount;
        } else if (user?.equityTradeType == 'units' && body.units) {
          buyamount = body?.units * buyamount;
        }
        if (broker.type == 'profit sharing') {
          buybrokerage =
            buybrokerage +
            profit_sharing(buyamount, broker?.profitLossPercentage);
        } else {
          buybrokerage =
            buybrokerage + getBrokarage(buyamount, user?.mcxBrokeragePerCrore);
        }
      }
      const trade = await TradesModel.findByIdAndUpdate(id, body, {
        new: true
      });

      var brokerage = thisTrade?.brokerage ? thisTrade?.brokerage : 0;
      if (body?.segment.toLowerCase() == 'mcx') {
        if (body.lots) {
          amount = body?.lots * amount * thisTrade?.lot_size;
        } else {
          return {
            message: 'Lots must not be empty'
          };
        }
        if (broker.type == 'profit sharing') {
          brokerage =
            brokerage + profit_sharing(amount, broker?.profitLossPercentage);
        } else {
          brokerage =
            brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
        // brokerage =
        //   brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          amount = body?.lots * amount * thisTrade?.lot_size;
        } else if (user?.equityTradeType == 'units' && body.units) {
          amount = body?.units * amount;
        }
        if (broker.type == 'profit sharing') {
          brokerage =
            brokerage + profit_sharing(amount, broker?.profitLossPercentage);
        } else {
          brokerage =
            brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      }
      var ledger = {
        trade_id: id,
        user_id: body?.user_id,
        broker_id: body?.broker_id,
        amount: body?.sell_rate,
        brokerage: brokerage + buybrokerage,
        type: body?.purchaseType ? body?.purchaseType : 'buy'
      };

      await LedgersModel.create({
        ...ledger
      });

      let Amount = body.profit - body.loss;
      let remainingFund =
        user?.funds + Amount - parseFloat(brokerage + buybrokerage);
      console.log(remainingFund, 'remain');
      await AuthBusiness.updateFund(body?.user_id, remainingFund);
    } else if (body?.status == 'pending' && body.isCancel) {
      const tradePending = TradesModel.findByIdAndUpdate(
        id,
        { ...body },
        {
          new: true
        }
      );
      return tradePending;
    } else if (body?.status == 'pending') {
      // var mcx_scripts = body.script;
      var mcx_scripts = [body?.script];
      var done_scripts = [];
      // const socket = io('ws://5.22.221.190:8000', {
      //   transports: ['websocket']
      // });

      for (const script of mcx_scripts) {
        socket.emit('join', script);
      }

      socket.on('stock', async (data) => {
        console.log(data.ask, 'data.ask');
        console.log(body.buy_rate, 'body.buy_rate');
        if (data.ask <= body.buy_rate) {
          await TradesModel.findByIdAndUpdate(
            id,
            { ...body, status: 'active' },
            {
              new: true
            }
          );
        } else if (data.bid <= body.sell_rate) {
          await TradesModel.findByIdAndUpdate(
            id,
            { ...body, status: 'active' },
            {
              new: true
            }
          );
        } else {
          console.log(data.ask, 'buy condition not met');
          await TradesModel.findByIdAndUpdate(id, ...body, {
            new: true
          });
        }
      });

      brokerage = thisTrade?.brokerage ? thisTrade?.brokerage : 0;
      console.log('broker');
      console.log('brokerage', brokerage);
      if (body?.segment.toLowerCase() == 'mcx') {
        if (body.lots) {
          amount = body?.lots * amount;
        } else {
          return {
            message: 'Lots must not be empty'
          };
        }
        if (broker.type == 'profit sharing') {
          brokerage =
            brokerage + profit_sharing(amount, broker?.profitLossPercentage);
          console.log(brokerage, 'brokerage');
        } else {
          brokerage =
            brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          amount = body?.lots * amount;
        } else if (user?.equityTradeType == 'units' && body.units) {
          amount = body?.units * amount;
        }
        if (broker.type == 'profit sharing') {
          brokerage =
            brokerage + profit_sharing(amount, broker?.profitLossPercentage);
          console.log(brokerage, 'brokerage');
        } else {
          brokerage =
            brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      }
    }

    var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
    // console.log(availbleIntradaymargingMCX, 'suraj1');
    if (availbleIntradaymargingMCX < 0) {
      return { message: 'intradayMCXmarging not availble' };
    }
    // console.log(intradayMCXmarging, 'suraj1');

    // var ledger = {
    //   trade_id: id,
    //   user_id: body?.user_id,
    //   broker_id: body?.broker_id,
    //   amount: body?.sell_rate,
    //   brokerage: brokerage + buybrokerage,
    //   type: body?.purchaseType ? body?.purchaseType : 'buy'
    // };

    var remainingFund = user?.funds - amount - brokerage;
    if (isProfit && body.buy_rate < body.sell_rate) {
      remainingFund = user?.funds + (amount - brokerage);
    } else if (isProfit && body.buy_rate > body.sell_rate) {
      remainingFund = user?.funds - (amount - brokerage);
    } else {
      remainingFund = user?.funds + body.buy_rate - brokerage;
    }

    // await AuthBusiness.updateFund(body?.user_id, remainingFund);
    // await LedgersModel.create({
    //   ...ledger
    // });

    // return trade;

    if (body?.status == 'active') {
      var total_traded_amaount = await getActivetradeAmount(body?.user_id);
      var current_percentage_funds = await checkBalanceInPercentage(
        user?.funds,
        total_traded_amaount
      );
      console.log(
        '375 --------- ',
        user?.funds,
        total_traded_amaount,
        current_percentage_funds
      );

      if (current_percentage_funds) {
        if (body?.segment.toLowerCase() == 'mcx') {
          if (body.lots) {
            amount = body?.lots * amount;
          } else {
            return {
              message: 'Lots must not be empty'
            };
          }
          if (broker.type == 'profit sharing') {
            brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            console.log(brokerage, 'brokerage');
          } else {
            brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
          }
        } else if (body?.segment.toLowerCase() == 'eq') {
          if (user?.equityTradeType == 'lots' && body.lots) {
            amount = body?.lots * amount;
          } else if (user?.equityTradeType == 'units' && body.units) {
            amount = body?.units * amount;
          }
          if (broker.type == 'profit sharing') {
            brokerage = profit_sharing(amount, broker?.profitLossPercentage);
          } else {
            brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
          }
        } else {
          return {
            message:
              'You are not connected with any broker, please ask Admin to update your profile.'
          };
        }

        var intradayMCXmarging = 0;
        if (body?.segment.toLowerCase() == 'mcx' && amount) {
          if (body.lots) {
            intradayMCXmarging =
              (amount * thisTrade.lot_size) / user?.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
          if (body.lots) {
            intradayMCXmarging =
              (amount * thisTrade.lot_size) / user?.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              (amount * body.units) / user?.intradayExposureMarginMCX;
          }
        }

        availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }
        // console.log(intradayMCXmarging, 'suraj1');

        var intradayEQmarging = 0;
        if (body?.segment.toLowerCase() == 'eq' && amount) {
          if (user?.equityTradeType == 'lots' && body.lots) {
            intradayEQmarging =
              (amount * thisTrade.lot_size) / user?.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              (amount * body.units) / user?.intradayExposureMarginEQ;
          }
        } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
          if (user?.equityTradeType == 'lots' && body.lots) {
            intradayEQmarging =
              (amount * thisTrade.lot_size) / user?.intradayExposureMarginEQ;
          } else if (user?.equityTradeType == 'units' && body.units) {
            intradayEQmarging =
              (amount * body.units) / user?.intradayExposureMarginEQ;
          }
        }

        var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;
        if (availbleIntradaymargingEQ < 0) {
          return { message: 'intradayEQmarging not availble' };
        }
        // console.log(availbleIntradaymargingEQ, 'suraj12');
        // console.log(intradayEQmarging, 'suraj12');

        // var holdingMCXmarging = 0;
        // if (body?.segment.toLowerCase() == 'mcx' && body.buy_rate) {
        //   if (body.lots) {
        //     holdingMCXmarging = (body.buy_rate * body.lots) / 60;
        //   } else {
        //     holdingMCXmarging = (body.buy_rate * body.units) / 60;
        //   }
        // } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
        //   if (body.lots) {
        //     holdingMCXmarging = (body.buy_rate * body.lots) / 60;
        //   } else if (body.units) {
        //     holdingMCXmarging = (body.buy_rate * body.units) / 60;
        //   }
        // }

        // var availbleholdingmargingmcx = user?.funds - holdingMCXmarging;
        // if (availbleholdingmargingmcx < 0) {
        //   return { message: 'holdingMCXmarging not availble' };
        // }
        // // console.log(availbleholdingmargingmcx, 'suraj123');
        // // console.log(holdingMCXmarging, 'suraj123');

        // var holdingEQmarging = 0;
        // if (body?.segment.toLowerCase() == 'eq' && body.buy_rate) {
        //   if (body.lots) {
        //     holdingEQmarging = (body.buy_rate * body.lots) / 60;
        //   } else {
        //     holdingEQmarging = (body.buy_rate * body.units) / 60;
        //   }
        // } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
        //   if (body.lots) {
        //     holdingEQmarging = (body.buy_rate * body.lots) / 60;
        //   } else if (body.units) {
        //     holdingEQmarging = (body.buy_rate * body.units) / 60;
        //   }
        // }

        // var availbleholdingmargingEQ = user?.funds - holdingEQmarging;
        // if (availbleholdingmargingEQ < 0) {
        //   return { message: 'holdingEQmarging not availble' };
        // }
        // console.log(availbleholdingmargingEQ, 'suraj1234');
        // console.log(holdingEQmarging, 'suraj1234');
        const currentTime = new Date();
        const marketOpenTime = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          9,
          0
        );
        const marketCloseTime =
          body.segment === 'eq'
            ? new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                15,
                30
              )
            : new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                23,
                30
              );

        if (currentTime < marketOpenTime || currentTime > marketCloseTime) {
          return {
            message: 'Out of market hours. Cannot execute the trade.'
          };
        }

        if (user?.funds && user?.funds > amount) {
          if (body?.isDirect) {
            body.status = 'active';
          }

          const tradeP = await TradesModel.findByIdAndUpdate(id, body, {
            new: true
          });

          var remainingFundP = user?.funds - amount;
          await AuthBusiness.updateFund(body?.user_id, remainingFundP);
          //console.log("user",user)
          var ledgerP = {
            trade_id: tradeP._id,
            user_id: body?.user_id,
            broker_id: user?.broker_id,
            amount: amount,
            brokerage: brokerage,
            type: body?.purchaseType ? body?.purchaseType : 'buy'
          };
          ///console.log("ledger",ledger)
          await LedgersModel.create({
            ...ledgerP
          });
          // const selectedTrade = await TradesModel.findOne({ _id: trade._id }).populate('user_id', 'name').select({ buy_rate: 1, _id:0  });
          //  return selectedTrade;
          return {
            name: user?.name,
            buy_rate: tradeP.buy_rate
          };
        } else {
          return {
            message: "You don't have enough funds to excecute this trade."
          };
        }
      } else {
        // await closeAllTrades(body.user_id);
        return {
          message: '90% of Your Fund is Used'
        };
      }
    }
  } catch (err) {
    return {
      message: err
    };
  }
};

// const ledgerbalance = async (brokerageId) => {
//   let data = await LedgersModel.find({ broker_id: brokerageId });
//   const broker = data.map((broker) => broker.brokerage);
//   const mcxsumBuyRates = broker.reduce(
//     (accumulator, currentValue) => accumulator + currentValue,
//     0
//   );

//   return mcxsumBuyRates;
// };

async function clossTodaysTrades(data) {
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // const tomorrow = new Date(today);
  // tomorrow.setDate(today.getDate() + 1);
  var active_trades = await TradesModel.find({
    status: 'active',
    script: data.name
  });
  // console.log("active trades",active_trades)
  var amount = 0;
  var isProfit = false;
  var user = await AuthBusiness.me(body?.user_id);
  for (var body of active_trades) {
    amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
    var holdingMCXmarging = 0;
    if (body?.segment.toLowerCase() == 'mcx' && amount) {
      if (body.lots) {
        holdingMCXmarging =
          (amount * body.lots) / user?.holdingExposureMarginMCX;
      } else {
        holdingMCXmarging =
          (amount * body.units) / user?.holdingExposureMarginMCX;
      }
    } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
      if (body.lots) {
        holdingMCXmarging =
          (amount * body.lots) / user?.holdingExposureMarginMCX;
      } else if (body.units) {
        holdingMCXmarging =
          (amount * body.units) / user?.holdingExposureMarginMCX;
      }
    }

    var availbleholdingmargingmcx = user?.funds - holdingMCXmarging;
    // if (availbleholdingmargingmcx < 0) {
    //   return { message: 'holdingMCXmarging not availble' };
    // }
    // console.log(availbleholdingmargingmcx, 'suraj123');
    // console.log(holdingMCXmarging, 'suraj123');

    var holdingEQmarging = 0;
    if (body?.segment.toLowerCase() == 'eq' && amount) {
      if (user?.equityTradeType == 'lots' && body.lots) {
        holdingEQmarging = (amount * body.lots) / user?.holdingExposureMarginEQ;
      } else {
        holdingEQmarging =
          (amount * body.units) / user?.holdingExposureMarginEQ;
      }
    } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
      if (user?.equityTradeType == 'lots' && body.lots) {
        holdingEQmarging = (amount * body.lots) / user?.holdingExposureMarginEQ;
      } else if (body.units) {
        holdingEQmarging =
          (amount * body.units) / user?.holdingExposureMarginEQ;
      }
    }

    var availbleholdingmargingEQ = user?.funds - holdingEQmarging;

    var availableHoldingMargin =
      body?.segment.toLowerCase() == 'eq'
        ? availbleholdingmargingEQ
        : availbleholdingmargingmcx;
    if (availableHoldingMargin < 0) {
      // return { message: 'holdingEQmarging not availble' };
      body.status = 'closed';

      if (body?.purchaseType == 'buy') {
        body.sell_rate = data.bid;
      } else if (body?.purchaseType == 'sell') {
        body.buy_rate = data.ask;
      }

      isProfit = false;
      console.log(body);

      if (body?.buy_rate && body?.sell_rate) {
        if (body?.purchaseType == 'sell') {
          if (body?.sell_rate > body?.buy_rate) {
            if (user?.equityTradeType == 'lots') {
              body.profit =
                (body?.sell_rate - body?.buy_rate) * body?.lots * body.lot_size;
            } else if (user?.equityTradeType == 'units') {
              body.profit = (body?.sell_rate - body?.buy_rate) * body?.units;
            } else {
              return {
                message:
                  'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
              };
            }
            isProfit = true;
          }
          if (body?.sell_rate < body?.buy_rate) {
            if (user?.equityTradeType == 'lots') {
              body.loss =
                (body?.buy_rate - body?.sell_rate) * body?.lots * body.lot_size;
            } else if (user?.equityTradeType == 'units') {
              body.loss = (body?.buy_rate - body?.sell_rate) * body?.units;
            } else {
              return {
                message:
                  'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
              };
            }
          }
        } else {
          if (body?.sell_rate > body?.buy_rate) {
            if (user?.equityTradeType == 'lots') {
              body.profit =
                (body?.sell_rate - body?.buy_rate) * body?.lots * body.lot_size;
            } else if (user?.equityTradeType == 'units') {
              body.profit = (body?.sell_rate - body?.buy_rate) * body?.units;
            } else {
              return {
                message:
                  'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
              };
            }
            isProfit = true;
          }
          if (body?.sell_rate < body?.buy_rate) {
            if (user?.equityTradeType == 'lots') {
              body.loss =
                (body?.buy_rate - body?.sell_rate) * body?.lots * body.lot_size;
            } else if (user?.equityTradeType == 'units') {
              body.loss = (body?.buy_rate - body?.sell_rate) * body?.units;
            } else {
              return {
                message:
                  'Equity Trade Type (Unit or Lots) is not added to your account, please contact admin.'
              };
            }
          }
        }
      }
      console.log('before updated');
      try {
        const tradeClose = await TradesModel.findByIdAndUpdate(body._id, body, {
          new: true
        });
        console.log('after updated', tradeClose);
      } catch (error) {
        console.error(error);
      }

      // console.log("user",user);
      var brokerage = body?.brokerage ? body?.brokerage : 0;
      console.log('brok', brokerage);
      if (body?.segment.toLowerCase() == 'mcx') {
        if (body.lots) {
          amount = body?.lots * amount;
        } else {
          return {
            message: 'Lots must not be empty'
          };
        }
        brokerage =
          brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          amount = body?.lots * amount;
        } else if (body.units) {
          amount = body?.units * amount;
        }
        brokerage = brokerage + getBrokarage(amount, user?.EQBrokragePerCrore);
      }
      var ledger = {
        trade_id: body._id,
        user_id: body?.user_id,
        broker_id: user?.broker_id,
        amount: body?.sell_rate,
        brokerage: brokerage,
        type: body?.purchaseType ? body?.purchaseType : 'buy'
      };

      var remainingFund = user?.funds - amount - brokerage;
      console.log('funds', user?.funds, amount, brokerage);
      if (isProfit && body.buy_rate < body.sell_rate) {
        remainingFund = user?.funds + (amount - brokerage);
        console.log('profit');
      } else if (isProfit && body.buy_rate > body.sell_rate) {
        remainingFund = user?.funds - (amount - brokerage);
        console.log('loss');
      } else {
        remainingFund = user?.funds + body.buy_rate - brokerage;
        console.log('no profit/loss');
      }

      await AuthBusiness.updateFund(body?.user_id, remainingFund);
      await LedgersModel.create({
        ...ledger
      });
    }

    // return trade;
  }
}

const testTrade = async () => {
  // var active_trades = await TradesModel.find({ status: 'active' });
  //   const canclePendingTrades = await TradesModel.updateMany(
  //     { status: 'pending' },
  //     { isCancel: true }
  //   );
  //   var id;
  //   var mcx_scripts = ['AARTIIND_27APR2023'];
  //   var done_scripts = [];
  //   const socket = io('ws://5.22.221.190:5000', {
  //     transports: ['websocket']
  //   });
  //   for (const script of mcx_scripts) {
  //     socket.emit('join', script);
  //   }
  //   socket.on('stock', (data) => {
  //     // console.log("data 173---------- ", data);
  //     // console.log(done_scripts,data?.name)
  //     if (!done_scripts.includes(data?.name)) {
  //       clossTodaysTrades(data);
  //       // console.log("data 174---------- ", data);
  //       done_scripts.push(data?.name);
  //     } else {
  //       socket.off('join', data?.name);
  //     }
  //   });
  // };
  // for (const body of active_trades) {
  // console.log(body);
  // script = body.script
  // id = body._id
  // if (body?.status == 'active') {
  //   var amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
  //   var isProfit = false;
  //   if (body?.buy_rate && body?.sell_rate) {
  //     if (body?.purchaseType == 'sell') {
  //       if (body?.sell_rate > body?.buy_rate) {
  //         body.profit = (body?.sell_rate - body?.buy_rate) * body?.lots;
  //         isProfit = true;
  //       }
  //       if (body?.sell_rate < body?.buy_rate) {
  //         body.loss = (body?.buy_rate - body?.sell_rate) * body?.lots;
  //       }
  //     } else {
  //       if (body?.sell_rate > body?.buy_rate) {
  //         body.profit = (body?.sell_rate - body?.buy_rate) * body?.lots;
  //         isProfit = true;
  //       }
  //       if (body?.sell_rate < body?.buy_rate) {
  //         body.loss = (body?.buy_rate - body?.sell_rate) * body?.lots;
  //       }
  //     }
  //   }
  //   const trade = await TradesModel.findByIdAndUpdate(id, body, { new: true });
  //   var user = await AuthBusiness.me(body?.user_id);
  //   // console.log("user",user);
  //   var brokerage = body?.brokerage ? body?.brokerage : 0;
  //   console.log('brok', brokerage);
  //   if (body?.segment.toLowerCase() == 'mcx') {
  //     if (body.lots) {
  //       amount = body?.lots * amount;
  //     } else {
  //       return {
  //         message: 'Lots must not be empty'
  //       };
  //     }
  //     brokerage = brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
  //   }
  //   if (body?.segment.toLowerCase() == 'eq') {
  //     if (body.lots) {
  //       amount = body?.lots * amount;
  //     } else if (body.units) {
  //       amount = body?.units * amount;
  //     }
  //     brokerage = brokerage + getBrokarage(amount, user?.EQBrokragePerCrore);
  //   }
  //   var ledger = {
  //     trade_id: id,
  //     user_id: body?.user_id,
  //     broker_id: body?.broker_id,
  //     amount: body?.sell_rate,
  //     brokerage: brokerage,
  //     type: body?.purchaseType ? body?.purchaseType : 'buy'
  //   };
};

const ledgerbalance = async (brokerageId) => {
  let data = await LedgersModel.find({ broker_id: brokerageId });
  const broker = data.map((broker) => broker.brokerage);
  const brokerage = broker.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return {
    brokerledger: brokerage
  };
};

const userledgerbalance = async (userId) => {
  let data = await LedgersModel.find({ user_id: userId });
  const user = data.map((user) => user?.brokerage);
  const userledger = user?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const tradeIds = data.map((ledger) => ledger.trade_id);
  const trades = await TradesModel.find({
    _id: { $in: tradeIds },
    status: 'active'
  });
  const profit = trades.map((trades) => trades.profit || 0);
  const loss = trades.map((trades) => trades.loss || 0);

  const profitloss = profit - loss;

  return {
    userledgerblance: userledger,
    active_pl: profitloss || 0
  };
};

const findFunds = async (userId) => {
  let data = await TradesModel.find({ user_id: userId });
  const user = data.map((user) => user?.user_id);
  const finduser = await UserModel.findById(user);

  return {
    Amount: finduser.funds,
    CreatedAt: finduser.created_at
  };
};

const getUserTrades = async (userId) => {
  let data = await TradesModel.find({ user_id: userId });

  return data;
};

const ActiveTrades = async (userId) => {
  let data = await TradesModel.find({ user_id: userId, status: 'active' });

  return data;

  //   var remainingFund = user?.funds - amount - brokerage;
  //   console.log('funds', user?.funds, amount, brokerage);
  //   if (isProfit && body.buy_rate < body.sell_rate) {
  //     remainingFund = user?.funds + (amount - brokerage);
  //     console.log('profit');
  //   } else if (isProfit && body.buy_rate > body.sell_rate) {
  //     remainingFund = user?.funds - (amount - brokerage);
  //     console.log('loss');
  //   } else {
  //     remainingFund = user?.funds + body.buy_rate - brokerage;
  //     console.log('no profit/loss');
  //   }

  //   await AuthBusiness.updateFund(body?.user_id, remainingFund);
  //   await LedgersModel.create({
  //     ...ledger
  //   });

  //   return trade;
  // }
  // }
  // return canclePendingTrades;
};

const ClosedTrades = async (userId) => {
  const today = new Date();

  const startOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
  );
  const endOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
  );

  let data = await TradesModel.find({
    user_id: userId,
    status: 'closed',
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });
  const Ledgers = await LedgersModel.find({ user_id: userId });
  const findbroker = Ledgers.map((trade) => trade.brokerage || 0);
  // Map over the trades and add the brokerage value from the findbroker array
  data = data.map((trade) => {
    const brokerage =
      Ledgers.filter((i) =>
        new ObjectId(i.trade_id).equals(new ObjectId(trade._id))
      ).length > 0
        ? Ledgers.filter((i) =>
            new ObjectId(i.trade_id).equals(new ObjectId(trade._id))
          )[0].brokerage
        : 0;
    return {
      ...trade.toObject(),
      brokerage
    };
  });

  return data;
};

const MCXpendingTrades = async (userId) => {
  let data = await TradesModel.find({
    user_id: userId,
    status: 'pending',
    segment: 'mcx'
  });

  return data;
};

const EQpendingTrades = async (userId) => {
  let data = await TradesModel.find({
    user_id: userId,
    status: 'pending',
    segment: 'eq'
  });

  return data;
};

const weeklyfinduser = async (userId) => {
  let dataByWeek = [];
  let currentDate = new Date();

  // Iterate over the past 12 weeks (3 months)
  for (let i = 0; i < 48; i++) {
    let startDate = new Date(currentDate.getTime());
    startDate.setDate(startDate.getDate() - 7); // Get date 7 days ago
    let endDate = new Date(currentDate.getTime());
    endDate.setDate(endDate.getDate() - 1); // Get date 1 day ago

    // Search for data for this week
    let data = await TradesModel.find({
      user_id: userId,
      createdAt: { $gte: startDate, $lt: endDate }
    });

    // Add the data to the array of data by week
    if (data.length) {
      dataByWeek.push(data);
    }

    // Move the current date back 1 week for the next iteration
    currentDate.setDate(currentDate.getDate() - 7);
  }

  return dataByWeek;
};

const ActiveTradesbyuser = async () => {
  let data = await TradesModel.find({ status: 'active' });
  let newdata = [];
  for (let i = 0; i < data.length; i++) {
    // const trade = data[i];
    // const user = await UserModel.findById(trade.user_id);
    // newdata.push({
    //   name: user?.name,
    //   ledgerbalance: user?.funds,
    //   user_name: user?.user_id
    // });
    const trade = data[i];
    const user = await UserModel.findById(trade.user_id);
    const userTrades =
      newdata.find((item) => item.user_name === user?.user_id)?.trades ?? [];
    userTrades.push(trade);
    const updatedUser = {
      name: user?.name,
      ledgerbalance: user?.funds,
      user_name: user?.user_id,
      trades: userTrades,
      intradayExposureMarginMCX: user?.intradayExposureMarginMCX,
      intradayExposureMarginEQ: user?.intradayExposureMarginEQ
    };
    newdata = newdata.filter((item) => item.user_name !== user?.user_id);
    newdata.push(updatedUser);
  }
  return newdata;
};

const getAllbroker = async (broker_id) => {
  // Database query
  return await TradesModel.find({ broker_id: broker_id });
};

const findUserByBroker = async (broker_id) => {
  // Database query
  let data = await TradesModel.find({ broker_id: broker_id });
  const allbroker = data.map((trade) => trade.user_id);
  let userdata = await UserModel.find({ _id: allbroker });

  return userdata;
};

const ActiveTradesByBroker = async (userId, broker_id) => {
  let data = await TradesModel.find({
    user_id: userId,
    broker_id: broker_id,
    status: 'active'
  });

  return data;
};

const ClosedTradesByBroker = async (userId, broker_id) => {
  const today = new Date();

  const startOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
  );
  const endOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
  );

  let data = await TradesModel.find({
    user_id: userId,
    broker_id: broker_id,
    status: 'closed',
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });
  const Ledgers = await LedgersModel.find({ user_id: userId });
  const findbroker = Ledgers.map((trade) => trade.brokerage || 0);
  // Map over the trades and add the brokerage value from the findbroker array
  data = data.map((trade) => {
    const brokerage =
      Ledgers.filter((i) =>
        new ObjectId(i.trade_id).equals(new ObjectId(trade._id))
      ).length > 0
        ? Ledgers.filter((i) =>
            new ObjectId(i.trade_id).equals(new ObjectId(trade._id))
          )[0].brokerage
        : 0;
    return {
      ...trade.toObject(),
      brokerage
    };
  });

  return data;
};

const MCXpendingTradesByBroker = async (userId, broker_id) => {
  let data = await TradesModel.find({
    user_id: userId,
    broker_id: broker_id,
    status: 'pending',
    segment: 'mcx'
  });

  return data;
};

const EQpendingTradesBYBroker = async (userId, broker_id) => {
  let data = await TradesModel.find({
    user_id: userId,
    broker_id: broker_id,
    status: 'pending',
    segment: 'eq'
  });

  return data;
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
  ledgerbalance,
  userledgerbalance,
  findFunds,
  ActiveTrades,
  ClosedTrades,
  MCXpendingTrades,
  EQpendingTrades,
  weeklyfinduser,
  getUserTrades,
  testTrade,
  ActiveTradesbyuser,
  getAllbroker,
  findUserByBroker,
  ActiveTradesByBroker,
  ClosedTradesByBroker,
  MCXpendingTradesByBroker,
  EQpendingTradesBYBroker
};
