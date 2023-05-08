// Models
import AdminNotificationModel from '@/models/adminnotification.model';

const create = async (body) => {
  const script = await AdminNotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {
  // Database query
  return await AdminNotificationModel.find({});
};

const deletadminfcmtokem = async (fcm_tokens) => {
  const result = await AdminNotificationModel.deleteMany({ fcm_token: fcm_tokens });
  return result;
};



export default {
  create,
  getAll,
  deletadminfcmtokem
};
