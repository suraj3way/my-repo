// Models
import UserModel from '@/models/user.model';
import AdminModel from '@/models/admin.model';
import amountModel from '@/models/amount.model';

/**
 * login
 *
 * @param {*} username
 * @param {*} password
 * @returns {object}
 */
const login = async (username, password) => {
  const user = await UserModel.findOne({
    $or: [
      {
        email: username
      },
      {
        phone: username
      }
    ]
  })
    .select('+password')
    .lean();

  if (user) {
    if (user.deleted_at)
      throw {
        code: 'ERROR_LOGIN_1',
        message: `The user has been banned`
      };
    if (!user.password)
      throw {
        code: 'ERROR_LOGIN_2',
        message: `Don't have a password, try in recover password`
      };
    // const isMatch = await UserModel.compare(password, user.password);
    if (user.password !== password)
      throw {
        code: 'ERROR_LOGIN_3',
        message: `Incorrect password`
      };
    return user;
  } else {
    throw {
      code: 'ERROR_LOGIN_4',
      message: `User not found`
    };
  }
};

/**
 *
 * register
 *
 * @param {*} username
 * @param {*} password
 * @returns {object}
 */
const register = async (username, password, body) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const exists = await UserModel.exists({
    $or: [
      {
        email: username
      },
      {
        phone: username
      }
    ]
  });

  if (exists) {
    throw {
      code: 'ERROR_REGISTER_1',
      message: `${username} is already registered`,
      params: { username }
    };
  } else {
    const query = {};

    if (username.includes('@')) {
      body.email = username;
      body.phone = username;
    } else {
      body.phone = username;
      body.email = username;
    }

    const user = await UserModel.create({
      ...body,
      password,
      funds: body.funds || 0
    });

    // const page = await PagesModel.create({ user: user._id });

    // Send Code
    if (username.includes('@')) {
      // sendEmail({
      //   to: username,
      //   from: "hi@nodetomic.com",
      //   subject: "Nodetomic: bienvenido",
      //   message: `Código: ${code}`,
      //   template: "register",
      //   params: {
      //     code,
      //   },
      // });
    } else {
      // sendSMS({
      //   to: username,
      //   from: "Nodetomic",
      //   message: `Nodetomic: ${code}`,
      // });
    }

    // relate to other collections
    // user.page = page
    // const created = await user.save()

    return user;
  }
};

/**
 * recover
 *
 * @param {*} email
 * @returns {object}
 */
const recover = async (username) => {
  const code = Math.floor(1000 + Math.random() * 9000);

  const user = await UserModel.findOne({
    $or: [
      {
        email: username
      },
      {
        phone: username
      }
    ],
    deleted_at: null
  }).lean();

  if (user) {
    // Send code here via Email
    await UserModel.updateOne({ _id: user._id }, { code_verification: code });

    if (username.includes('@')) {
      // sendEmail({
      //   to: username,
      //   from: "hi@nodetomic.com",
      //   subject: "Nodetomic: recuperar cuenta",
      //   message: `Nodetomic: ${code}`,
      //   template: "recover",
      //   params: {
      //     code,
      //   },
      // });
    } else {
      // sendSMS({
      //   to: username,
      //   from: "Nodetomic",
      //   message: `Nodetomic: ${code}`,
      // });
    }

    return {
      sent: `Sent code to ${username}`
    };
  } else {
    throw {
      code: 'ERROR_RECOVER_1',
      message: `${username} is not registered`,
      params: { username }
    };
  }
};

/**
 * me
 *
 * @param {*} userId
 * @returns {object}
 */
const me = async (user_id) => {
  return await UserModel.findOne({ _id: user_id, deleted_at: null });
};

/**
 * update funds
 *
 * @param {*} userId
 * @returns {object}
 */

const updateFund = async (user_id, funds) => {
  let data = await UserModel.findOneAndUpdate(
    { _id: user_id },
    { funds: Number(funds) }
  );
  const user = await UserModel.findOne({ _id: data }, { name: 1, funds: 1 });
  return user;
};

/**
 * verify
 *
 * @param {*} username
 * @param {*} code
 * @returns {object}
 */
const verify = async (username, code) => {
  const user = await UserModel.findOne({
    $or: [
      {
        email: username
      },
      {
        phone: username
      }
    ],
    code_verification: code,
    deleted_at: null
  }).lean();

  if (user) {
    return await UserModel.findOneAndUpdate(
      { _id: user._id },
      { code_verification: null },
      { new: true }
    );
  } else {
    throw {
      code: 'ERROR_VERIFY_1',
      message: `Invalid code`,
      params: { code }
    };
  }
};

