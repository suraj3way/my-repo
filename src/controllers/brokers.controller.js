// Business
import BrokersBusiness from '@/business/broker.business';
import { success, error,unauthorized } from '@/utils/helper.util';
// Libs
import validator from 'validator';
import { session } from '@/utils/auth.util';



/**
 * login
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (validator.isEmpty(email)) {
      throw {
        code: 'ERROR_AUTH_1',
        message: 'The username cannot be empty'
      };
    }

    if (validator.isEmpty(password)) { 
      throw {
        code: 'ERROR_AUTH_2',
        message: 'The password cannot be empty'
      };
    }
 
    const Broker = await BrokersBusiness.login(email, password);
    if (Broker) {
      const { _id, permissions } = Broker;
      const token = await session(_id, { permissions });
      return success(res, { token });
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const getAll = async (req, res) => {
  try {
    // Business logic
    const data = await BrokersBusiness.getAll();
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
    const data = await BrokersBusiness.getAllByStatus(status);
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
    const data = await BrokersBusiness.getAllLogged(user_id);
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
    const data = await BrokersBusiness.getByStatus(user_id,status);
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
const createBroker = async (req, res) => {
  try {
    req.body.created_by = req.user.id;
    req.body.updated_by = req.user.id;
    const data = await BrokersBusiness.create(req.body);
    let created = '_id' in data || 'n' in data;
    return success(res, 201, { created });
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
const updateBroker = async (req, res) => {
  try {
    req.body.updated_by = req.user.id;
    const data = await BrokersBusiness.update(req.params.id,req.body);
    let updated = '_id' in data || 'n' in data;
    return success(res, 201, { updated });
  } catch (err) {
    error(res, err);
  }
};


const buybroker = async (req, res) => {
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
      let data = await BrokersBusiness.buybroker(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const sellbroker = async (req, res) => {
  try {
    const broker_id = req.user.id;
    // console.log(req.user);
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
    // console.log(broker_id);
    if (broker_id) {
      let data = await BrokersBusiness.sellbroker(broker_id);
      // console.log(data);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const totalbroker = async (req, res) => {
  try {
    const broker_id = req.user.id;
    // console.log(req.user);
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
    // console.log(broker_id);
    if (broker_id) {
      let data = await BrokersBusiness.totalbroker(broker_id);
      // console.log(data);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const activebroker = async (req, res) => {
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
      let data = await BrokersBusiness.activebroker(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};




const profitlossbroker = async (req, res) => {
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
      let data = await BrokersBusiness.profitlossbroker(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};




const activebuybroker = async (req, res) => {
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
      let data = await BrokersBusiness.activebuybroker(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};




const activesellbroker = async (req, res) => {
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
      let data = await BrokersBusiness.activesellbroker(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const Brokerage = async (req, res) => {
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
      let data = await BrokersBusiness.Brokerage(broker_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};



const getbrokerageByStatus = async (req, res) => {
    try {
      const broker_id = req.user.id;

      const status = req.params.status;
      if (!['active', 'pending', 'closed'].includes(status)) {
        return res.status(400).send('Invalid status');
      }
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
        let data = await BrokersBusiness.getbrokerageByStatus(broker_id,status);
        return data ? success(res, data) : unauthorized(res);
      } else {
        return unauthorized(res);
      }
    } catch (err) {
      error(res, err);
    }
};





export default { getAll, getAllLogged, createBroker, updateBroker, getAllByStatus,getTradeByStatus,login ,buybroker,sellbroker,totalbroker,activebroker,profitlossbroker,activebuybroker,activesellbroker,Brokerage,getbrokerageByStatus};
