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




export default {
  create,
  getAll
};
