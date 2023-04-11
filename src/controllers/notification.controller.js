// Business
import NotificationBusiness from '@/business/notification.bussiness';
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
    const data = await NotificationBusiness.create(req.body);
    // let created = '_id' in data || 'n' in data;
    return success(res, 201, data);
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
    const data = await NotificationBusiness.getAll();
    // Return success
    success(res, data);
  } catch (err) {
    // Return error (if any)
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

/**
 * delet
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deletnotification = async (req, res) => {
  try {
    const data = await NotificationBusiness.deletnotification(req.params.id);
    // let updated = '_id' in data || 'n' in data;
    return success(res, 201, data);
  } catch (err) {
    error(res, err);
  }
};

export default {
  createnotification,
  getAllnotification,
  deletnotification
};
