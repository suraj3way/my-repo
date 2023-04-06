// Business
import TradesBusiness from '@/business/trades.business';
import { success, error } from '@/utils/helper.util';
// Libs
import validator from 'validator';


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
    const data = await TradesBusiness.getByStatus(user_id,status);
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
    if(req.body?.purchaseType == 'buy' && req.body?.buy_rate || req.body?.purchaseType == 'sell' && req.body?.sell_rate){
    const data = await TradesBusiness.create(req.body);
    if(data?.message){
      return success(res, data);
    }
    // let created = '_id' in data || 'n' in data;
    // return success(res, 201, { created });
    return res.send({ msg:"Successfully trade create" , data})
  }else{
    return success(res, {"message":"You need to provide the Buy or Sell rate"});
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
   
      const data =  await TradesBusiness.update(req.params.id,req.body);
     // console.log(data,"data");
      let updated = '_id' in data || 'n' in data;
      return success(res, 201, { data });
  } catch (err) {
    error(res, err);
  }
};

const ledgerbalance = async (req, res) => {
  try {
    const broker = req.params.id;
    // Validate data format
    if (!validator.isMongoId(broker)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth User id...'
      };
    }
      const data =  await TradesBusiness.ledgerbalance(broker);
     // console.log(data,"data");
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
    ledgerbalance
};
