// Business
import TradesBusiness from '@/business/trades.business';
import { success, error ,unauthorized} from '@/utils/helper.util';
import adminNotificationBusiness from '@/business/adminnotification.bussiness';
import userNotificationBusiness from '@/business/usernotification.bussiness';
import NotificationBusiness from '@/business/notification.bussiness';
// Libs
import validator from 'validator';
import admin from '@/firebase/firebase';

const getAllBuyRates = async (req, res) => {
  try {
    const data = await TradesBusiness.getAllBuyRates();
    success(res, data);
  } catch (err) {
    error(res, err);
  }
};

const getAllsellRates = async (req, res) => {
  try {
    const data = await TradesBusiness.getAllsellRates();
    success(res, data);
  } catch (err) {
    error(res, err);
  }
};

const getAllternover = async (req, res) => {
  try {
    const data = await TradesBusiness.getAllternover();
    success(res, data);
  } catch (err) {
    error(res, err);
  }
};

const getactivetrade = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getactivetrade();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllProfitandloss = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getAllProfitandloss();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllactive_buy = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getAllactive_buy();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllactive_sell = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getAllactive_sell();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const Brokerege = async (req, res) => {
  try {
    const data = await TradesBusiness.Brokerege();
    success(res, data);
  } catch (err) {
    error(res, err);
  }
};

