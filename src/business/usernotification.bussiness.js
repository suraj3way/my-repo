// Models
import userNotificationModel from '@/models/usernotification.model';

const create = async (body) => {
  const script = await userNotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {
  // Database query
  return await userNotificationModel.find({ deleted_at: null });
};

const deletuserfcmtokem = async (fcm_tokens) => {
  const result = await userNotificationModel.deleteMany({ fcm_token: fcm_tokens });
  return result;
};

export default {
  create,
  getAll,
  deletuserfcmtokem
};
