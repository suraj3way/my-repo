// Business
import adminNotificationBusiness from '@/business/adminnotification.bussiness';
import { success, error } from '@/utils/helper.util';

/**
 * create
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createnotification = async (req, res) => {
  try {
    const data = await adminNotificationBusiness.create(req.body);
    let created = '_id' in data || 'n' in data;
    return success(res, 201, created);
  } catch (err) {
    error(res, err);
  }
};

/**
 * getAll
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getAllnotification = async (req, res) => {
  try {
    // Business logic
    const data = await adminNotificationBusiness.getAll();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
    error(res, err);
  }
};

const deletadminfcmtokem = async (req, res) => {
  try {
    let data1 = req.body.fcm_token
    const data = await adminNotificationBusiness.deletadminfcmtokem(data1);
    // let updated = '_id' in data || 'n' in data;
    return success(res, 201, data);
  } catch (err) {
    error(res, err);
  }
};


export default {
  createnotification,
  getAllnotification,
  deletadminfcmtokem
};