const getAll = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getAll();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllLedgers = async (req, res) => {
  try {
    // Business logic
    const data = await TradesBusiness.getAllLedgers();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllByStatus = async (req, res) => {
  try {
    // Business logic

    const status = req.params.status;
    if (!['active', 'pending', 'closed'].includes(status)) {
      return res.status(400).send('Invalid status');
    }

    const data = await TradesBusiness.getAllByStatus(status);
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getAllLogged = async (req, res) => {
  try {
    // Get current user id from session
    const user_id = req.user.id;
    // Validate data format
    if (!validator.isMongoId(user_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth User id...'
      };
    }
    // Business logic
    const data = await TradesBusiness.getAllLogged(user_id);
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const getTradeByStatus = async (req, res) => {
  try {
    // Get current user id from session
    const user_id = req.user.id;
    const status = req.params.status;
    if (!['active', 'pending', 'closed'].includes(status)) {
      return res.status(400).send('Invalid status');
    }
    // Validate data format
    if (!validator.isMongoId(user_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth User id...'
      };
    }
    // Business logic
    const data = await TradesBusiness.getByStatus(user_id, status);
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};
 
/**
 * create
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createTrade = async (req, res) => {
  try {
    req.body.user_id = req.user.id;
    if (
      (req.body?.purchaseType == 'buy' && req.body?.buy_rate) ||
      (req.body?.purchaseType == 'sell' && req.body?.sell_rate)
    ) {
      const payload = {
        notification: {
          title: 'New Notification',
          body: `Trade of ${req.body.purchaseType} with the rate of ${req.body?.purchaseType == 'buy' ? req.body.buy_rate : req.body.sell_rate} is Entry by STOPLOSS(762)`
        }
      };
      console.log(payload.notification.body,'upper');
      await NotificationBusiness.create({notification:payload.notification.body});
      console.log(payload.notification.body,'down');
      
      const adminnotification = await adminNotificationBusiness.getAll();
      const admintokens = adminnotification.map(user => user.fcm_token);

      const usernotification = await userNotificationBusiness.getAll();
      const usertokens = usernotification.map(user => user.fcm_token);

      const tokens = admintokens || usertokens;

      const data = await TradesBusiness.create(req.body);
      console.log(data, 'data');
      if (data?.message) {
        return success(res, data);
      } 
      // let created = '_id' in data || 'n' in data;
      // return success(res, 201, { created });
      //send notification from here from firebase
      // const userFCMToken = req.user.fcm_token
      const multicastMessage = {
        tokens: tokens,
        webpush: {
          notification: payload.notification
        }
      };
      console.log(multicastMessage.webpush.notification,'notification last');
      admin
        .messaging()
        .sendMulticast(multicastMessage)
        .then((response) => {
          console.log('Notification sent successfully:', response);
        })
        .catch((error) => {
          console.log('Error sending notification:', error);
        });

      return res.send({ msg: 'Successfully trade create', data });
    } else {
      return success(res, {
        message: 'You need to provide the Buy or Sell rate'
      });
    }
  } catch (err) {
    error(res, err);
  }
};

/**
 * update
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateTrade = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;
    if (
      (req.body?.purchaseType == 'buy' && req.body?.buy_rate) ||
      (req.body?.purchaseType == 'sell' && req.body?.sell_rate)
    ) {
      const payload = {
        notification: {
          title: 'New Notification',
          body: `Trade of ${req.body.purchaseType} with the rate of ${req.body?.purchaseType == 'buy' ? req.body.buy_rate : req.body.sell_rate} is Entry by STOPLOSS(762)`
        }
      };

      await NotificationBusiness.create({notification:payload.notification.body});
      
      const adminnotification = await adminNotificationBusiness.getAll();
      const admintokens = adminnotification.map(user => user.fcm_token);

      const usernotification = await userNotificationBusiness.getAll();
      const usertokens = usernotification.map(user => user.fcm_token);

      const tokens = admintokens || usertokens;

    const data = await TradesBusiness.update(req.params.id, req.body);
    console.log(data, data);
      if (data?.message) {
        return success(res, data);
      }
      // let created = '_id' in data || 'n' in data;
      // return success(res, 201, { created });
      //send notification from here from firebase
      // const userFCMToken = req.user.fcm_token
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
          console.log('Error sending notification:', error);
        });

      return res.send({ msg: 'Successfully update trade ', data });
    } else {
      return success(res, {
        message: 'You need to provide the Buy or Sell rate'
      });
    }
  } catch (err) {
    error(res, err);
  }
};

// const ledgerbalance = async (req, res) => {
//   try {
//     const broker = req.params.id;
//     // Validate data format
//     if (!validator.isMongoId(broker)) {
//       throw {
//         code: 'ERROR_AUTH_4',
//         message: 'Invalid auth broker id...'
//       };
//     }
//     const data = await TradesBusiness.ledgerbalance(broker);
//     // console.log(data,"data");
//     success(res, 201, { data });
//   } catch (err) {
//     error(res, err);
//   }
// };


const ledgerbalance = async (req, res) => {
  try {
    const broker_id = req.user.id;

    if (validator.isEmpty(broker_id)) {
      throw {
        code: 'ERROR_AUTH_3',
        message: 'The broker id cannot be empty'
      };
    }

    if (!validator.isMongoId(broker_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth broker id...'
      };
    }

    if (broker_id) {
      let data = await TradesBusiness.ledgerbalance(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};


const userledgerbalance = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (validator.isEmpty(user_id)) {
      throw {
        code: 'ERROR_AUTH_3',
        message: 'The user id cannot be empty'
      };
    }

    if (!validator.isMongoId(user_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth user id...'
      };
    }

    if (user_id) {
      let data = await TradesBusiness.userledgerbalance(user_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};

const findFunds = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.findFunds(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};



const ActiveTrades = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.ActiveTrades(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};


const ClosedTrades = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.ClosedTrades(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};


const MCXpendingTrades = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.MCXpendingTrades(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};



const EQpendingTrades = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.EQpendingTrades(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};


const weeklyfinduser = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await TradesBusiness.weeklyfinduser(req.params.id);
    // console.log(data,"data");
    let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};

const getTradesByUser = async (req, res) => {
  try {
    const user_id = req.params.id;

    if (validator.isEmpty(user_id)) {
      throw {
        code: 'ERROR_AUTH_3',
        message: 'The user id cannot be empty'
      };
    }

    if (!validator.isMongoId(user_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth user id...'
      };
    }

    if (user_id) {
      let data = await TradesBusiness.getUserTrades(user_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};


// const weeklyfinduser = async (req, res) => {
//   try {
//     const user_id = req.user.id;

//     if (validator.isEmpty(user_id)) {
//       throw {
//         code: 'ERROR_AUTH_3',
//         message: 'The user id cannot be empty'
//       };
//     }

//     if (!validator.isMongoId(user_id)) {
//       throw {
//         code: 'ERROR_AUTH_4',
//         message: 'Invalid auth user id...'
//       };
//     }

//     if (user_id) {
//       let data = await TradesBusiness.weeklyfinduser(user_id);
//       return data ? success(res, data) : unauthorized(res);
//     } else {
//       return unauthorized(res);
//     }
//   } catch (err) {
//     error(res, err);
//   }
// };


const testTrade = async (req, res) => {
  try {
    console.log("data");
    const data = await TradesBusiness.testTrade();
   
    success(res, 201, { data });

  } catch (err) {
    error(res, err);
  }
};


export default {
  getAll,
  getAllLogged,
  createTrade,
  updateTrade,
  getAllByStatus,
  getTradeByStatus,
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
  getTradesByUser,

  testTrade

};
