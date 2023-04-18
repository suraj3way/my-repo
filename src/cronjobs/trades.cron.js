import cron from 'node-cron';
import TradesModel from '@/models/trades.model';
import LedgersModel from '@/models/ledgers.model';
import AuthBusiness from '@/business/auth.business';
const io = require('socket.io-client');

function getBrokarage(total, BrokeragePerCrore) {
  var broker_per = parseInt(BrokeragePerCrore) / 10000;
  var amaount = (total * broker_per) / 100;
  return amaount;
}

async function clossTodaysTrades(data) {
  console.log('1');
  var active_trades = await TradesModel.find({
    status: 'active',
    script: data.name
  });
  // console.log("active trades",active_trades)
  var amount = 0;
  var isProfit = false;
  console.log('2');
  for (var body of active_trades) {
    amount = body?.purchaseType == 'buy' ? body?.buy_rate : body?.sell_rate;
    console.log('3');
    var user = await AuthBusiness.me(body?.user_id);
    var holdingMCXmarging = 0;
    if (body?.segment == 'mcx' && amount) {
      console.log('4');
      if (body.lots) {
        holdingMCXmarging = (user.funds * body.lot_size) / user.holdingExposureMarginMCX;
      } else {
        holdingMCXmarging = (user.funds * body.units) / user.holdingExposureMarginMCX;
      }
    } else if (body?.segment == 'mcx' && body.sell_rate) {
      if (body.lots) {
        holdingMCXmarging = (user.funds * body.lot_size) / user.holdingExposureMarginMCX;
      } else if (body.units) {
        holdingMCXmarging = (user.funds * body.units) / user.holdingExposureMarginMCX;
      }
    }
    console.log('5', user?.funds, holdingMCXmarging);
    var availbleholdingmargingmcx = user?.funds - holdingMCXmarging;
    // if (availbleholdingmargingmcx < 0) {
    //   return { message: 'holdingMCXmarging not availble' };
    // }
    // console.log(availbleholdingmargingmcx, 'suraj123');
    // console.log(holdingMCXmarging, 'suraj123');

    var holdingEQmarging = 0;
    if (body?.segment == 'eq' && amount) {
      console.log('6');
      if (body.lots) {
        holdingEQmarging = (user.funds * body.lot_size) / user.holdingExposureMarginEQ;
      } else {
        holdingEQmarging = (user.funds * body.units) / user.holdingExposureMarginEQ;
      }
    } else if (body?.segment == 'eq' && body.sell_rate) {
      if (body.lots) {
        holdingEQmarging = (user.funds * body.lot_size) / user.holdingExposureMarginEQ;
      } else if (body.units) {
        holdingEQmarging = (user.funds * body.units) / user.holdingExposureMarginEQ;
      }
    }

    var availbleholdingmargingEQ = user?.funds - holdingEQmarging;
    console.log('availbleholdingmargingmcx', availbleholdingmargingmcx);
    var availableHoldingMargin =
      body?.segment == 'eq'
        ? availbleholdingmargingEQ
        : availbleholdingmargingmcx;
    console.log('availableHoldingMargin', availableHoldingMargin);
    if (availableHoldingMargin < 0) {
      console.log('7');
      // return { message: 'holdingEQmarging not availble' };
      body.status = 'closed';

      console.log('8');
      if (body?.purchaseType == 'buy') {
        body.sell_rate = data.bid;
      } else if (body?.purchaseType == 'sell') {
        body.buy_rate = data.ask;
      }

      isProfit = false;
      // console.log(body);
      console.log('9');
      if (body?.buy_rate && body?.sell_rate) {
        console.log('10');
        if (body?.purchaseType == 'sell') {
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
            body.loss = (body?.buy_rate - body?.sell_rate) * body?.lots;
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
      if (body?.segment == 'mcx') {
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
      if (body?.segment == 'eq') {
        if (body.lots) {
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

// async function runCronToCloseTrades() {
//   // var active_trades = await TradesModel.find({ status: 'active' });
//   console.log('0.1');
//   const canclePendingTrades = await TradesModel.updateMany(
//     { status: 'pending' },
//     { isCancel: true }
//   );
//   var id;
//   var mcx_scripts = ['ALUMINIUM_28APR2023', 'COPPER_28APR2023'];
//   var done_scripts = [];
//   const socket = io('ws://5.22.221.190:8000', {
//     transports: ['websocket']
//   });
//   for (const script of mcx_scripts) {
//     socket.emit('join', script);
//     console.log('0.2');
//   }
//   socket.on('stock', (data) => {
//     // console.log("data 173---------- ", data);
//     // console.log(done_scripts,data?.name)
//     if (!done_scripts.includes(data?.name)) {
//       clossTodaysTrades(data);
//       console.log('data---------- ', data);
//       done_scripts.push(data?.name);
//     } else {
//       socket.off('join', data?.name);
//     }
//   });
// }
// Schedule a task to run every day at 23:15 IST
// cron.schedule('55 18 * * *', () => {
//   console.log('Running cron job...');
//   runCronToCloseTrades();
// }, {
//   timezone: 'Asia/Kolkata'
// });

// cron.schedule('*/1 * * * *', () => {
//     // Call the runCronToCloseTrades() function here
//     console.log("running crone--------------------------------------------------------------------------",new Date())
//     runCronToCloseTrades();
//   });



// Schedule a task to run every day at 11:15pm to 11:30pm

async function runCronToCloseTrades() {
  const now = new Date();
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 15, 0); // set start time to 11:15 pm
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 30, 0); // set end time to 11:30 pm

  if (now >= startTime && now <= endTime) { // check if the current time is between the start and end times
    console.log('0.1');
    const canclePendingTrades = await TradesModel.updateMany(
      { status: 'pending' },
      { isCancel: true }
    );
    var id;
    var mcx_scripts = ['ALUMINIUM_28APR2023', 'COPPER_28APR2023'];
    var done_scripts = [];
    const socket = io('ws://5.22.221.190:8000', {
      transports: ['websocket']
    });
    for (const script of mcx_scripts) {
      socket.emit('join', script);
      console.log('0.2');
    }
    socket.on('stock', (data) => {
      if (!done_scripts.includes(data?.name)) {
        clossTodaysTrades(data);
        console.log('data---------- ', data);
        done_scripts.push(data?.name);
      } else {
        socket.off('join', data?.name);
      }
    });
  }
}
