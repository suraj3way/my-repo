// Models
import TradesModel from '@/models/trades.model';
import LedgersModel from '@/models/ledgers.model';
import AuthBusiness from '@/business/auth.business';
import BrokersBusiness from '@/business/broker.business';
import adminNotificationBusiness from '@/business/adminnotification.bussiness';
import userNotificationBusiness from '@/business/usernotification.bussiness';
import NotificationBusiness from '@/business/notification.bussiness';

import admin from '@/firebase/firebase';

import UserModel from '@/models/user.model';
import { async } from '@babel/runtime/regenerator';
import { isCancel } from 'apisauce';
const ObjectId = require('mongodb').ObjectId;

const io = require('socket.io-client');

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
    userIdToNameMap[user._id.toString()] = user.user_id;
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

function profit_sharing(total, profitLossPercentage){
  var amaount = (total * profitLossPercentage ) /100;
  console.log(total,'total');
  console.log(profitLossPercentage,'profitLossPercentage');
  console.log(amaount,'ama');
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

async function getActivetrades(user_id) {
  var active_trades = await TradesModel.find({
    user_id: user_id,
    status: 'active'
  });

  return active_trades;
}

const create = async (body, res) => {
  var user = await AuthBusiness.me(body?.user_id);
  var broker = await BrokersBusiness.findbroker(body.broker_id);
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
        if(broker.type=='profit sharing'){
          brokerage = profit_sharing(amount, broker?.profitLossPercentage);
        }
        else{
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
        if(broker.type=='profit sharing'){
          brokerage = profit_sharing(amount, broker?.profitLossPercentage);
        }
        else{
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
            (amount * body.lot_size) / user.intradayExposureMarginMCX;
        }
        // else {
        //   intradayMCXmarging =
        //     (amount * body.units) / user.intradayExposureMarginMCX;
        // }
      } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
        if (body.lots) {
          intradayMCXmarging =
            (amount * body.lot_size) / user.intradayExposureMarginMCX;
        }
        // else if (body.units) {
        //   intradayMCXmarging =
        //     (amount * body.units) / user.intradayExposureMarginMCX;
        // }
      }
      var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
      if (availbleIntradaymargingMCX < 0) {
        return { message: 'intradayMCXmarging not availble' };
      }

      var intradayEQmarging = 0;
      if (body?.segment.toLowerCase() == 'eq' && amount) {
        if (body.lots) {
          intradayEQmarging =
            (amount * body.lot_size) / user.intradayExposureMarginEQ;
        } else {
          intradayEQmarging =
            (amount * body.units) / user.intradayExposureMarginEQ;
        }
      } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
        if (body.lots) {
          intradayEQmarging =
            (amount * body.lot_size) / user.intradayExposureMarginEQ;
        } else if (body.units) {
          intradayEQmarging =
            (amount * body.units) / user.intradayExposureMarginEQ;
        }
      }
      all_active_trades.forEach(async (body) => {
        if (body?.segment.toLowerCase() == 'mcx' && amount) {
          if (body.lots) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.lot_size) / user.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.units) / user.intradayExposureMarginMCX;
          }
        } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
          if (body.lots) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.lot_size) / user.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              intradayMCXmarging +
              (amount * body.units) / user.intradayExposureMarginMCX;
          }
        }
        var availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
        if (availbleIntradaymargingMCX < 0.7 * user?.funds) {

          const payload = {
            notification: {
              title: 'New Notification',
              body: `User Used 70% blance availble blance ${availbleIntradaymargingMCX} by STOPLOSS(762)`
            }
          };
          await NotificationBusiness.create({
            notification: payload.notification.body
          });

          const adminnotification = await adminNotificationBusiness.getAll();
          const admintokens = adminnotification.map((user) => user.fcm_token);

          const usernotification = await userNotificationBusiness.getAll();
          const usertokens = usernotification.map((user) => user.fcm_token);

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
              console.log('Notification sent successfully:', response);
            })
            .catch((error) => {
              console.log('Error sending notification');
            });
        }
        if (availbleIntradaymargingMCX < 0) {
          return { message: 'intradayMCXmarging not availble' };
        }

        if (body?.segment.toLowerCase() == 'eq' && amount) {
          if (body.lots) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.lot_size) / user.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.units) / user.intradayExposureMarginEQ;
          }
        } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
          if (body.lots) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.lot_size) / user.intradayExposureMarginEQ;
          } else if (body.units) {
            intradayEQmarging =
              intradayEQmarging +
              (amount * body.units) / user.intradayExposureMarginEQ;
          }
        }
      });
      var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;
      if (availbleIntradaymargingEQ < 0.7 * user?.funds) {
        const payload = {
          notification: {
            title: 'New Notification',
            body: `User Used 70% blance availble blance ${availbleIntradaymargingEQ} by STOPLOSS(762)`
          }
        };
        await NotificationBusiness.create({
          notification: payload.notification.body
        });

        const adminnotification = await adminNotificationBusiness.getAll();
        const admintokens = adminnotification.map((user) => user.fcm_token);

        const usernotification = await userNotificationBusiness.getAll();
        const usertokens = usernotification.map((user) => user.fcm_token);

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
            console.log('Notification sent successfully:', response);
          })
          .catch((error) => {
            console.log('Error sending notification');
          });
      } 
      if (availbleIntradaymargingEQ < 0) {
        return { message: 'intradayEQmarging not availble' };
      }
      // var intradayMCXmarging = 0;
      // if (body?.segment.toLowerCase() == 'mcx' && body.buy_rate) {
      //   if (body.lots) {
      //     intradayMCXmarging = (body.buy_rate * body.lots * body.lot_size) / user.intradayExposureMarginMCX;
      //   } else {
      //     intradayMCXmarging = (body.buy_rate * body.units * body.lot_size) / user.intradayExposureMarginMCX;
      //   }
      // } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
      //   if (body.lots) {
      //     intradayMCXmarging = (body.buy_rate * body.lots * body.lot_size) / user.intradayExposureMarginMCX;
      //   } else if (body.units) {
      //     intradayMCXmarging = (body.buy_rate * body.units * body.lot_size) / user.intradayExposureMarginMCX;
      //   }
      // }

      // availbleIntradaymargingMCX = user?.funds - intradayMCXmarging;
      // // console.log(availbleIntradaymargingMCX, 'suraj1');
      // if (availbleIntradaymargingMCX < 0) {
      //   return { message: 'intradayMCXmarging not availble' };
      // }

      // var intradayEQmarging = 0;
      // if (body?.segment.toLowerCase() == 'eq' && body.buy_rate) {
      //   if (body.lots) {
      //     intradayEQmarging = (body.buy_rate * body.lots * body.lot_size) / user.intradayExposureMarginEQ;
      //   } else {
      //     intradayEQmarging = (body.buy_rate * body.units * body.lot_size) / user.intradayExposureMarginEQ;
      //   }
      // } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
      //   if (body.lots) {
      //     intradayEQmarging = (body.buy_rate * body.lots * body.lot_size) / user.intradayExposureMarginEQ;
      //   } else if (body.units) {
      //     intradayEQmarging = (body.buy_rate * body.units * body.lot_size) / user.intradayExposureMarginEQ;
      //   }
      // }

      // var availbleIntradaymargingEQ = user?.funds - intradayEQmarging;
      // if (availbleIntradaymargingEQ < 0) {
      //   return { message: 'intradayEQmarging not availble' };
      // }
      // console.log(availbleIntradaymargingEQ, 'suraj12');
      // console.log(intradayEQmarging, 'suraj12');

      // var holdingMCXmarging = 0;
      // if (body?.segment.toLowerCase() == 'mcx' && body.buy_rate) {
      //   if (body.lots) {
      //     holdingMCXmarging =
      //       (body.buy_rate * body.lots * body.lot_size) /
      //       user.holdingExposureMarginMCX;
      //     console.log(holdingMCXmarging, 'holdingMCXmarging---buy');
      //   } else {
      //     holdingMCXmarging =
      //       (body.buy_rate * body.units * body.lot_size) /
      //       user.holdingExposureMarginMCX;
      //   }
      // } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
      //   if (body.lots) {
      //     holdingMCXmarging =
      //       (body.sell_rate * body.lots * body.lot_size) /
      //       user.holdingExposureMarginMCX;
      //     console.log(holdingMCXmarging, 'holdingMCXmarging2 ----- sell');
      //   } else if (body.units) {
      //     holdingMCXmarging =
      //       (body.sell_rate * body.units * body.lot_size) /
      //       user.holdingExposureMarginMCX;
      //   }
      // }
      // console.log(holdingMCXmarging, 'holdingMCXmarging ---last');

      // var availbleholdingmargingmcx = user?.funds - holdingMCXmarging;
      // if (availbleholdingmargingmcx < 0) {
      //   return { message: 'holdingMCXmarging not availble' };
      // }

      // var holdingEQmarging = 0;
      // if (body?.segment.toLowerCase() == 'eq' && body.buy_rate) {
      //   if (body.lots) {
      //     holdingEQmarging =
      //       (body.buy_rate * body.lots * body.lot_size) /
      //       user.holdingExposureMarginEQ;
      //   } else {
      //     holdingEQmarging =
      //       (body.buy_rate * body.units * body.lot_size) /
      //       user.holdingExposureMarginEQ;
      //   }
      // } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
      //   if (body.lots) {
      //     holdingEQmarging =
      //       (body.buy_rate * body.lots * body.lot_size) /
      //       user.holdingExposureMarginEQ;
      //   } else if (body.units) {
      //     holdingEQmarging =
      //       (body.buy_rate * body.units * body.lot_size) /
      //       user.holdingExposureMarginEQ;
      //   }
      // }

      // var availbleholdingmargingEQ = user?.funds - holdingEQmarging;
      // if (availbleholdingmargingEQ < 0) {
      //   return { message: 'holdingEQmarging not availble' };
      // }
      // console.log(availbleholdingmargingEQ, 'suraj1234');
      // console.log(holdingEQmarging, 'suraj1234');
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
        return {
          name: user.name,
          buy_rate: trade.buy_rate,
          sell_rate:trade.sell_rate
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
    return {
      name: user.name,
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
      const tradePending = TradesModel.findByIdAndUpdate(id, body, {
        new: true
      });
      return tradePending;
    } 
    else if (body?.status == 'closed') {
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
        
        if(broker.type =='profit sharing'){
          buybrokerage = buybrokerage +  profit_sharing(buyamount, broker?.profitLossPercentage);
          console.log(buybrokerage,'buybrokerage');
        }
        else{
          buybrokerage = buybrokerage + getBrokarage(buyamount, user?.mcxBrokeragePerCrore);
        }

        // buybrokerage =
        //   buybrokerage + getBrokarage(buyamount, user?.mcxBrokeragePerCrore);
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          buyamount = body?.lots * buyamount;
        } else if (user?.equityTradeType == 'units' && body.units) {
          buyamount = body?.units * buyamount;
        }
        if(broker.type=='profit sharing'){
          buybrokerage = buybrokerage +  profit_sharing(buyamount, broker?.profitLossPercentage);
        }
        else{
          buybrokerage = buybrokerage + getBrokarage(buyamount, user?.mcxBrokeragePerCrore);
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
        if(broker.type=='profit sharing'){
          brokerage = brokerage + profit_sharing(amount, broker?.profitLossPercentage);
        }
        else{
          brokerage =brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
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
        if(broker.type=='profit sharing'){
          brokerage = brokerage + profit_sharing(amount, broker?.profitLossPercentage);
        }
        else{
          brokerage =brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
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
        user.funds + Amount - parseFloat(brokerage + buybrokerage);
      console.log(remainingFund,'remain');
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
      const socket = io('ws://5.22.221.190:8000', {
        transports: ['websocket']
      });

      for (const script of mcx_scripts) {
        socket.emit('join', script);
      }

      socket.on('stock', async (data) => {
        console.log(data, 'bt met');
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
        if(broker.type=='profit sharing'){
          brokerage = brokerage + profit_sharing(amount, broker?.profitLossPercentage);
          console.log(brokerage,'brokerage');
        }
        else{
          brokerage =brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
        }
      }
      if (body?.segment.toLowerCase() == 'eq') {
        if (user?.equityTradeType == 'lots' && body.lots) {
          amount = body?.lots * amount;
        } else if (user?.equityTradeType == 'units' && body.units) {
          amount = body?.units * amount;
        }
        if(broker.type=='profit sharing'){
          brokerage = brokerage + profit_sharing(amount, broker?.profitLossPercentage);
          console.log(brokerage,'brokerage');
        }
        else{
          brokerage =brokerage + getBrokarage(amount, user?.mcxBrokeragePerCrore);
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
          if(broker.type=='profit sharing'){
            brokerage = profit_sharing(amount, broker?.profitLossPercentage);
            console.log(brokerage,'brokerage');
          }
          else{
            brokerage = getBrokarage(amount, user?.mcxBrokeragePerCrore);
          }
        } else if (body?.segment.toLowerCase() == 'eq') {
          if (user?.equityTradeType == 'lots' && body.lots) {
            amount = body?.lots * amount;
          } else if (user?.equityTradeType == 'units' && body.units) {
            amount = body?.units * amount;
          }
          if(broker.type=='profit sharing'){
            brokerage = profit_sharing(amount, broker?.profitLossPercentage);
          }
          else{
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
              (amount * thisTrade.lot_size) / user.intradayExposureMarginMCX;
          } else {
            intradayMCXmarging =
              (amount * body.units) / user.intradayExposureMarginMCX;
          }
        } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
          if (body.lots) {
            intradayMCXmarging =
              (amount * thisTrade.lot_size) / user.intradayExposureMarginMCX;
          } else if (body.units) {
            intradayMCXmarging =
              (amount * body.units) / user.intradayExposureMarginMCX;
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
              (amount * thisTrade.lot_size) / user.intradayExposureMarginEQ;
          } else {
            intradayEQmarging =
              (amount * body.units) / user.intradayExposureMarginEQ;
          }
        } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
          if (user?.equityTradeType == 'lots' && body.lots) {
            intradayEQmarging =
              (amount * thisTrade.lot_size) / user.intradayExposureMarginEQ;
          } else if (user?.equityTradeType == 'units' && body.units) {
            intradayEQmarging =
              (amount * body.units) / user.intradayExposureMarginEQ;
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
            broker_id: user.broker_id,
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
            name: user.name,
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
          (amount * body.lots) / user.holdingExposureMarginMCX;
      } else {
        holdingMCXmarging =
          (amount * body.units) / user.holdingExposureMarginMCX;
      }
    } else if (body?.segment.toLowerCase() == 'mcx' && body.sell_rate) {
      if (body.lots) {
        holdingMCXmarging =
          (amount * body.lots) / user.holdingExposureMarginMCX;
      } else if (body.units) {
        holdingMCXmarging =
          (amount * body.units) / user.holdingExposureMarginMCX;
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
        holdingEQmarging = (amount * body.lots) / user.holdingExposureMarginEQ;
      } else {
        holdingEQmarging = (amount * body.units) / user.holdingExposureMarginEQ;
      }
    } else if (body?.segment.toLowerCase() == 'eq' && body.sell_rate) {
      if (user?.equityTradeType == 'lots' && body.lots) {
        holdingEQmarging = (amount * body.lots) / user.holdingExposureMarginEQ;
      } else if (body.units) {
        holdingEQmarging = (amount * body.units) / user.holdingExposureMarginEQ;
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
  const user = data.map((user) => user.brokerage);
  const userledger = user.reduce(
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
  const user = data.map((user) => user.user_id);
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
    //   name: user.name,
    //   ledgerbalance: user.funds,
    //   user_name: user.user_id
    // });
    const trade = data[i];
    const user = await UserModel.findById(trade.user_id);
    const userTrades =
      newdata.find((item) => item.user_name === user.user_id)?.trades ?? [];
    userTrades.push(trade);
    const updatedUser = {
      name: user.name,
      ledgerbalance: user.funds,
      user_name: user.user_id,
      trades: userTrades
    };
    newdata = newdata.filter((item) => item.user_name !== user.user_id);
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