/**
 *
 * register
 *
 * @param {*} username
 * @param {*} password
 * @returns {object}
 */
const registerAdmin = async (username, password, body) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const exists = await AdminModel.exists({
    $or: [
      {
        email: username
      },
      {
        mobile: username
      }
    ]
  });

  if (exists) {
    throw {
      code: 'ERROR_REGISTER_1',
      message: `${username} is already registered`,
      params: { username }
    };
  } else {
    const query = {};

    if (username.includes('@')) {
      body.email = username;
      body.mobile = username;
    } else {
      body.mobile = username;
      body.email = username;
    }

    const user = await AdminModel.create({
      ...body,
      password
    });

    // const page = await PagesModel.create({ user: user._id });

    // Send Code
    if (username.includes('@')) {
      // sendEmail({
      //   to: username,
      //   from: "hi@nodetomic.com",
      //   subject: "Nodetomic: bienvenido",
      //   message: `Código: ${code}`,
      //   template: "register",
      //   params: {
      //     code,
      //   },
      // });
    } else {
      // sendSMS({
      //   to: username,
      //   from: "Nodetomic",
      //   message: `Nodetomic: ${code}`,
      // });
    }

    // relate to other collections
    // user.page = page
    // const created = await user.save()

    return user;
  }
};

/**
 * login
 *
 * @param {*} username
 * @param {*} password
 * @returns {object}
 */
const loginAdmin = async (username, password) => {
  const userAdmin = await AdminModel.findOne({
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
    console.log(userAdmin.password ,'userAdmin.password');
    console.log(password ,'password');
  if (userAdmin) {
    if (!userAdmin.password)
      throw {
        code: 'ERROR_LOGIN_2',
        message: `Don't have a password, try in recover password`
      };
    // const isMatch = await AdminModel.compare(password, userAdmin.password);
  

    if (userAdmin.password !== password)
      throw {
        code: 'ERROR_LOGIN_3',
        message: `Incorrect password`
      };
    //create entry for new model of fcm token
    return userAdmin;
  } else {
    throw {
      code: 'ERROR_LOGIN_4',
      message: `User not found`
    };
  }
};

const getAll = async () => {
  // Database query
  return await UserModel.find({});
};



// const update = async (id, body) => {

//   const trade = UserModel.findByIdAndUpdate(id, body, { new: true })
//   return trade;

// };

const update = async (id, body, password) => {
  // First, verify that the user's id and password match
  const user = await UserModel.findById(id).select('+password');
  if (!user) {
    throw {
      code: 'ERROR_LOGIN_2',
      message: `user not found`
    };
  }
  console.log(body.password, 'body');
  console.log(user.password, 'hdd');
  if (user.password === body.password) {
    const updatedTrade = await UserModel.findByIdAndUpdate(id, body, {
      new: true
    });
    return updatedTrade;
  } else {
    throw {
      message: `your password is incorrect`
    };
  }
};
const finduser = async (userId) => {
  let data = await UserModel.find({ _id: userId });
  //console.log(data,'sdaa');

  return data;
};

const createamount = async (id, body, password) => {
  const user = await UserModel.findById(id).select('+password');
  if (!user) {
    throw {
      code: 'ERROR_LOGIN_2',
      message: `user not found`
    };
  }
  // console.log(body.password, 'body');
  // console.log(user.password, 'hdd');
  if (user.password === body.password) {
    const currentFunds = user.funds || 0;
    const newFunds = parseFloat(currentFunds) + parseFloat(body.funds);
    user.funds = newFunds;
    await updateFund(body?.user_id, newFunds);

    const trade = await amountModel.create({
      ...body
    });

    return trade;
  } else {
    throw {
      message: `your password is incorrect`
    };
  }
};

const findamount = async (userId) => {
  const today = new Date();

  const startOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
  );
  const endOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
  );

  let data = await amountModel.find({
    user_id: userId,
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });
  //console.log(data,'sdaa');
  return data;
};

const findAllamount = async () => {
  const today = new Date();

  const startOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7) - 1)
  );
  const endOfWeek = new Date(
    today.setDate(today.getDate() - ((today.getDay() - 5) % 7))
  );

  const data = await amountModel.find({
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });
  let newdata = [];
  for (let i = 0; i < data.length; i++) {
    const trade = data[i];
    const user = await UserModel.findById(trade.user_id);
    newdata.push({
      ...trade.toObject(),
      name: user.name,
      last_name: user.last_name,
      user_id: user.user_id
    });
  }
  return newdata;
};

export default {
  login,
  register,
  recover,
  me,
  verify,
  registerAdmin,
  loginAdmin,
  getAll,
  updateFund,
  update,
  finduser,
  createamount,
  findamount,
  findAllamount,
};
