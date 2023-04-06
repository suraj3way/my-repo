// Business
import ScirptBusiness from '@/business/script.business';
import { success, error } from '@/utils/helper.util';



/**
 * create
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createscript = async (req, res) => {
  try {
    const data = await ScirptBusiness.create(req.body);
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

const getAllscript = async (req, res) => {
  try {
    // Business logic
    const data = await ScirptBusiness.getAll();
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
const updatescript = async (req, res) => {
  try {
    req.body.updated_by = req.script_id;
    const data = await ScirptBusiness.update(req.params.id,req.body);
    let updated = '_id' in data || 'n' in data;
    return success(res, 201, data);
  } catch (err) {
    error(res, err);
  }
};




/**
 * delet
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deletscript = async (req, res) => {
  try {
    const data = await ScirptBusiness.deletscript(req.params.id);
    // let updated = '_id' in data || 'n' in data;
    return success(res, 201, data);
  } catch (err) {
    error(res, err);
  }
};





export default {
  createscript, 
  getAllscript,
  updatescript,
  deletscript
};
