import validator from 'validator';
// Business
import AuthBusiness from '@/business/auth.business';
import adminNotificationBusiness from '@/business/adminnotification.bussiness';
import userNotificationBusiness from '@/business/usernotification.bussiness';
import NotificationBusiness from '@/business/notification.bussiness';
// Utils
import { session } from '@/utils/auth.util';
import { success, error, unauthorized } from '@/utils/helper.util';
// Libs
import admin from '@/firebase/firebase';
/**
 * login
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (validator.isEmpty(username)) {
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

    const user = await AuthBusiness.login(username, password);
    if (user) {
      const { _id, permissions } = user;
      const token = await session(_id, { permissions });
      return success(res, { token });
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};

/**
 * register
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (validator.isEmpty(username)) {
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

    const data = await AuthBusiness.register(username, password, req.body);
    let created = '_id' in data || 'n' in data;
    return success(res, 201, { created });
  } catch (err) {
    error(res, err);
  }
};

/**
 * recover
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const recover = async (req, res) => {
  try {
    const { username } = req.body;

    if (validator.isEmpty(username)) {
      throw {
        code: 'ERROR_AUTH_1',
        message: 'The username cannot be empty'
      };
    }

    const data = await AuthBusiness.recover(username);
    return success(res, data);
  } catch (err) {
    error(res, err);
  }
};

/**
 * me
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const me = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (validator.isEmpty(user_id)) {
      throw {
        code: 'ERROR_AUTH_3',
        message: 'The User id cannot be empty'
      };
    }

    if (!validator.isMongoId(user_id)) {
      throw {
        code: 'ERROR_AUTH_4',
        message: 'Invalid auth User id...'
      };
    }

    if (user_id) {
      let data = await AuthBusiness.me(user_id);
      return data ? success(res, data) : unauthorized(res);
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};

/**
 * verify
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const verify = async (req, res) => {
  try {
    const { username, code } = req.body;

    if (validator.isEmpty(username)) {
      throw {
        code: 'ERROR_AUTH_1',
        message: 'The username cannot be empty'
      };
    }

    if (validator.isEmpty(code)) {
      throw {
        code: 'ERROR_AUTH_5',
        message: 'The code cannot be empty'
      };
    }

    const user = await AuthBusiness.verify(username, code);
    if (user) {
      const { _id, permissions } = user;
      const token = await session(_id, { permissions });
      return success(res, { token });
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};

/**
 * register
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (validator.isEmpty(username)) {
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

    const data = await AuthBusiness.registerAdmin(username, password, req.body);
    let created = '_id' in data || 'n' in data;
    return success(res, 201, { created });
  } catch (err) {
    error(res, err);
  }
};

/**
 * login
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

// const loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const payload = {
//       notification: {
//         title: 'New Message',
//         body: 'You have a new message from John'
//       }
//     };

//     const options = {
//       priority: 'high',
//       timeToLive: 60 * 60 * 24 // 1 day
//     };

//     admin
//       .messaging()
//       .sendToDevice(
//         'cUE6jHHizMYLFeaOpLThIR:APA91bFWfQZBtHYWBZlhEkvsiKMhOCqCzefoCXuOa7bR44EffVfq1lvYxPWjPlF9I-Bx1RRB3ssFLnrqHHhG859jl0zG1NPf0IWyby3Jz1aObH6HMYSCH-896g6_DRCcTfgoyxa-LUBr',
//         payload,
//         options
//       )
//       .then((response) => {
//         console.log('Notification sent successfully:', response);
//       })
//       .catch((error) => {
//         console.log('Error sending notification:', error);
//       });

//     if (validator.isEmpty(username)) {
//       throw {
//         code: 'ERROR_AUTH_1',
//         message: 'The username cannot be empty'
//       };
//     }

//     if (validator.isEmpty(password)) {
//       throw {
//         code: 'ERROR_AUTH_2',
//         message: 'The password cannot be empty'
//       };
//     }

//     const user = await AuthBusiness.loginAdmin(username, password);
//     if (user) {
//       const { _id, permissions } = user;
//       const token = await session(_id, { permissions });
//       return success(res, { token });
//     } else {
//       return unauthorized(res);
//     }
//   } catch (err) {
//     error(res, err);
//   }
// };

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (validator.isEmpty(username)) {
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

    const user = await AuthBusiness.loginAdmin(username, password);
    if (user) {
      const { _id, permissions } = user;

      // send notification here

      const token = await session(_id, { permissions });
      return success(res, { token });
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    error(res, err);
  }
};

const getAllUser = async (req, res) => {
  try {
    // Business logic
    const data = await AuthBusiness.getAll();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const updateUser = async (req, res) => {
  try {
    req.body.updated_by = req.user.id;
    const data = await AuthBusiness.update(req.params.id, req.body);
    // let updated = '_id' in data || 'n' in data;
    // return success(res, 201, { updated });
    return res.send({ msg: 'Successfully update funds...', data });
  } catch (err) {
    error(res, err);
  }
};

const updateFund = async (req, res) => {
  try {
    req.body.updated_by = req.user.id;
    const user = await AuthBusiness.updateFund(req.params.id, req.body.funds);
    const payload = {
      notification: {
        title: 'New Notification',
        body: `user ${user.name} update funds ${req.body.funds} `
      }
    };
    await NotificationBusiness.create({notification:payload.notification.body});
    
    const adminnotification = await adminNotificationBusiness.getAll();
    const admintokens = adminnotification.map(user => user.fcm_token);

    const usernotification = await userNotificationBusiness.getAll();
    const usertokens = usernotification.map(user => user.fcm_token);

    const tokens = admintokens || usertokens;
    
    // console.log(user, user);
      if (user?.message) {
        return success(res, user);
      }
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

    return success(res, 201, {
      msg: 'Successfully update funds...',
      user
      // name: user.name,
      // funds: user.funds
    });
  } catch (err) {
    error(res, err);
  }
};

const finduser = async (req, res) => {
  try {
    // console.log(req.user, "suraj");
    req.body.user_id = req.user.id;

    const data = await AuthBusiness.finduser(req.params.id);
    // console.log(data,"data");
    // let updated = '_id' in data || 'n' in data;
    return success(res, 201,  data );
  } catch (err) {
    error(res, err);
  }
};



export default {
  login,
  register,
  recover,
  me,
  verify,
  registerAdmin,
  loginAdmin,
  getAllUser,
  updateUser,
  updateFund,
  finduser
};
